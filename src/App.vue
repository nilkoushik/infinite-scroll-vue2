<template>
  <div id="app">
    <ProductList/>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ProductList from './components/ProductList.vue';
export default {
  name: 'App',
  components: {
   // HelloWorld,
    ProductList
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
html,body{
  width: 100vw;
  height: 100vh;
  margin: 0px;
  padding: 0px;
}
</style>
