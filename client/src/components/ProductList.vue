<template>
  <div class="product-list">
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
            <div class="merchant">商家: {{ product.merchantId?.name }}</div>
            <el-button type="primary" @click="buyProduct(product)" :disabled="product.stock <= 0">
              {{ product.stock <= 0 ? '库存不足' : '立即购买' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-dialog title="确认购买" :visible.sync="showBuyModal">
      <el-form :model="buyForm" label-width="80px">
        <el-form-item label="购买数量">
          <el-input-number v-model="buyForm.quantity" :min="1" :max="selectedProduct?.stock || 1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBuyModal = false">取消</el-button>
        <el-button type="primary" @click="confirmBuy">确认购买</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['buy']);

const API_BASE = '/api';
const products = ref([]);
const showBuyModal = ref(false);
const selectedProduct = ref(null);
const buyForm = reactive({
  quantity: 1
});

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE}/products`);
    products.value = response.data;
  } catch (err) {
    console.error('获取商品列表失败:', err);
  }
};

const buyProduct = (product) => {
  selectedProduct.value = product;
  buyForm.quantity = 1;
  showBuyModal.value = true;
};

const confirmBuy = async () => {
  try {
    const response = await axios.post(`${API_BASE}/orders`, {
      items: [{
        productId: selectedProduct.value._id,
        quantity: buyForm.quantity
      }]
    });
    alert('购买成功！');
    showBuyModal.value = false;
    fetchProducts();
    emit('buy', response.data);
  } catch (err) {
    alert(err.response?.data?.msg || '购买失败');
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-list {
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
.merchant {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}
</style>