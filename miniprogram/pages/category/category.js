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
      { label: 'Default', value: 'default' },
      { label: 'Price Asc', value: 'priceAsc' },
      { label: 'Price Desc', value: 'priceDesc' },
      { label: 'Sales', value: 'sales' }
    ],
    currentSort: 'default',
    sortLabel: 'Default',
    showSortPopup: false,
    page: 1,
    hasMore: true,
    pageSize: 10
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
    if (this.data.loading) return;
    this.setData({ loading: true });
    // Mock data - in a real app, this would be an API call
    setTimeout(() => {
      const { page, pageSize, products, currentCategory, currentSubCategory, currentSort } = this.data;
      const newProducts = Array.from({ length: pageSize }, (_, i) => {
        const productIndex = (page - 1) * pageSize + i;
        return {
          id: `${currentCategory.id}_${productIndex + 1}`,
          name: `${currentCategory.name} Product ${productIndex + 1}`,
          price: Math.floor(Math.random() * 5000) + 1000,
          originalPrice: Math.floor(Math.random() * 1000) + 6000,
          image: `/images/products/products-${(productIndex % 5) + 1}.png`,
          sales: Math.floor(Math.random() * 1000),
          tags: ['New', 'Hot'].filter(() => Math.random() > 0.5)
        };
      });
      let merged = [...products, ...newProducts];
      if (currentSort === 'priceAsc') {
        merged.sort((a, b) => a.price - b.price);
      } else if (currentSort === 'priceDesc') {
        merged.sort((a, b) => b.price - a.price);
      } else if (currentSort === 'sales') {
        merged.sort((a, b) => b.sales - a.sales);
      }
      this.setData({
        products: merged,
        loading: false,
        page: page + 1,
        hasMore: page < 3 // Mock pagination
      });
    }, 500);
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
    const opt = this.data.sortOptions.find(o => o.value === value)
    if (opt) {
      this.setData({
        currentSort: value,
        sortLabel: opt.label,
        showSortPopup: false,
        products: this.sortProducts(this.data.products),
        page: 1,
        hasMore: true
      })
      this.loadProducts()
    }
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
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
  }
}) 