import React, { useEffect, useReducer, useState } from "react";
import Products from "../screens/customers/Products";
import ShoppingCart from "../screens/customers/ShoppingCart";
import {
  Cog6ToothIcon,
  CubeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Orders from "../screens/customers/Orders";
import Sidebar from "./Sidebar";
import { Backdrop } from "@mui/material";
import CustomerSignup from "../screens/customers/CustomerSignup";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "../states/alerts";
import Navbar from "./Navbar";
import { STORE } from "../../config";
import { getAllProducts } from "../api/product_api";
import { getCart, getOrder } from "../api/order_api";
import socketIO from "socket.io-client";
import { BASEURL } from "../../config";
import Dashboard from "../screens/clerk/Dashboard";
import { getAllCategories } from "../api/category_api";

function Homepage() {
  const [screen, setScreen] = useState(0);
  const [isSignUp, setSignUp] = useState(false);
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.value);
  const customer = useSelector((state) => state.customer.value);
  const user = useSelector((state) => state.user.value);

  const [products, setProducts] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      products: [],
      groupProducts: [],
      count: 0,
    }
  );

  const [cart, setCart] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      products: [],
      count: 0,
    }
  );

  const [order, setOrder] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      orders: [],
      count: 0,
    }
  );

  const [categories, setCategories] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      categories: [],
      count: 0,
    }
  );

  const fetchCategories = () => {
    setCategories({ fetchState: 0 });
    getAllCategories()
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setCategories({
          fetchState: data.length < 1 ? 2 : 1,
          categories: data.map((item, index) => {
            return {
              _id: item["_id"],
              no: index + 1,
              category_name: item["category_name"],
              category_id: item["category_id"],
            };
          }),
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setCategories({ fetchState: -1 });
      });
  };

  const fetchOrder = () => {
    setOrder({ fetchState: 0 });
    getOrder(customer._id)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setOrder({
          fetchState: data.length < 1 ? 2 : 1,
          orders: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setOrder({ fetchState: -1 });
      });
  };

  const fetchCart = () => {
    setCart({ fetchState: 0 });
    getCart(customer._id)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setCart({
          fetchState: data.length < 1 ? 2 : 1,
          products: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setCart({ fetchState: -1 });
      });
  };

  const fetchProduct = () => {
    setProducts({ fetchState: 0 });
    getAllProducts(STORE.storeID)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        const group = data.reduce((group, product) => {
          const { category } = product;

          group[category["category_name"]] =
            group[category["category_name"]] ?? [];
          group[category["category_name"]].push(product);
          return group;
        }, {});

        setProducts({
          fetchState: products.length < 1 ? 2 : 1,
          products: data,
          count: products.length,
          groupProducts: group,
        });
      })
      .catch((err) => {
        console.log(err);
        setProducts({ fetchState: -1 });
      });
  };

  const changeScreen = (index) => {
    if (index > 0) {
      if (!customer._id) {
        setSignUp(true);
        return;
      }
    }
    setScreen(index);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();

    if (!customer._id) {
      return;
    }

    fetchCart();
    fetchOrder();
  }, []);

  const screens = [
    {
      label: "Products",
      component: (
        <Products
          user={customer}
          signUp={setSignUp}
          products={products}
          refresh={() => {
            fetchCart();
            fetchOrder();
          }}
        />
      ),
      icon: <ShoppingBagIcon />,
      header: "Welcome, customer!",
    },
    {
      label: "Shopping Cart",
      component: (
        <ShoppingCart
          carts={cart}
          refresh={() => {
            fetchCart();
            fetchOrder();
          }}
        />
      ),
      icon: <ShoppingCartIcon />,
      header: "Shopping Cart",
      count: cart["count"],
    },
    {
      label: "Orders",
      component: (
        <Orders
          orders={order}
          refresh={() => {
            fetchOrder();
          }}
        />
      ),
      icon: <CubeIcon />,
      header: "Ordered Items",
      count: order["count"],
    },
  ];

  return (
    <div className="w-full h-screen">
      <div className="flex flex-row h-full w-full lg:p-4 p-2 lg:gap-4 gap-2 overflow-hidden font-lato text-[#555C68]">
        <div className="flex flex-col lg:w-full h-full">
          <Navbar
            screen={screens[screen]}
            user={user}
            signin={() => {
              setSignUp(true);
            }}
          />
          <Dashboard
            products={products}
            user={user}
            refresh={() => {
              fetchProduct();
            }}
            categories={categories}
          />
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isSignUp}
        >
          <CustomerSignup
            close={() => {
              setSignUp(false);
            }}
          />
        </Backdrop>
      </div>
      {alert.show && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={alert.show}
          autoHideDuration={alert.duration}
          onClose={() => {
            dispatch(hide());
          }}
        >
          <Alert severity={alert.type}>{alert.message}</Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default Homepage;
