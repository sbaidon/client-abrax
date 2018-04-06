import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9090/api/v1';

export default {
  getTodos() {
    return axios.get('/todos');
  },
  getTodo(id) {
    return axios.get(`/todo/${id}`);
  },
  saveTodo(todo) {
    return axios.post('/todo', todo);
  },
  updateTodo(todo) {
    return axios.put('/todo', { todo });
  },
  deleteTodo(id) {
    return axios.delete(`/todo/${id}`);
  }
};
