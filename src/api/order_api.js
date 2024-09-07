import { BASEURL } from "../../config";

const addOrder = (order) => {
  return fetch(`${BASEURL}/api/order/add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(order),
  });
};

const updateQuantity = (update) => {
  return fetch(`${BASEURL}/api/order/update/quantity`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(update),
  });
};

const getCart = (customerID) => {
  return fetch(`${BASEURL}/api/order/cart/get/${customerID}`);
};

const getOrder = (customerID) => {
  return fetch(`${BASEURL}/api/order/get/${customerID}`);
};

const getAllOrder = (storeID) => {
  return fetch(`${BASEURL}/api/order/get/all/${storeID}`);
};

const removeOrder = (orderID) => {
  return fetch(`${BASEURL}/api/order/remove/${orderID}`);
};

const checkoutOrder = (order) => {
  return fetch(`${BASEURL}/api/order/checkout`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(order),
  });
};

const cancelOrder = (orderID, orderStatus) => {
  return fetch(`${BASEURL}/api/order/cancel`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ orderID, orderStatus }),
  });
};

const completeOrder = (order) => {
  return fetch(`${BASEURL}/api/order/complete`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(order),
  });
};

const getAllSales = (storeID) => {
  return fetch(`${BASEURL}/api/sales/get/all/${storeID}`);
};

export {
  addOrder,
  getCart,
  updateQuantity,
  removeOrder,
  checkoutOrder,
  getOrder,
  cancelOrder,
  getAllOrder,
  completeOrder,
  getAllSales,
};
