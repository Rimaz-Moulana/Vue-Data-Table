<template>
    <div>
      <input type="text" v-model="searchQuery" placeholder="Search..." @input="debouncedSearch">
      <div v-if="isLoading">Loading...</div>
      <table v-else>
        <thead>
          <tr>
            <th @click="sortBy('id')">ID</th>
            <th>Name</th>
            <th @click="sortBy('email')">Email</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in paginatedComments" :key="comment.id">
            <td>{{ comment.id }}</td>
            <td>{{ comment.name }}</td>
            <td>{{ comment.email }}</td>
            <td>{{ comment.body }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import _ from 'lodash';
import { computed, onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const comments = ref([]);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(10);
      const sortOrder = ref({ key: '', order: '' });
      const isLoading = ref(false);
  
      const fetchComments = async () => {
        isLoading.value = true;
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/comments');
          comments.value = await response.json();
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(fetchComments);
  
      const filteredComments = computed(() => {
        let filtered = comments.value;
        if (searchQuery.value) {
          filtered = filtered.filter(comment => 
            comment.name.includes(searchQuery.value) || 
            comment.email.includes(searchQuery.value) || 
            comment.body.includes(searchQuery.value)
          );
        }
        return filtered;
      });
  
      const sortedComments = computed(() => {
        if (!sortOrder.value.key) return filteredComments.value;
  
        return [...filteredComments.value].sort((a, b) => {
          if (sortOrder.value.order === 'asc') {
            return a[sortOrder.value.key] > b[sortOrder.value.key] ? 1 : -1;
          } else {
            return a[sortOrder.value.key] < b[sortOrder.value.key] ? 1 : -1;
          }
        });
      });
  
      const paginatedComments = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return sortedComments.value.slice(start, end);
      });
  
      const totalPages = computed(() => {
        return Math.ceil(filteredComments.value.length / itemsPerPage.value);
      });
  
      const prevPage = () => {
        if (currentPage.value > 1) currentPage.value--;
      };
  
      const nextPage = () => {
        if (currentPage.value < totalPages.value) currentPage.value++;
      };
  
      const sortBy = (key) => {
        if (sortOrder.value.key === key) {
          sortOrder.value.order = sortOrder.value.order === 'asc' ? 'desc' : 'asc';
        } else {
          sortOrder.value.key = key;
          sortOrder.value.order = 'asc';
        }
      };
  
      const debouncedSearch = _.debounce(() => {
        currentPage.value = 1;
      }, 300);

    

  
      return {
        comments,
        searchQuery,
        currentPage,
        itemsPerPage,
        sortOrder,
        isLoading,
        paginatedComments,
        totalPages,
        prevPage,
        nextPage,
        sortBy,
        debouncedSearch
      };
    }
  };
  </script>
  
  <style>
  /* Add some basic styling here */
  </style>
  