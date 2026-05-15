<template>
  <div class="order-manager">
    <el-table :data="orders" border>
      <el-table-column prop="_id" label="订单编号" width="200" />
      <el-table-column label="商品列表" width="300">
        <template #default="scope">
          <div v-for="item in scope.row.products" :key="item.productId">
            {{ item.name }} x {{ item.quantity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="总金额">
        <template #default="scope">
          ¥{{ scope.row.totalAmount }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userId.name" label="买家" />
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-select v-model="scope.row.status" @change="updateStatus(scope.row)">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-if="orders.length > 0"
      layout="prev, pager, next"
      :total="orders.length"
      :page-size="10"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['refresh']);

const API_BASE = 'http://localhost:3000/api';
const orders = ref([]);

const statusOptions = [
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'shipped', label: '已发货' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/orders`);
    orders.value = response.data;
  } catch (err) {
    console.error('获取订单列表失败:', err);
  }
};

const updateStatus = async (order) => {
  try {
    await axios.put(`${API_BASE}/orders/${order._id}/status`, {
      status: order.status
    });
    emit('refresh');
  } catch (err) {
    alert(err.response?.data?.msg || '更新状态失败');
    fetchOrders();
  }
};

const getStatusText = (status) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || 'default';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN');
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-manager {
  padding: 20px;
}
</style>