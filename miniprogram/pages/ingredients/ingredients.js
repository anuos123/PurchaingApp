const app = getApp();

Page({
  data: {
    ingredients: [],
    searchKeyword: '',
    selectedCategory: '',
    filterResult: '',
    showModal: false,
    modalTitle: '添加食材',
    editId: '',
    formData: {
      name: '',
      category: '蔬菜',
      spec: '',
      price: '',
      note: ''
    },
    categories: ['冻品', '酱料', '蔬菜', '肉类'],
    categoryColors: {
      '冻品': '#409EFF',
      '酱料': '#E6A23C',
      '蔬菜': '#67C23A',
      '肉类': '#F56C6C'
    }
  },

  onLoad: function () {
    this.loadIngredients();
  },

  loadIngredients: function () {
    const search = this.data.searchKeyword.toLowerCase();
    const category = this.data.selectedCategory;
    
    let ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
    const totalCount = ingredients.length;
    
    ingredients = ingredients.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(search);
      const matchCategory = !category || i.category === category;
      return matchSearch && matchCategory;
    });
    
    let filterResult = '';
    if (search || category) {
      filterResult = `从 ${totalCount} 条食材中找到 ${ingredients.length} 条匹配数据`;
      if (search) filterResult += ` 关键词: ${search}`;
      if (category) filterResult += ` 分类: ${category}`;
    }
    
    this.setData({
      ingredients: ingredients,
      filterResult: filterResult
    });
  },

  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.loadIngredients();
  },

  onCategoryChange: function (e) {
    this.setData({
      selectedCategory: e.detail.value
    });
    this.loadIngredients();
  },

  clearFilter: function () {
    this.setData({
      searchKeyword: '',
      selectedCategory: '',
      filterResult: ''
    });
    this.loadIngredients();
  },

  showAddModal: function () {
    this.setData({
      showModal: true,
      modalTitle: '添加食材',
      editId: '',
      formData: {
        name: '',
        category: '蔬菜',
        spec: '',
        price: '',
        note: ''
      }
    });
  },

  showEditModal: function (e) {
    const id = e.currentTarget.dataset.id;
    const ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
    const ingredient = ingredients.find(i => i.id === id);
    
    if (ingredient) {
      this.setData({
        showModal: true,
        modalTitle: '编辑食材',
        editId: id,
        formData: {
          name: ingredient.name,
          category: ingredient.category,
          spec: ingredient.spec,
          price: ingredient.price.toString(),
          note: ingredient.note
        }
      });
    }
  },

  closeModal: function () {
    this.setData({
      showModal: false
    });
  },

  onFormInput: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  saveIngredient: function () {
    const { name, category, spec, price, note } = this.data.formData;
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入食材名称', icon: 'none' });
      return;
    }
    
    const ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
    
    if (this.data.editId) {
      const index = ingredients.findIndex(i => i.id === this.data.editId);
      if (index !== -1) {
        ingredients[index] = {
          ...ingredients[index],
          name: name.trim(),
          category,
          spec: spec.trim() || '-',
          price: parseFloat(price) || 0,
          note: note.trim() || '-'
        };
      }
      wx.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const maxId = Math.max(...ingredients.map(i => parseInt(i.id.split('-')[1]) || 0), 0);
      ingredients.push({
        id: 'I-' + (maxId + 1),
        name: name.trim(),
        category,
        spec: spec.trim() || '-',
        price: parseFloat(price) || 0,
        note: note.trim() || '-',
        createdAt: new Date().toLocaleString()
      });
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    
    wx.setStorageSync(app.STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
    this.closeModal();
    this.loadIngredients();
  },

  deleteIngredient: function (e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个食材吗？',
      success: (res) => {
        if (res.confirm) {
          let ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
          ingredients = ingredients.filter(i => i.id !== id);
          wx.setStorageSync(app.STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.loadIngredients();
        }
      }
    });
  },

  exportIngredients: function () {
    const ingredients = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.INGREDIENTS) || '[]');
    
    if (ingredients.length === 0) {
      wx.showToast({ title: '暂无数据', icon: 'none' });
      return;
    }
    
    let csv = '食材名称,分类,规格,预估单价,备注,创建时间\n';
    ingredients.forEach(i => {
      csv += `"${i.name}","${i.category}","${i.spec}",${i.price},"${i.note}","${i.createdAt}"\n`;
    });
    
    wx.showToast({ title: '导出成功', icon: 'success' });
    console.log('导出数据:', csv);
  },

  switchTab: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.redirectTo({ url: url });
  }
});