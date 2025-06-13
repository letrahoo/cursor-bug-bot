const app = getApp()

Page({
  data: {
    product: null,
    selectedSpec: null,
    quantity: 1,
    loading: true,
    showSpecPopup: false,
    showCartPopup: false,
    specifications: [],
    currentTab: 'detail', // detail, specs, reviews
    reviews: []
  },

  onLoad(options) {
    const { id } = options
    this.loadProductDetail(id)
    this.loadReviews(id)
  },

  onPullDownRefresh() {
    const { id } = this.data.product
    this.setData({ loading: true })
    Promise.all([
      this.loadProductDetail(id),
      this.loadReviews(id)
    ]).then(() => {
      wx.stopPullDownRefresh()
      this.setData({ loading: false })
    })
  },

  loadProductDetail(id) {
    // Mock data - in a real app, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        const productIndex = parseInt(id.split('_')[1]) || 1
        this.setData({
          product: {
            id: id,
            name: `Product ${productIndex}`,
            price: Math.floor(Math.random() * 5000) + 1000,
            originalPrice: Math.floor(Math.random() * 1000) + 6000,
            stock: Math.floor(Math.random() * 100) + 50,
            sales: Math.floor(Math.random() * 1000),
            images: [
              `/images/products/products-${(productIndex % 5) + 1}.png`,
              `/images/products/products-${((productIndex + 1) % 5) + 1}.png`,
              `/images/products/products-${((productIndex + 2) % 5) + 1}.png`
            ],
            description: 'This is a high-quality product with amazing features. It offers excellent performance and durability. Perfect for everyday use.',
            specifications: [
              { name: 'Color', options: ['Black', 'White', 'Silver', 'Gold'] },
              { name: 'Storage', options: ['64GB', '128GB', '256GB', '512GB'] }
            ],
            features: [
              'High-quality materials',
              'Advanced technology',
              'Long battery life',
              'Fast charging',
              'Premium design'
            ]
          },
          loading: false
        })
        resolve()
      }, 500)
    })
  },

  loadReviews(id) {
    // Mock data - in a real app, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        this.setData({
          reviews: [
            {
              id: 1,
              user: 'John Doe',
              rating: 5,
              content: 'Great product, amazing quality! The features are exactly as described.',
              date: '2024-03-15',
              images: ['/images/reviews/review-1.png']
            },
            {
              id: 2,
              user: 'Jane Smith',
              rating: 4,
              content: 'Good product but a bit expensive. Overall satisfied with the purchase.',
              date: '2024-03-14',
              images: []
            }
          ]
        })
        resolve()
      }, 500)
    })
  },

  onImagePreview(e) {
    const { current } = e.currentTarget.dataset
    wx.previewImage({
      current,
      urls: this.data.product.images
    })
  },

  onSpecSelect(e) {
    const { spec, value } = e.currentTarget.dataset
    this.setData({
      [`selectedSpec.${spec}`]: value
    })
  },

  onQuantityChange(e) {
    const { type } = e.currentTarget.dataset
    const { quantity, product } = this.data
    const newQuantity = type === 'plus' 
      ? Math.min(quantity + 1, product.stock)
      : Math.max(quantity - 1, 1)
    
    this.setData({ quantity: newQuantity })
  },

  onAddToCart() {
    if (!this.data.selectedSpec) {
      this.setData({ showSpecPopup: true })
      return
    }
    // In a real app, this would be an API call
    this.setData({ showCartPopup: true })
  },

  onBuyNow() {
    if (!this.data.selectedSpec) {
      this.setData({ showSpecPopup: true })
      return
    }
    // In a real app, this would navigate to checkout
    wx.showToast({
      title: 'Coming soon',
      icon: 'none'
    })
  },

  onClosePopup() {
    this.setData({
      showSpecPopup: false,
      showCartPopup: false
    })
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ currentTab: tab })
  },

  onGoToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  }
}) 