App({
  STORAGE_KEYS: {
    INGREDIENTS: 'ingredients',
    PURCHASES: 'purchases',
    PURCHASE_HISTORY: 'purchase_history',
    CUSTOMERS: 'customers'
  },

  onLaunch: function () {
    this.initData();
  },

  initData: function () {
    const keys = this.STORAGE_KEYS;
    
    if (!wx.getStorageSync(keys.INGREDIENTS)) {
      wx.setStorageSync(keys.INGREDIENTS, JSON.stringify([
        { id: 'I-1', name: '西红柿', category: '蔬菜', spec: '500g', price: 3.5, note: '新鲜', createdAt: '2024-01-01 10:00:00' },
        { id: 'I-2', name: '冻鸡腿', category: '冻品', spec: '1kg', price: 20.0, note: '冷冻', createdAt: '2024-01-01 10:01:00' },
        { id: 'I-3', name: '猪肉', category: '肉类', spec: '500g', price: 25.0, note: '五花肉', createdAt: '2024-01-01 10:02:00' },
        { id: 'I-4', name: '白菜', category: '蔬菜', spec: '1颗', price: 2.0, note: '', createdAt: '2024-01-01 10:03:00' },
        { id: 'I-5', name: '生抽', category: '酱料', spec: '500ml', price: 8.0, note: '酿造酱油', createdAt: '2024-01-01 10:04:00' },
        { id: 'I-6', name: '冻虾仁', category: '冻品', spec: '500g', price: 35.0, note: '南美白虾', createdAt: '2024-01-01 10:05:00' },
        { id: 'I-7', name: '牛肉', category: '肉类', spec: '500g', price: 45.0, note: '牛腩', createdAt: '2024-01-01 10:06:00' },
        { id: 'I-8', name: '蚝油', category: '酱料', spec: '500g', price: 12.0, note: '', createdAt: '2024-01-01 10:07:00' }
      ]));
    }
    
    if (!wx.getStorageSync(keys.PURCHASES)) {
      wx.setStorageSync(keys.PURCHASES, JSON.stringify([]));
    }
    
    if (!wx.getStorageSync(keys.PURCHASE_HISTORY)) {
      wx.setStorageSync(keys.PURCHASE_HISTORY, JSON.stringify([]));
    }
    
    if (!wx.getStorageSync(keys.CUSTOMERS)) {
      wx.setStorageSync(keys.CUSTOMERS, JSON.stringify([
        { id: 'C-1', name: '张三', phone: '13800138001', email: 'zhang@test.com', wechat: 'zhangsan', company: 'XX公司', address: '北京市朝阳区', note: 'VIP客户', createdAt: '2024-01-01 10:00:00' },
        { id: 'C-2', name: '李四', phone: '13800138002', email: 'li@test.com', wechat: 'lisi', company: 'YY公司', address: '上海市浦东新区', note: '', createdAt: '2024-01-02 11:00:00' }
      ]));
    }
  },

  globalData: {
    version: '1.0.0'
  }
});