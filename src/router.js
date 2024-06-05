// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import DataTable from './components/DataTable.vue';

const routes = [
  {
    path: '/',
    name: 'DataTable',
    component: DataTable
  },
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
