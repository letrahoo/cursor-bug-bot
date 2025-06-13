import eventBus from './utils/event-bus';

App({
  globalData: {
    userInfo: null,
    cartItems: [],
    eventBus,
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

    // Setup global event handlers
    const { eventBus } = this.globalData;
    
    // Listen for cart updates
    eventBus.on('cart:update', (cartData) => {
      // Update global cart items
      this.globalData.cartItems = cartData.items;
      
      // Update cart badge if needed
      if (cartData.totalItems !== undefined) {
        wx.setTabBarBadge({
          index: 2, // Assuming cart tab is at index 2
          text: cartData.totalItems.toString()
        }).catch(() => {
          // If badge setting fails (e.g., no items), remove badge
          wx.removeTabBarBadge({ index: 2 });
        });
      }
    });

    // Listen for user login/logout
    eventBus.on('user:login', (userInfo) => {
      this.globalData.userInfo = userInfo;
      // Sync cart data after login if needed
      this.syncCartData();
    });

    eventBus.on('user:logout', () => {
      this.globalData.userInfo = null;
      this.globalData.cartItems = [];
      // Clear cart badge
      wx.removeTabBarBadge({ index: 2 });
    });
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
  },
  // Add a helper method for cart data sync
  syncCartData() {
    // In a real app, this would sync cart data with the server
    const { eventBus } = this.globalData;
    // Mock sync - in real app, this would be an API call
    setTimeout(() => {
      eventBus.emit('cart:update', {
        items: this.globalData.cartItems,
        totalItems: this.globalData.cartItems.length
      });
    }, 100);
  }
}) 