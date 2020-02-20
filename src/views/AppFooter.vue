<template>
  <div class="footer">
    <div class="footer__info">
      <div class="footer__info--text">口罩地圖</div>
      <div class="footer__info--time-stamp">{{ updatedTimeFormatter }}</div>
    </div>
    <div class="footer__des">@ 2020 口罩地圖 design by @ejj</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'appFooter',
  computed: {
    ...mapState(['updateTime']),
    updatedTimeFormatter () {
      return dayjs(this.updateTime).format('YYYY.MM.DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>