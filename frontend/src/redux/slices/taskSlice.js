import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchTasks = createAsyncThunk("task/fetch", async () => {
  const res = await api.get("/task");
  return res.data.tasks;
});

export const createTask = createAsyncThunk(
  "task/create",
  async (data) => {
    const res = await api.post("/task", data);
    return res.data.task;
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ id, data }) => {
    const res = await api.put(`/task/${id}`, data);
    return res.data.task;
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id) => {
    await api.delete(`/task/${id}`);
    return id;
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: { tasks: [] },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export default taskSlice.reducer;
