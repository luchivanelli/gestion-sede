import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("payments"));

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.push(action.payload);
    },
    deletePayment: (state, action) => {
        const { id_cuota } = action.payload;
        return state.filter(payment => payment.id_cuota !== id_cuota);
      }      
  },
});

export const { addPayment, deletePayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;