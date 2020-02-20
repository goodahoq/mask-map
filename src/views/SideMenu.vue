<template>
  <div class="menu"
       :class="{ 'menu--open' : isOpen}">
    <loading v-if="isLoading"></loading>
    <div v-else
         class="menu__search">
      <div class="menu__search-text">請選擇所在城市與區域</div>
      <div class="menu__county">
        <select id="county"
                class="round-select"
                v-model="selectCounty"
                @change="$store.commit('updateCurrentDistrict','')">
          <option value
                  :disabled="currentCounty !== ''">-- 請選擇城市 --</option>
          <option v-for="c in cityData"
                  :key="c.CityName"
                  :value="c.CityName">{{ c.CityName }}
          </option>
        </select>
      </div>
      <div class="menu__district">
        <select id="district"
                class="round-select"
                v-model="selectDistrict"
                @change="updateDistrict">
          <option value>-- 請選擇地區 --</option>
          <option :value="a.AreaName"
                  v-for="a in districtList"
                  :key="a.AreaName">{{ a.AreaName }}
          </option>
        </select>
      </div>
      <!-- <div class="menu__search-text">選項</div>
      <div class="menu__additional">
        <div class="menu__opening-hour">
          <select id="hour"
                  class="round-select">
            <option value>-- 營業時間 --</option>
          </select>
        </div>
        <div class="menu__mask-num">
          <select id="num"
                  class="round-select">
            <option value>-- 口罩數量 --</option>
          </select>
        </div>
      </div> -->
    </div>
    <div class="menu__list">
      <div class="pharmacy-list"
           v-for="(item,index) in pharmacyList"
           :key="index"
           @click="selectPharmacy(item)">
        <div class="pharmacy-list__card">
          <div class="pharmacy-list__title">{{ item.properties.name }}</div>
          <div class="pharmacy-list__info">
            <div class="pharmacy-list__info-detail">
              <div class="pharmacy-list__info-icon"><i class="fa fa-map-marker"></i></div>
              <div class="pharmacy-list__info-text">{{ item.properties.address }}</div>
            </div>
            <div class="pharmacy-list__info-detail">
              <div class="pharmacy-list__info-icon"><i class="fa fa-phone"></i></div>
              <div class="pharmacy-list__info-text">{{ item.properties.phone }}</div>
            </div>
            <div class="pharmacy-list__info-detail">
              <div class="pharmacy-list__info-icon"><i class="fa fa-comments"></i></div>
              <div class="pharmacy-list__info-text">{{ item.properties.custom_note || '無備註' }}</div>
            </div>
          </div>
          <div class="pharmacy-list__mask-status">
            <div class="pharmacy-list__adult"
                 :class="{ 'pharmacy-list__adult--sold' : item.properties.mask_adult === 0 }">
              <template v-if="item.properties.mask_adult !== 0">成人口罩<div class="pharmacy-list__adult-num">{{ item.properties.mask_adult }}</div>個</template>
              <template v-else>成人口罩售完</template>
            </div>
            <div class="pharmacy-list__child"
                 :class="{ 'pharmacy-list__child--sold' : item.properties.mask_child === 0 }">
              <template v-if="item.properties.mask_child !== 0">兒童口罩<div class="pharmacy-list__child-num">{{ item.properties.mask_child }}</div>個</template>
              <template v-else>兒童口罩售完</template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Loading from '../components/Loading'
import periodTransfer from '../mixins/period_transformer'

import { mapState, mapGetters } from 'vuex'
export default {
  name: 'sideMenu',
  components: { Loading },
  mixins: [periodTransfer],
  mounted () {
    this.$store.dispatch('fetchData')

  },

  computed: {
    ...mapState(['isOpen', 'isLoading', 'cityData', 'pharmacyData', 'currentCounty', 'currentDistrict']),
    selectCounty: {
      get () {
        return this.currentCounty
      },
      set (val) {
        this.$store.commit('updateCurrentCounty', val)
      }
    },
    selectDistrict: {
      get () {
        return this.currentDistrict
      },
      set (val) {
        this.$store.commit('updateCurrentDistrict', val)
      }
    },
    districtList () {
      return this.cityData.find((city) => city.CityName === this.selectCounty) ? this.cityData.find((city) => city.CityName === this.selectCounty).AreaList : []
    },
    pharmacyList () {
      return this.pharmacyData.filter(data => data.properties.address.match(this.currentCounty) && data.properties.address.match(this.currentDistrict))
    }
  },
  methods: {
    updateDistrict (e) {
      console.log('\'currentCounty\', \'currentDistrict\': ', this.currentCounty + this.currentDistrict);
      this.$store.dispatch('updateSelect')
    },
    selectPharmacy (pharmacy) {
      this.$store.dispatch('penTo', pharmacy)
      this.$store.commit('toggleMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>