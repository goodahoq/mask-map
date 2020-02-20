import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import L from 'leaflet'
let osmMap = {}

const iconsConfig = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}

const icons = {
  red: new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    ...iconsConfig,
  }),
}

const customPopup = (item) => `
<div class="popup__title">${ item.name }</div>
<div class="popup__address">${ item.address }</div>
<div class="popup__mask-status">
  <div class="popup__adult${item.mask_adult === 0 ? ' popup__adult--sold' : ''}">${item.mask_adult !== 0 ? '成人口罩<div class="popup__adult-num">' + item.mask_adult + '</div> 個' : '成人口罩售完'}</div>
  <div class="popup__child${item.mask_child === 0 ? ' popup__child--sold' : ''}">${item.mask_child !== 0 ? '兒童口罩<div class="popup__child-num">' + item.mask_child + '</div> 個' : '兒童口罩售完'}</div>
</div>
`
const popupOption = {
  minWidth: '250',
  className: 'popup'
}


const osm = {
  addMapMarker(x, y, item) {
    const icon = icons.red
    L.marker([y, x], {
      icon,
      riseOnHover: true
    }).addTo(osmMap).bindPopup(customPopup(item), popupOption)
  },
  removeMapMarker() {
    osmMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        osmMap.removeLayer(layer);
      }
    });
  },
  penTo(x, y, item) {
    const icon = icons.red;
    osmMap.panTo(new L.LatLng(y, x));
    L.marker([y, x], {
      icon,
      riseOnHover: true
    }).addTo(osmMap).bindPopup(customPopup(item), popupOption).openPopup()
    osmMap.setView(new L.LatLng(y, x), 17)
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    isOpen: true,
    cityData: [],
    pharmacyData: [],
    currentCounty: '台北市',
    currentDistrict: '大安區',
    updateTime: '',
    isComplete: false
  },
  mutations: {
    updateLoading(state, val) {
      state.isLoading = val
    },
    toggleMenu(state) {
      state.isOpen = !state.isOpen
    },
    updateCityData(state, val) {
      state.cityData = val
    },
    updatePharmacyData(state, val) {
      state.pharmacyData = val
    },
    updateCurrentCounty(state, val) {
      state.currentCounty = val
    },
    updateCurrentDistrict(state, val) {
      state.currentDistrict = val
    },
    updateFetchTime(state, val) {
      state.updateTime = val
    },
    updateComplete(state, val) {
      state.isComplete = val
    }
  },
  actions: {
    fetchData({
      commit,
      dispatch
    }) {
      commit('updateLoading', true)
      Promise.all([
        axios.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json'),
        axios.get('cityName.json')
      ]).then(([res, city]) => {
        commit('updateComplete', true)
        commit('updateLoading', false)
        commit('updateCityData', city.data)
        commit('updatePharmacyData', res.data.features)
        commit('updateFetchTime', res.data.features[0].properties.updated)
        dispatch('updateMarker')
      })
    },
    renderMap() {
      // OSM
      osmMap = L.map('map', {
        center: [25.03, 121.55],
        zoom: 16,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
        maxZoom: 18,
      }).addTo(osmMap)
    },
    updateMarker({
      state
    }) {
      const stores = state.pharmacyData.filter((store) => {
        if (!state.currentDistrict) {
          return store.properties.address.match(state.currentCounty)
        }
        return store.properties.address.match(state.currentDistrict)
      })
      stores.forEach((store) => {
        const {
          properties,
          geometry
        } = store
        osm.addMapMarker(geometry.coordinates[0], geometry.coordinates[1], properties)
      })
    },
    removeMarker() {
      osm.removeMapMarker()
    },
    penTo({}, store) {
      const {
        properties,
        geometry
      } = store
      osm.penTo(geometry.coordinates[0], geometry.coordinates[1], properties)
    },
    updateSelect({
      state,
      dispatch
    }) {
      dispatch('removeMarker')
      dispatch('updateMarker')
      const store = state.pharmacyData.find(item => item.properties.address.match(state.currentDistrict))
      const {
        geometry,
        properties
      } = store
      osm.penTo(geometry.coordinates[0], geometry.coordinates[1], properties)
    }
  }
})
