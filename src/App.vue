<template>
  <div id="app">
    <router-view />
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from 'axios';
import appFooter from './views/AppFooter';
import Loading from './components/Loading'
import 'font-awesome/css/font-awesome.css';
export default {
  name: 'app',
  components: { appFooter, Loading }
}
</script>

<style lang="scss">
@import "../src/assets/scss/app.scss";
</style>
