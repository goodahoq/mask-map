<template>
  <main class="mask-map">
    <side-menu></side-menu>
    <div class="menu-btn"
         :class="{ 'menu-open' : isOpen }"
         @click="handleMenuOpen">
      <div class="close">
        <div class="close-icon"></div>
        <div class="bar-icon"></div>
      </div>
    </div>
    <div id="map"></div>
    <!-- <div class="news-btn" @click="handleNewsOpen">
      <img class="news-icon"
           src="../assets/img/news.png">
    </div>
    <div class="news">
      
    </div> -->
  </main>
</template>

<script>
import sideMenu from './SideMenu'
import { mapState } from 'vuex'

export default {
  name: 'index',
  components: { sideMenu },
  mounted () {
    this.$store.dispatch('renderMap')
  },
  data () {
    return {
      osmMap: {},
    }
  },
  computed: {
    ...mapState(['isOpen', 'isComplete', 'pharmacyData', 'currentCounty', 'currentDistrict'])
  },
  methods: {
    handleMenuOpen () {
      this.$store.commit('toggleMenu')
    },
    handleNewsOpen () {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>