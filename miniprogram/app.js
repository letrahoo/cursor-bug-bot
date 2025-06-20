App({
  globalData: {
    userInfo: null,
    cartItems: [],
    categories: [
      {
        id: 'phones',
        name: 'Phones',
        icon: '/images/categories/categories-1.png'
      },
      {
        id: 'laptops',
        name: 'Laptops',
        icon: '/images/categories/categories-2.png'
      },
      {
        id: 'tablets',
        name: 'Tablets',
        icon: '/images/categories/categories-3.png'
      },
      {
        id: 'accessories',
        name: 'Accessories',
        icon: '/images/categories/categories-4.png'
      }
    ],
    banners: [
      {
        id: 1,
        imageUrl: '/images/banners/banners-1.png',
        link: '/pages/product/detail?id=1'
      },
      {
        id: 2,
        imageUrl: '/images/banners/banners-2.png',
        link: '/pages/category/category?id=2'
      }
    ],
    featuredProducts: [
      {
        id: 1,
        name: 'iPhone 13 Pro',
        price: 7999,
        image: '/images/products/products-1.png',
        tags: ['New', 'Hot']
      },
      {
        id: 2,
        name: 'MacBook Pro M1',
        price: 12999,
        image: '/images/products/products-2.png',
        tags: ['Best Seller']
      }
    ]
  },
  onLaunch() {
    // Check login status
    wx.checkSession({
      fail: () => {
        // Session expired, need to login again
        this.login()
      }
    })
  },
  login() {
    wx.login({
      success: res => {
        if (res.code) {
          // Send res.code to backend to get openId, sessionKey, unionId
          console.log('Login success:', res.code)
        } else {
          console.log('Login failed:', res.errMsg)
        }
      }
    })
  }
}) 