const app = getApp();

Page({
  data: {
    customers: [],
    searchKeyword: '',
    filteredCustomers: [],
    showModal: false,
    modalTitle: '添加客户',
    editId: '',
    formData: {
      name: '',
      phone: '',
      email: '',
      wechat: '',
      company: '',
      address: '',
      note: ''
    }
  },

  onLoad: function () {
    this.loadCustomers();
  },

  loadCustomers: function () {
    const search = this.data.searchKeyword.toLowerCase();
    let customers = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.CUSTOMERS) || '[]');
    
    if (search) {
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.company.toLowerCase().includes(search)
      );
    }
    
    this.setData({
      customers: customers,
      filteredCustomers: customers
    });
  },

  onSearchInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.loadCustomers();
  },

  showAddModal: function () {
    this.setData({
      showModal: true,
      modalTitle: '添加客户',
      editId: '',
      formData: {
        name: '',
        phone: '',
        email: '',
        wechat: '',
        company: '',
        address: '',
        note: ''
      }
    });
  },

  showEditModal: function (e) {
    const id = e.currentTarget.dataset.id;
    const customers = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.CUSTOMERS) || '[]');
    const customer = customers.find(c => c.id === id);
    
    if (customer) {
      this.setData({
        showModal: true,
        modalTitle: '编辑客户',
        editId: id,
        formData: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          wechat: customer.wechat,
          company: customer.company,
          address: customer.address,
          note: customer.note
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

  saveCustomer: function () {
    const { name, phone, email, wechat, company, address, note } = this.data.formData;
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入客户姓名', icon: 'none' });
      return;
    }
    
    const customers = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.CUSTOMERS) || '[]');
    
    if (this.data.editId) {
      const index = customers.findIndex(c => c.id === this.data.editId);
      if (index !== -1) {
        customers[index] = {
          ...customers[index],
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          wechat: wechat.trim(),
          company: company.trim(),
          address: address.trim(),
          note: note.trim()
        };
      }
      wx.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const maxId = Math.max(...customers.map(c => parseInt(c.id.split('-')[1]) || 0), 0);
      customers.push({
        id: 'C-' + (maxId + 1),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        wechat: wechat.trim(),
        company: company.trim(),
        address: address.trim(),
        note: note.trim(),
        createdAt: new Date().toLocaleString()
      });
      wx.showToast({ title: '添加成功', icon: 'success' });
    }
    
    wx.setStorageSync(app.STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.closeModal();
    this.loadCustomers();
  },

  deleteCustomer: function (e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个客户吗？',
      success: (res) => {
        if (res.confirm) {
          let customers = JSON.parse(wx.getStorageSync(app.STORAGE_KEYS.CUSTOMERS) || '[]');
          customers = customers.filter(c => c.id !== id);
          wx.setStorageSync(app.STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.loadCustomers();
        }
      }
    });
  },

  switchTab: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.redirectTo({ url: url });
  }
});