function periodTransfer(period, status) {
  const arr = period.split('、')
  let temp = arr.filter(ele => {
    return status === 'open' ? !ele.match('休診') : ele.match('休診')
  })
}

export default {
  methods: {
    periodTransfer
  }
}
