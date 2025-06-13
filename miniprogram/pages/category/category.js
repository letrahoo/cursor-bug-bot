const app = getApp()

Page({
  data: {
    categories: [],
    currentCategory: null,
    currentSubCategory: null,
    subCategories: [],
    products: [],
    loading: true,
    sortOptions: [
      { value: 'default', label: 'Default' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'sales', label: 'Best Selling' }
    ],
    currentSort: 'default',
    showSortPopup: false,
    page: 1,
    hasMore: true
  },

  onLoad(options) {
    const { id } = options
    this.loadCategories()
    if (id) {
      this.setCurrentCategory(id)
    }
  },

  onPullDownRefresh() {
    this.setData({ 
      loading: true,
      page: 1,
      hasMore: true
    })
    this.loadProducts().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadProducts()
    }
  },

  loadCategories() {
    const categories = app.globalData.categories.map(category => ({
      ...category,
      subCategories: [
        { id: `${category.id}_1`, name: `${category.name} - New Arrivals` },
        { id: `${category.id}_2`, name: `${category.name} - Best Sellers` },
        { id: `${category.id}_3`, name: `${category.name} - On Sale` }
      ]
    }))

    this.setData({ categories })
    if (categories.length > 0 && !this.data.currentCategory) {
      this.setCurrentCategory(categories[0].id)
    }
  },

  setCurrentCategory(id) {
    const category = this.data.categories.find(c => c.id === id)
    if (category) {
      this.setData({
        currentCategory: category,
        currentSubCategory: category.subCategories[0].id,
        subCategories: category.subCategories,
        page: 1,
        hasMore: true,
        products: []
      })
      this.loadProducts()
    }
  },

  loadProducts() {
    this.setData({ loading: true })
    // Mock data - in a real app, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        const products = Array(10).fill(null).map((_, index) => {
          const productIndex = (this.data.page - 1) * 10 + index
          return {
            id: `${this.data.currentCategory.id}_${productIndex + 1}`,
            name: `${this.data.currentCategory.name} Product ${productIndex + 1}`,
            price: Math.floor(Math.random() * 5000) + 1000,
            originalPrice: Math.floor(Math.random() * 1000) + 6000,
            image: `/images/products/product-${(productIndex % 5) + 1}.png`,
            sales: Math.floor(Math.random() * 1000),
            tags: ['New', 'Hot'].filter(() => Math.random() > 0.5)
          }
        })

        const sortedProducts = this.sortProducts(products)

        this.setData({
          products: this.data.page === 1 ? sortedProducts : [...this.data.products, ...sortedProducts],
          loading: false,
          hasMore: this.data.page < 3 // Mock pagination
        })
        resolve()
      }, 500)
    })
  },

  sortProducts(products) {
    const { currentSort } = this.data
    switch (currentSort) {
      case 'price_asc':
        return [...products].sort((a, b) => a.price - b.price)
      case 'price_desc':
        return [...products].sort((a, b) => b.price - a.price)
      case 'sales':
        return [...products].sort((a, b) => b.sales - a.sales)
      default:
        return products
    }
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setCurrentCategory(id)
  },

  onSubCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      currentSubCategory: id,
      page: 1,
      hasMore: true,
      products: []
    })
    this.loadProducts()
  },

  onSortTap() {
    this.setData({ showSortPopup: true })
  },

  onCloseSortPopup() {
    this.setData({ showSortPopup: false })
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset
    this.setData({
      currentSort: value,
      showSortPopup: false,
      products: this.sortProducts(this.data.products)
    })
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    })
  }
}) 