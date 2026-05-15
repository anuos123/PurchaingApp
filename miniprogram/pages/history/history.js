const app = getApp();

Page({
  data: {
    history: [],
    filteredHistory: [],
    filterType: 'all',
    filterOptions: [
      { value: 'all', label: '全部' },
      { value: 'today', label: '当天' },
      { value: '3days', label: '近3天' },
      { value: '7days', label: '近7天' },
      { value: '15days', label: '近15天' },
      { value: 'month', label: '本月' }
    ],
    totalAmount: 0,
    totalCount: 0
  },

  onLoad: function () {
    this.loadHistory();
  },

  loadHistory: function () {
    const history = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.PURCHASE_HISTORY) || '[]');
    this.filterHistory(history);
  },

  filterHistory: function (history) {
    let filtered = history;
    const now = new Date();
    
    switch (this.data.filterType) {
      case 'today':
        filtered = history.filter(h => h.date === now.toLocaleDateString());
        break;
      case '3days':
        filtered = history.filter(h => {
          const hDate = new Date(h.date);
          const diffDays = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));
          return diffDays <= 3;
        });
        break;
      case '7days':
        filtered = history.filter(h => {
          const hDate = new Date(h.date);
          const diffDays = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        });
        break;
      case '15days':
        filtered = history.filter(h => {
          const hDate = new Date(h.date);
          const diffDays = Math.floor((now - hDate) / (1000 * 60 * 60 * 24));
          return diffDays <= 15;
        });
        break;
      case 'month':
        filtered = history.filter(h => {
          const hDate = new Date(h.date);
          return hDate.getMonth() === now.getMonth() && hDate.getFullYear() === now.getFullYear();
        });
        break;
    }
    
    const totalAmount = filtered.reduce((sum, h) => sum + h.totalAmount, 0);
    const totalCount = filtered.reduce((sum, h) => sum + h.items.length, 0);
    
    this.setData({
      history: history,
      filteredHistory: filtered,
      totalAmount: totalAmount,
      totalCount: totalCount
    });
  },

  onFilterChange: function (e) {
    const value = e.detail.value;
    this.setData({
      filterType: this.data.filterOptions[value].value
    });
    this.loadHistory();
  },

  clearHistory: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史采购记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync(app.STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify([]));
          wx.showToast({ title: '清空成功', icon: 'success' });
          this.loadHistory();
        }
      }
    });
  },

  switchTab: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.redirectTo({ url: url });
  }
});