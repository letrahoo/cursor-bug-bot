const app = getApp()

Page({
  data: {
    banners: [],
    featuredProducts: [],
    categories: [],
    loading: true
  },

  onLoad() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.setData({ loading: true })
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
      this.setData({ loading: false })
    })
  },

  loadData() {
    return new Promise(resolve => {
      this.setData({
        categories: app.globalData.categories,
        banners: app.globalData.banners,
        featuredProducts: app.globalData.featuredProducts,
        loading: false
      })
      resolve()
    })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/category/category?id=${id}`
    })
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    })
  },

  onBannerTap(e) {
    const { link } = e.currentTarget.dataset
    wx.navigateTo({ url: link })
  },

  onSearchTap() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
}) 