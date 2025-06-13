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
      { label: '默认排序', value: 'default' },
      { label: '价格从低到高', value: 'priceAsc' },
      { label: '价格从高到低', value: 'priceDesc' },
      { label: '销量优先', value: 'sales' }
    ],
    currentSort: 'default',
    sortLabel: '默认排序',
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
      hasMore: true,
      products: []
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
        { id: `${category.id}_1`, name: `${category.name} - 新品` },
        { id: `${category.id}_2`, name: `${category.name} - 热销` },
        { id: `${category.id}_3`, name: `${category.name} - 促销` }
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
    
    // 模拟数据加载
    setTimeout(() => {
      const { page, pageSize, products, currentCategory, currentSubCategory, currentSort } = this.data;
      const newProducts = Array.from({ length: pageSize }, (_, i) => {
        const productIndex = (page - 1) * pageSize + i;
        return {
          id: `${currentCategory.id}_${productIndex + 1}`,
          name: `${currentCategory.name} 商品 ${productIndex + 1}`,
          price: Math.floor(Math.random() * 5000) + 1000,
          originalPrice: Math.floor(Math.random() * 1000) + 6000,
          image: `/images/products/products-${(productIndex % 5) + 1}.png`,
          sales: Math.floor(Math.random() * 1000),
          tags: ['新品', '热销'].filter(() => Math.random() > 0.5)
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
        hasMore: page < 3 // 模拟分页
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

  sortProducts(products) {
    const { currentSort } = this.data
    switch (currentSort) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price)
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price)
      case 'sales':
        return [...products].sort((a, b) => b.sales - a.sales)
      default:
        return products
    }
  },

  onProductTap(e) {
    const { product } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/detail?id=${product.id}`
    })
  },
  startRecLoop() {
    // 第一次需要手动切换下第二条
    this.timeoutId1 = setTimeout(() => {
        this.setData({
            showFirstRec: !this.data.showFirstRec
        });
    }, 6600);

    // 注册定时切换
    this.intervalId = setInterval(() => {
        this.timeoutId2 = setTimeout(() => {
            this.setData({
                showFirstRec: !this.data.showFirstRec
            });
        }, 6600);
    }, 13200);
  },

  onUnload() {
    // 清理所有定时器
    if (this.timeoutId1) {
      clearTimeout(this.timeoutId1);
    }
    if (this.timeoutId2) {
      clearTimeout(this.timeoutId2);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}) 