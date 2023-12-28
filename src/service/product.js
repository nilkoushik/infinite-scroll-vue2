import Data from "../data/photos.json";
import _ from "lodash";
import Dexie from "dexie";

export async function getProductByPage(pageNo, perPage){
    
    // mix default config and updated config
    let config  = {
        // pageNo:1,
        // perPage:10,
        ...{pageNo, perPage}
    };

    let paginatedData = _.chunk(Data,config.perPage);
 
    // setTimeout(() => {
        try{
            console.log("starting",paginatedData[config.pageNo][0].id);
                return paginatedData[config.pageNo];

        }catch(e){
            return paginatedData[1];
        }
    // }, 2000);
    

}

export async function getDBInstance(){
    try {
        const db = await new Dexie('SF');
        db.version(1).stores({
            plp: 'id,albumId,title,url, thumbnail'
        });
        db.open().catch ( (err)=> {
            console.error('Failed to open db: ' + (err.stack || err));
        });
        return db;
    } catch(e){
        console.log(e);
    }
}
export async function getPLPStore(){
    let db  =  await getDBInstance();
    try {
        return db.plp;
        
    } catch(e){
        console.log(e);
    }
}
export async function getAllProducts(){
    let store = await getPLPStore();
    let data = [];
    try {
      await  store.toArray((d)=>{

        data = d;
        })
        
        return data;
    } catch(e){
        console.log(e);
        return false;
    }
}
export async function emptyPLPStore(){
    let db  =  await getDBInstance();
    try {
        await db.plp.clear();
        db.stores({
            plp: null
        });
        return db;
        
    } catch(e){
        console.log(e);
    }
}
export async function appendToPLPStore(data){
    console.log("appending record", data);
    // or make a new one
    // let db  = await getDBInstance();

    let store = await getPLPStore();
    try {
        await store.bulkAdd(data);
    }catch(e){
        console.log(e);
        console.log("assuming a page refresh")
    }
	
    return true;
}