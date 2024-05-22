import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  cart: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    createItem(state, action) {
      state.cart.push(action.payload)
    },

    deleteItem(state, action) {
      ///payload is the pizzaId ////
      state.cart = state.cart.filter(item => item.pizzaId !== action.payload)
    },

    increaseItemQuantity(state, action) {
      const item = state.cart.find(item => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice
    },

    decreaseItemQuantity(state, action) {
      const item = state.cart.find(item => item.pizzaId === action.payload);
      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action)
    },

    clearcart(state) {
      state.cart = []
    }
  }
});

export const { createItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearcart } = cartSlice.actions;

export default cartSlice.reducer;

export const getTotalCartQuantity = (store) => store.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (store) => store.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCart = (store) => store.cart.cart;

export const getQuantitybyID = (id) => (store) => store.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;