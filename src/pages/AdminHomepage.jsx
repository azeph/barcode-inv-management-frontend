import React, { useEffect, useReducer, useState } from "react";
import Dashboard from "../screens/admin/Dashboard";
import {
  Squares2X2Icon,
  CubeIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Inventory from "../screens/admin/Inventory";
import Purchase from "../screens/admin/Purchase";
import Sales from "../screens/admin/Sales";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hide, show } from "../states/alerts";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { getAllProducts } from "../api/product_api";
import { STORE } from "../../config";
import { getAllOrder, getAllSales } from "../api/order_api";
import { getAllCustomers } from "../api/customer_api";
import { socket } from "../api/socket";
import AccountManager from "../screens/admin/AccountManager";
import { getAllUsers } from "../api/user_api";
import CompletedOrders from "../screens/admin/CompletedOrders";
import Categories from "../screens/admin/Categories";
import { getAllCategories } from "../api/category_api";

function AdminHomepage() {
  const [screen, setScreen] = useState(0);
  const [update, setUpdate] = useState();
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.value);
  const user = useSelector((state) => state.user.value);

  const [products, setProducts] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      productGroup: [],
      products: [],
      count: 0,
    }
  );

  const [orders, setOrders] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      orderGroup: [],
      orders: [],
      count: 0,
    }
  );

  const [customers, setCustomers] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      customers: [],
      count: 0,
    }
  );

  const [sales, setSales] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      sales: [],
      count: 0,
    }
  );

  const [users, setUsers] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      users: [],
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

  const screens = [
    {
      label: "Dashboard",
      component: (
        <Dashboard
          orders={orders}
          products={products}
          customers={customers}
          sales={sales}
        />
      ),
      icon: <Squares2X2Icon />,
      header: "",
    },
    {
      label: "Inventory",
      component: (
        <Inventory
          user={user}
          products={products}
          refresh={() => {
            fetchProducts();
          }}
          categories={categories}
        />
      ),
      icon: <CubeIcon />,
      header: "",
    },
    {
      label: "Purchase",
      component: <Purchase orders={orders} refresh={() => {}} />,
      icon: <ShoppingCartIcon />,
      header: "",
      count: orders["count"],
    },
    // {
    //   label: "Sales",
    //   component: <Sales sales={sales} />,
    //   icon: <ArrowTrendingUpIcon />,
    //   header: "",
    // },
    {
      label: "Accounts",
      component: <AccountManager users={users} />,
      icon: <UsersIcon />,
      header: "",
    },
    {
      label: "Categories",
      component: (
        <Categories
          categories={categories}
          refresh={() => {
            fetchCategories();
          }}
        />
      ),
      icon: <TagIcon />,
      header: "",
    },
  ];

  const fetchOrders = () => {
    setOrders({ fetchState: 0 });
    getAllOrder(STORE.storeID)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        const group = data.reduce((group, order) => {
          const { orderStatus } = order;
          group[orderStatus] = group[orderStatus] ?? [];
          group[orderStatus].push(order);
          return group;
        }, {});

        setOrders({
          fetchState: data.length < 1 ? 2 : 1,
          orderGroup: group,
          orders: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setOrders({ fetchState: -1 });
      });
  };

  const fetchProducts = async () => {
    getAllProducts(STORE.storeID)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        const group = data.reduce((group, product) => {
          const { category } = product;

          group[category["category_id"]] = group[category["category_id"]] ?? [];
          group[category["category_id"]].push(product);
          return group;
        }, {});

        setProducts({
          fetchState: data.length < 1 ? 2 : 1,
          productGroup: group,
          products: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setProducts({ fetchState: -1 });
      });
  };

  const fetchCustomers = () => {
    setCustomers({ fetchState: 0 });
    getAllCustomers()
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setCustomers({
          fetchState: data.length < 1 ? 2 : 1,
          customers: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setCustomers({ fetchState: -1 });
      });
  };

  const fetchSales = () => {
    setSales({ fetchState: 0 });
    getAllSales(STORE.storeID)
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setSales({
          fetchState: data.length < 1 ? 2 : 1,
          sales: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setSales({ fetchState: -1 });
      });
  };

  const fetchUsers = () => {
    setUsers({ fetchState: 0 });
    getAllUsers()
      .then((response) => response.json())
      .then((data) => {
        if (!data) return null;

        setUsers({
          fetchState: data.length < 1 ? 2 : 1,
          users: data,
          count: data.length,
        });
      })
      .catch((err) => {
        console.log(err);
        setUsers({ fetchState: -1 });
      });
  };

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

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onUpdate = (value) => {
      setUpdate(value);

      dispatch(
        show({
          type: "info",
          message: "Customer update, reloading data.",
          duration: 2000,
          show: true,
        })
      );

      fetchProducts();
      fetchOrders();
      fetchCustomers();
      fetchSales();
      fetchUsers();
      fetchCategories();
    };

    socket.on("update", onUpdate);

    return () => {
      socket.off("update", onUpdate);
    };
  }, [update]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchSales();
    fetchUsers();
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full font-lato">
      <AdminNavbar user={user} />
      <div
        style={{ height: "calc(100% - 64px)" }}
        className="flex flex-row w-full "
      >
        <AdminSidebar screens={screens} screen={screen} setScreen={setScreen} />
        <div className="h-full w-full">
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
          {screens[screen].component}
        </div>
      </div>
    </div>
  );
}

export default AdminHomepage;
