// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from '../../types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['customer'] = {
  error: null,
  customers: [],
  orders: [],
  products: [],
  productreviews: [],
  invoices: []
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET CUSTOMERS
    getCustomersSuccess(state, action) {
      state.customers = action.payload;
    },

    // GET ORDERS
    getOrdersSuccess(state, action) {
      state.orders = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.products = action.payload;
    },

    // GET PRODUCT REVIEWS
    getProductReviewsSuccess(state, action) {
      state.productreviews = action.payload;
    },

    // GET INVOICE DATA
    getInvoiceSuccess(state, action) {
      state.invoices = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCustomers() {
  return async () => {
    try {
      const response = await axios.get('/api/customer/list');
      dispatch(slice.actions.getCustomersSuccess(response.data.customers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrders() {
  return async () => {
    try {
      const response = await axios.get('/api/customer/order/list');
      dispatch(slice.actions.getOrdersSuccess(response.data.orders));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getInvoice() {
  return async () => {
    try {
      const response = await axios.get('/api/invoice/list');
      dispatch(slice.actions.getInvoiceSuccess(response.data.invoice));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProducts() {
  return async () => {
    try {
      const response = await axios.get('/api/customer/product/list');
      dispatch(slice.actions.getProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductReviews() {
  return async () => {
    try {
      const response = await axios.get('/api/customer/product/reviews');
      dispatch(slice.actions.getProductReviewsSuccess(response.data.productreviews));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}