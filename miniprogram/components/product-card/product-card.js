Component({
  properties: {
    product: {
      type: Object,
      value: {}
    },
    showTags: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 组件内部数据
    recommendTitle: '推荐商品'
  },

  lifetimes: {
    attached() {
        const app = getApp();
        const { eventBus } = app.globalData;
        eventBus.on('recommend:update', this.updateRecommendTitle.bind(this));
    },
    detached() {
      const app = getApp();
      const { eventBus } = app.globalData;
      eventBus.off('recommend:update', this.updateRecommendTitle.bind(this));
    }
  },

  methods: {
    onTap() {
      const { product } = this.properties;
      // 触发点击事件，让页面处理跳转
      this.triggerEvent('tap', { product });
    },

    onAddToCart(e) {
      // 阻止事件冒泡，避免触发商品卡片的点击事件
      e.stopPropagation();
      
      const { product } = this.properties;
      const app = getApp();
      const { eventBus } = app.globalData;

      // 触发加入购物车事件
      eventBus.emit('cart:update', {
        type: 'add',
        product,
        items: [...app.globalData.cartItems, product],
        totalItems: app.globalData.cartItems.length + 1
      });

      // 显示提示
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
      });
    },

    updateRecommendTitle(title) {
      this.setData({
        recommendTitle: title
      });
    }
  }
}); 