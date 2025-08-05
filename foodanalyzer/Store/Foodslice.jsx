// src/redux/itemSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all items
export const fetchItems = createAsyncThunk('foods/fetchUserFoods', async (userId) => {
  const response = await axios.get(`http://localhost:7000/foods/userfoods/${userId}`);
  return response.data;
});

// Add new item
export const addItem = createAsyncThunk("items/add", async (formData,userId) => {
  const data = new FormData();
  for(const key in formData){
    if(formData[key]){
      data.append(key,formData[key]);
    }
  }
    const response = await axios.post("http://localhost:7000/foods/addfoods", data, {
    headers: {
      "Content-Type": "multipart/form-data", // ✅ Important for FormData
    },
  });
  data.append('userId',userId)
  return response.data;
});

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers:{
   clearItems: (state)=>{
   state.items = [];
   }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});
export const { clearItems } = itemSlice.actions;
export default itemSlice.reducer;
