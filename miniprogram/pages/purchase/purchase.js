const app = getApp();

Page({
  data: {
    purchases: [],
    showAddModal: false,
    showSelectModal: false,
    availableIngredients: [],
    selectedIngredients: [],
    formData: {
      name: '',
      quantity: 1,
      price: '',
      note: ''
    },
    statusOptions: [
      { value: 'pending', label: '未买', color: '#fff3cd' },
      { value: 'outOfStock', label: '缺货', color: '#f8d7da' },
      { value: 'completed', label: '已买', color: '#d4edda' }
    ],
    totalAmount: 0
  },

  onLoad: function () {
    this.loadPurchases();
  },

  loadPurchases: function () {
    const purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
    
    const totalAmount = purchases.reduce((sum, p) => {
      return sum + (p.quantity * p.price);
    }, 0);
    
    this.setData({
      purchases: purchases,
      totalAmount: totalAmount
    });
  },

  showSelectModal: function () {
    const ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
    const purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
    const purchaseNames = purchases.map(p => p.name);
    
    const availableIngredients = ingredients.map(i => ({
      ...i,
      selected: false,
      quantity: 1,
      customPrice: i.price
    })).filter(i => !purchaseNames.includes(i.name));
    
    this.setData({
      showSelectModal: true,
      availableIngredients: availableIngredients,
      selectedIngredients: []
    });
  },

  closeSelectModal: function () {
    this.setData({
      showSelectModal: false
    });
  },

  toggleIngredient: function (e) {
    const index = e.currentTarget.dataset.index;
    const availableIngredients = [...this.data.availableIngredients];
    availableIngredients[index].selected = !availableIngredients[index].selected;
    
    const selectedIngredients = availableIngredients.filter(i => i.selected);
    
    this.setData({
      availableIngredients: availableIngredients,
      selectedIngredients: selectedIngredients
    });
  },

  updateQuantity: function (e) {
    const index = e.currentTarget.dataset.index;
    const availableIngredients = [...this.data.availableIngredients];
    availableIngredients[index].quantity = parseInt(e.detail.value) || 1;
    this.setData({
      availableIngredients: availableIngredients
    });
  },

  updatePrice: function (e) {
    const index = e.currentTarget.dataset.index;
    const availableIngredients = [...this.data.availableIngredients];
    availableIngredients[index].customPrice = parseFloat(e.detail.value) || 0;
    this.setData({
      availableIngredients: availableIngredients
    });
  },

  addSelectedIngredients: function () {
    const selected = this.data.selectedIngredients;
    
    if (selected.length === 0) {
      wx.showToast({ title: '请选择食材', icon: 'none' });
      return;
    }
    
    const purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
    
    selected.forEach(ingredient => {
      const existing = purchases.find(p => p.name === ingredient.name);
      
      if (existing) {
        const totalQty = existing.quantity + ingredient.quantity;
        const totalPrice = (existing.quantity * existing.price) + (ingredient.quantity * ingredient.customPrice);
        existing.quantity = totalQty;
        existing.price = totalPrice / totalQty;
      } else {
        purchases.push({
          id: 'P-' + Date.now(),
          name: ingredient.name,
          ingredientName: ingredient.name,
          quantity: ingredient.quantity,
          price: ingredient.customPrice,
          note: ingredient.note,
          status: 'pending',
          createdAt: new Date().toLocaleString()
        });
      }
    });
    
    wx.setStorageSync(app.STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    wx.showToast({ title: '添加成功', icon: 'success' });
    this.closeSelectModal();
    this.loadPurchases();
  },

  updateStatus: function (e) {
    const id = e.currentTarget.dataset.id;
    const status = e.detail.value;
    
    const purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
    const index = purchases.findIndex(p => p.id === id);
    
    if (index !== -1) {
      purchases[index].status = status;
      wx.setStorageSync(app.STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
      this.loadPurchases();
    }
  },

  deletePurchase: function (e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个采购项吗？',
      success: (res) => {
        if (res.confirm) {
          let purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
          purchases = purchases.filter(p => p.id !== id);
          wx.setStorageSync(app.STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.loadPurchases();
        }
      }
    });
  },

  completeTodayPurchases: function () {
    const purchases = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASES) || '[]');
    const completed = purchases.filter(p => p.status === 'completed');
    const notCompleted = purchases.filter(p => p.status !== 'completed');
    
    if (completed.length === 0) {
      wx.showToast({ title: '没有已完成的采购项', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '确认完成',
      content: `即将完成 ${completed.length} 项采购，${notCompleted.length} 项未完成的将保留。确认继续？`,
      success: (res) => {
        if (res.confirm) {
          const history = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASE_HISTORY) || '[]');
          
          const todayRecord = {
            id: 'H-' + Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            items: completed,
            totalAmount: completed.reduce((sum, p) => sum + p.quantity * p.price, 0),
            createdAt: new Date().toLocaleString()
          };
          
          history.push(todayRecord);
          wx.setStorageSync(app.STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(history));
          wx.setStorageSync(app.STORAGE_KEYS.PURCHASES, JSON.stringify(notCompleted));
          
          wx.showToast({ title: '完成成功', icon: 'success' });
          this.loadPurchases();
        }
      }
    });
  },

  clearAllPurchases: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有采购任务吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync(app.STORAGE_KEYS.PURCHASES, JSON.stringify([]));
          wx.showToast({ title: '清空成功', icon: 'success' });
          this.loadPurchases();
        }
      }
    });
  },

  switchTab: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.redirectTo({ url: url });
  }
});