import React, { useState, useMemo } from "react";
import { cancelOrder, completeOrder, getAllOrder } from "../../api/order_api";
import { format } from "date-fns";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Backdrop, CircularProgress } from "@mui/material";
import ProductDetails from "./ProductDetails";
import PopupDialog from "../../components/PopupDialog";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import { STORE } from "../../../config";
import error from "../../assets/images/error.svg";
import empty from "../../assets/images/break.svg";

function CompletedOrders({ orders, refresh }) {
  const [filter, setFilter] = useState(2);
  const [query, setQuery] = useState("");
  const [showDialog, setShowDialog] = useState(null);
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();
  const [newOrders, setNewOrders] = useState(null);

  const orderFilter = [
    {
      label: "",
      status: 0,
      empty: "No orders",
    },
    {
      label: "",
      status: 1,
      empty: "You have no pending orders.",
    },
    {
      label: "Completed Orders",
      status: 2,
      empty: "You have no completed orders yet.",
    },
    {
      label: "",
      status: 3,
      empty: "You have no canceled from store orders.",
    },
    {
      label: "",
      status: 4,
      empty: "You have no canceled from store orders.",
    },
  ];

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <img src={empty} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">
            You have no orders yet, just wait and chill.
          </h1>
        </div>
      );
    }

    if (state == -1) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <img src={error} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">Oops, an error occurred.</h1>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center pb-8 gap-4">
        <CircularProgress color="inherit" className="text-[#ffc100]" />
        <h1 className="font-lato">Loading orders, please wait...</h1>
      </div>
    );
  };

  const orderStatus = (state, date) => {
    if (state == 2) {
      return (
        <div className="flex flex-col w-full font-lato gap-1">
          <div className="flex flex-row w-full items-center gap-2">
            <p className="font-lato text-sm text-center">Status: </p>
            <h1 className="text-sm py-[2px] font-lato-bold text-[#49a54d]">
              Order process completed
            </h1>
          </div>
          <p className="text-sm font-lato">
            Completed on:{" "}
            <span className="font-lato-bold">
              {format(date, "dd MMM yyyy - p")}
            </span>
          </p>
        </div>
      );
    }

    if (state == 3) {
      return (
        <div className="flex flex-col w-full font-lato gap-1">
          <div className="flex flex-row w-full items-center gap-2">
            <p className="text-sm text-center">Status: </p>
            <h1 className="text-sm py-[2px] font-lato-bold text-[#fb0200]">
              Order canceled by customer
            </h1>
          </div>
          <p className="text-sm">
            Canceled on:{" "}
            <span className="font-lato-bold">
              {format(date, "dd MMM yyyy - p")}
            </span>
          </p>
        </div>
      );
    }

    if (state == 4) {
      return (
        <div className="flex flex-col w-full font-lato gap-1">
          <div className="flex flex-row w-full items-center gap-2">
            <p className="text-sm text-center">Status: </p>
            <h1 className="text-sm py-[2px] font-lato-bold text-[#fb0200]">
              Order canceled by store
            </h1>
          </div>
          <p className="text-sm">
            Canceled on:{" "}
            <span className="font-lato-bold">
              {format(date, "dd MMM yyyy - p")}
            </span>
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col w-full font-lato gap-1">
        <div className="flex flex-row w-full items-center gap-2">
          <p className="text-sm text-center">Status: </p>
          <h1 className="text-sm py-[2px] font-lato-bold text-[#ffc100]">
            Pending order approval
          </h1>
        </div>
      </div>
    );
  };

  const handleAction = (type, order) => {
    setSelected(order);
    setShowDialog(null);

    if (type == 0) {
      cancelOrder(order._id, 4)
        .then((res) => res.json())
        .then((val) => {
          if (!val) {
            setSelected(null);
            return dispatch(
              show({
                type: "error",
                message: "Failed to cancel customer order.",
                duration: 3000,
                show: true,
              })
            );
          }

          refresh();
          dispatch(
            show({
              type: "success",
              message: "Customer order was cancelled.",
              duration: 3000,
              show: true,
            })
          );
          setSelected(null);
        })
        .catch((err) => {
          setSelected(null);
          return dispatch(
            show({
              type: "error",
              message: "Failed to cancel customer order.",
              duration: 3000,
              show: true,
            })
          );
        });
    } else {
      completeOrder(order)
        .then((res) => res.json())
        .then((val) => {
          if (!val) {
            setSelected(null);
            return dispatch(
              show({
                type: "error",
                message: "Failed to complete customer order.",
                duration: 3000,
                show: true,
              })
            );
          }

          refresh();
          dispatch(
            show({
              type: "success",
              message: "Customer order was completed.",
              duration: 3000,
              show: true,
            })
          );
          setSelected(null);
        })
        .catch((err) => {
          setSelected(null);
          return dispatch(
            show({
              type: "error",
              message: "Failed to complete customer order.",
              duration: 3000,
              show: true,
            })
          );
        });
    }
  };

  const search = (query) => {
    var temp = filterItems(filter);

    temp = temp.filter((order) => {
      var name = order.product.name.toLowerCase().indexOf(query.toLowerCase());
      var customer = order.customer.name
        .toLowerCase()
        .indexOf(query.toLowerCase());
      var category = order.product.category.category_name
        .toLowerCase()
        .indexOf(query.toLowerCase());
      return name !== -1 || category !== -1 || customer !== -1;
    });

    return temp;
  };

  const filterItems = (filter) => {
    if (filter == 0) return orders["orders"];

    return orders.orderGroup[filter] || [];
  };

  const columns = useMemo(() => [
    {
      cell: (row, index) => {
        return (
          <div className="flex flex-row h-full w-full items-center justify-center gap-5">
            <img
              className="w-20 border rounded-lg shadow-sm"
              src={row.product["photoUrl"]}
              alt="product"
            />
            <div className="w-full flex flex-col gap-2 py-2 text-sm">
              <h1 className="font-lato-bold ">{row.product.name}</h1>
              <h1 className="font-lato-bold">
                {row.product.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PHP",
                })}
              </h1>
            </div>
          </div>
        );
      },
      width: "300px",
    },
    {
      cell: (row) => (
        <p className="w-full font-lato text-sm text-center">
          Qty: {row.quantity}
        </p>
      ),
      width: "110px",
    },
    {
      cell: (row) => (
        <p className="w-full font-lato-bold text-center">
          {row.orderAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "200px",
    },
    {
      cell: (row) => {
        return (
          <div className="flex flex-col gap-3">
            {orderStatus(row.orderStatus, row.orderDate)}
            {row.orderStatus < 3 && row.orderStatus !== 2 && (
              <div className="flex flex-row text-sm font-lato-bold gap-2 ">
                <button
                  onClick={() => {
                    setShowDialog({
                      title: "Cancel Order",
                      content: "Are you sure you want to cancel this order?",
                      action: () => {
                        handleAction(0, row);
                      },
                    });
                  }}
                  className="border border-[#555C68] w-24 py-1 rounded-lg hover:bg-[#f1f1f1]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDialog({
                      title: "Approve Order",
                      content: "Are you sure you want to approve this order?",
                      action: () => {
                        handleAction(1, row);
                      },
                    });
                  }}
                  className="bg-[#ffc100]/80 w-24 py-1 rounded-lg hover:bg-[#ffc100]"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        );
      },
      width: "250px",
    },
  ]);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full h-full flex flex-col text-[#555C68] gap-2     ">
        <div className="w-full bg-white border rounded-lg px-4 py-4">
          <h1 className="font-lato-bold text-base">Transactions</h1>
          <div className="flex flex-row justify-between w-full items-center pt-3">
            <div className="flex flex-row items-center">
              <input
                value={query}
                onChange={(e) => {
                  const query = e.target.value;
                  setQuery(query);

                  if (query === "") return setNewOrders(null);

                  setNewOrders(search(query));
                }}
                className="px-2 text-sm rounded-md h-9 w-60 border border-[#555C68]/40 focus:outline-none"
                placeholder="Quick Search"
              />
            </div>
            <div className="flex flex-row gap-2 select-none items-center px-2">
              <h1
                onClick={() => {
                  refresh();
                }}
                className="px-2 cursor-pointer flex gap-2 font-lato-bold text-sm text-[#555C68] border border-[#555C68]/40 w-32 shadow-sm py-[6px] rounded-lg justify-center"
              >
                <span>{<ArrowPathIcon className="w-5" />}</span> Refresh
              </h1>
            </div>
          </div>
        </div>
        {orders["fetchState"] != 1 ? (
          statusBuilder(orders["fetchState"])
        ) : (
          <div className="w-full h-full flex flex-row gap-4 overflow-hidden">
            <div className="flex flex-col flex-1 h-full overflow-auto gap-2">
              {(newOrders || filterItems(filter)).length == 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="font-lato-bold">No items found.</p>
                </div>
              ) : (
                (newOrders || filterItems(filter)).map((item) => {
                  return (
                    <div className="relative">
                      {!!selected && selected._id == item._id && (
                        <div className="absolute w-full h-full rounded-lg bg-white/50 flex justify-center items-center">
                          <CircularProgress
                            size={28}
                            color="inherit"
                            className="text-[#ffc100]"
                          />
                        </div>
                      )}
                      <div
                        key={item._id}
                        className="w-full bg-white border shadow-sm flex flex-col p-4 rounded-lg"
                      >
                        <div className="flex flex-row justify-between items-center">
                          <p className="text-sm font-lato">
                            Order ID:{" "}
                            <span className="underline cursor-pointer">
                              {item._id}
                            </span>
                          </p>
                        </div>
                        <div className="h-[1px] bg-[#555C68]/20 my-4"></div>
                        <div className="w-full flex flex-row p-2">
                          {columns.map((col, index) => {
                            return (
                              <div
                                key={item._id + index}
                                style={{ width: col.width }}
                                className="flex items-center"
                              >
                                {col.cell(item, index)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {!!showDialog && (
                <PopupDialog
                  show={!!showDialog}
                  close={() => {
                    setShowDialog(null);
                  }}
                  title={showDialog.title}
                  content={showDialog.content}
                  action1={() => {
                    showDialog.action();
                    setShowDialog(null);
                  }}
                  action2={() => {
                    setShowDialog(null);
                  }}
                />
              )}
            </div>
            <div className="w-[20%] h-full">
              <div className="bg-white border rounded-lg h-full">
                <h1 className="font-lato-bold text-sm m-4">Filter By</h1>
                <div className="h-full flex flex-col pt-12 select-none">
                  {orderFilter.map((item) => {
                    return (
                      <div
                        onClick={() => {
                          //setFilter(item.status);
                        }}
                        key={item.status}
                        className={` ${
                          filter == item.status
                            ? " border-[#ffc100] text-[#ffc100] bg-[#ffc100]/10"
                            : "border-white"
                        }  border-l-[3px] h-11 w-full px-4 flex items-center `}
                      >
                        <p className="font-lato-bold text-sm">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompletedOrders;
