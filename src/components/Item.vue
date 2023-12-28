<template>
  <div @click="onProductClick(source.id,index,ref)" class="item_row">
    <div>{{ source.id }} - {{ source.title }}</div>
    <div><img :src="source.thumbnailUrl" /> </div>
  </div>
</template>
  
  <script>
    export default {
      name: 'product-item',
      data:function(){
        return {
          ref:this
        }
      },
      props: {
        index: { // index of current item
          type: Number
        },
        onProductClick:{
          type: Function
        },
        source: { // here is: {uid: 'unique_1', text: 'abc'}
          type: Object,
          default () {
            return {}
          }
        }
      },
      methods:{
        gotoPDP:function(index){
          console.log(index)
        }
      },
      mounted:function(){
     
      }

    }
  </script>
  <style>
.item_row{
  height: 200px;
}
</style>