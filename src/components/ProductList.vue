<template>
  <div class="example">
    <virtual-list class="list-infinite scroll-touch" :data-key="'id'" :data-sources="items"
      :data-component="itemComponent" :estimate-size="233" :item-class="'list-item-infinite'"
      :start="activeIndex"
      :footer-class="'loader-wrapper'" v-on:totop="onScrollTop" v-on:tobottom="onScrollBottom"
      :extraProps="{ onProductClick: onProductClick }"  ref="vlist">
      <div slot="footer" class="loader"></div>
    </virtual-list>
  </div>
</template>
  
<script>
import Item from './Item'
import VirtualList from './virtual-list/virtual-list.vue'
import { getProductByPage, emptyPLPStore, appendToPLPStore, getAllProducts } from "../service/product";

export default {
  name: 'ProductList',
  data() {
    return {
      vlist: null,
      store: null, // not required
      pageLoaded: [], // not required
      isLoading: false, // required
      perPage: 10, // required
      currentPage: 0, // required
      activeIndex:0, // default in the first item
      lastPageItemCount: 0, // required
      itemComponent: Item, // required
      items: [], // current temp data
      queryString: '', // required, and after applying filter it should be more usefull 
      history: { url: null, lastPage: null, clickedItem: null, scrolPos: null }
    }
  },
  methods: {
    onScrollTop: function () {
      // console.log("onScrollTop",{pageLoaded: this.pageLoaded,currentPage: this.currentPage,lastPageItemCount: this.lastPageItemCount});
      // this.loadPreviousPage();
    },
    onScrollBottom: async function () {
      console.log("on bottom")
      this.isLoading = true;
      // need logic to identify max page
      if(this.items.length!=0 && this.history){
       console.log(this.history);
          let newProducts = await getProductByPage(this.currentPage + 1, this.perPage);
          this.currentPage = this.currentPage + 1;
          this.pageLoaded.push(this.currentPage);
          this.lastPageItemCount = newProducts.length;
          this.isLoading = false;
          this.items = this.items.concat(newProducts);
          appendToPLPStore(newProducts);
      }
      
    },
    loadInitialData: async function () {
      this.isLoading = true;
      let newProducts = await getProductByPage(this.currentPage, this.perPage, this.queryString);
      this.isLoading = false;
      this.items = this.items.concat(newProducts);
      this.lastPageItemCount = newProducts.length;
      this.currentPage = 0;
      appendToPLPStore(newProducts);
    },
    loadPreviousPage: async function () {

      if (this.pageLoaded.indexOf(0) < 0 && this.currentPage != 0) {
        let newProducts = await getProductByPage(this.currentPage - 1, this.perPage);
        this.isLoading = false;
        this.items = newProducts.concat(this.items);
        this.lastPageItemCount = newProducts.length;
        this.currentPage = this.currentPage - 1;
      } else {
        console.log(`reached top`);
      }

    },
    onProductClick: async function (id, index,ref) {
      let scrollOffset = ref.$el.offsetTop;
      let vlistOffset = this.$refs.vlist.getOffset();
      console.log(vlistOffset);
      console.log("click item offset",scrollOffset)
      window.sessionStorage.setItem("plp_last", 
      JSON.stringify({ url: document.location.href, 
        lastPage: this.currentPage, 
        clickedItem: id, 
        index: index,
        scrollTop: scrollOffset, 
        "vlistOffset": vlistOffset}));
   window.location.href = "demo.html?id=" + id;
    }

  },
  mounted: async function () {

    // read query params, remember  page no should not be part of this query
    let queryString = location.search.slice(1); // remove ? charecter 
    this.queryString = queryString;
    // read history 
    let h = window.sessionStorage.getItem("plp_last") ? JSON.parse(window.sessionStorage.getItem("plp_last")) : null;
    // trying to identify , if the user is back from other page, not in forword flow
    if (h && h.url == document.location.href) {
      try {
       this.activeIndex =  h.index;
        this.items = await getAllProducts();
        setTimeout(()=>{
         // this.$refs.vlist.scrollToIndex(Number(h.index));
          this.$refs.vlist.scrollToOffset(Number(h.vlistOffset)); 
        },0)
        this.currentPage = h.lastPage;
        sessionStorage.removeItem("plp_last");
      
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log("fresh page");
      emptyPLPStore().then(() => {
        this.loadInitialData();
      });

    }

  },
  components: { 'virtual-list': VirtualList }
}
</script>

<style lang="less">
.result {
  margin-bottom: 1em;
}

.list-infinite {
  width: 100%;
  height: 100vh;
  border: 2px solid;
  border-radius: 3px;
  overflow-y: auto;
  border-color: dimgray;
  position: relative;

  .list-item-infinite {
    display: flex;
    align-items: center;
    padding: 1em;
    border-bottom: 1px solid;
    border-color: lightgray;
  }

  .loader-wrapper {
    padding: 1em;
  }

  .loader {
    font-size: 10px;
    margin: 0px auto;
    text-indent: -9999em;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffffff;
    background: linear-gradient(to right, #9b4dca 10%, rgba(255, 255, 255, 0) 42%);
    position: relative;
    animation: load3 1.4s infinite linear;
    transform: translateZ(0);
  }

  .loader:before {
    width: 50%;
    height: 50%;
    background: #9b4dca;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  .loader:after {
    background: #ffffff;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  @-webkit-keyframes load3 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes load3 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>