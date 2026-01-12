import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-dashboard-88fd.onrender.com/api/v1",
  withCredentials: true, 
});

export default api;
