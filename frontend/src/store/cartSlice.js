import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "hackbazzer_cart";

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const project = action.payload;
      if (!project?._id) return;
      const exists = state.items.some((item) => item._id === project._id);
      if (!exists) {
        state.items.push(project);
        saveCartToStorage(state.items);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
