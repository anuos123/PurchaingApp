<template>
  <div class="product-manager">
    <el-row :gutter="20">
      <el-col :span="8" v-for="product in products" :key="product._id">
        <el-card :body-style="{ padding: '10px' }">
          <div class="product-image">
            <img :src="`https://picsum.photos/200/200?random=${product._id}`" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="description">{{ product.description }}</p>
            <div class="price">¥{{ product.price }}</div>
            <div class="stock">库存: {{ product.stock }}</div>
            <div class="category">分类: {{ product.category }}</div>
            <div class="actions">
              <el-button type="text" @click="editProduct(product)">编辑</el-button>
              <el-button type="text" @click="deleteProduct(product._id)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-button type="primary" @click="showAddModal = true" style="margin-top: 20px">
      添加商品
    </el-button>
    
    <el-dialog title="添加/编辑商品" :visible.sync="showAddModal">
      <el-form :model="productForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-textarea v-model="productForm.description" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="productForm.price" type="number" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input v-model="productForm.stock" type="number" placeholder="请输入商品库存" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="productForm.category" placeholder="请选择分类">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="办公用品" value="办公用品" />
            <el-option label="食品饮料" value="食品饮料" />
            <el-option label="服装鞋帽" value="服装鞋帽" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['refresh']);

const API_BASE = 'http://localhost:3000/api';
const products = ref([]);
const showAddModal = ref(false);
const editingId = ref(null);
const productForm = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: ''
});

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/products/merchant`);
    products.value = response.data;
  } catch (err) {
    console.error('获取商品列表失败:', err);
  }
};

const addProduct = () => {
  editingId.value = null;
  productForm.name = '';
  productForm.description = '';
  productForm.price = 0;
  productForm.stock = 0;
  productForm.category = '';
  showAddModal.value = true;
};

const editProduct = (product) => {
  editingId.value = product._id;
  productForm.name = product.name;
  productForm.description = product.description;
  productForm.price = product.price;
  productForm.stock = product.stock;
  productForm.category = product.category;
  showAddModal.value = true;
};

const saveProduct = async () => {
  try {
    if (editingId.value) {
      await axios.put(`${API_BASE}/products/${editingId.value}`, productForm);
    } else {
      await axios.post(`${API_BASE}/products`, productForm);
    }
    showAddModal.value = false;
    fetchProducts();
    emit('refresh');
  } catch (err) {
    alert(err.response?.data?.msg || '保存失败');
  }
};

const deleteProduct = async (id) => {
  if (!confirm('确定要删除这个商品吗？')) return;
  
  try {
    await axios.delete(`${API_BASE}/products/${id}`);
    fetchProducts();
    emit('refresh');
  } catch (err) {
    alert(err.response?.data?.msg || '删除失败');
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-manager {
  padding: 20px;
}
.product-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.product-info {
  padding: 10px;
}
.product-info h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.description {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.price {
  font-size: 20px;
  color: #E6A23C;
  font-weight: bold;
  margin-bottom: 5px;
}
.stock {
  font-size: 12px;
  color: #67C23A;
  margin-bottom: 5px;
}
.category {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}
.actions {
  display: flex;
  gap: 10px;
}
</style>