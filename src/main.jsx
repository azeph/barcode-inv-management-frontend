import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userReducer from "./states/user.jsx";
import alertReducer from "./states/alerts.jsx"
import customerReducer from './states/customer.jsx'

const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    customer: customerReducer
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>

)
