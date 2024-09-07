import React, { useEffect, useMemo, useReducer, useState } from "react";
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
import ReceiptModal from "../../components/ReceiptModal";

function Purchase({ orders, refresh }) {
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [showReceipt, setReceipt] = useState(null);
  const [newOrders, setNewOrders] = useState(null);

  const columns = useMemo(() => [
    {
      name: "#",
      cell: (row, index) => {
        return <p className="text-sm">{index + 1}</p>;
      },
      width: "50px",
    },
    {
      name: "Transaction ID",
      cell: (row) => <p className="text-sm">{row._id}</p>,
      width: "250px",
    },
    {
      name: "Date Record",
      selector: (row) => format(row.orderDate, "yyyy-MM-dd - p"),
      width: "180px",
    },
    {
      name: "Total Items",
      cell: (row) => <p className="text-sm">{row.totalItems}</p>,
      width: "120px",
    },
    {
      name: "Total Amount",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.totalAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "120px",
    },
    {
      name: "Payment Bill",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.bill.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "120px",
    },
    {
      name: "Change",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.change.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "120px",
    },
  ]);

  const handleOrders = () => {
    let temp = orders["orders"];

    return temp;
  };

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <img src={empty} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">
            You have no transactions yet, just wait and chill.
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
        <h1 className="font-lato">Loading transactions, please wait...</h1>
      </div>
    );
  };

  const search = (query) => {
    var temp = orders["orders"];

    temp = temp.filter((order) => {
      var name = order._id.toLowerCase().indexOf(query.toLowerCase());
      return name !== -1;
    });

    return temp;
  };

  const filterItems = (filter) => {
    if (filter == 0) return orders["orders"];

    return orders.orderGroup[filter] || [];
  };

  return (
    <div className="w-full h-full p-4 text-[#555C68]">
      <div className="flex flex-col flex-1 h-full rounded-lg border bg-white py-4 px-6">
        <h1 className="font-lato-bold text-base">Transactions</h1>
        <div className="flex flex-row justify-between w-full items-center pt-4 pb-2">
          <div className="flex flex-row items-center gap-2">
            <input
              value={query}
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query);

                if (query == "") return setNewOrders(null);

                setNewOrders(search(query));
              }}
              className="px-2 text-sm rounded-md h-9 w-56 border border-[#555C68]/40 focus:outline-none"
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
        <div className="flex flex-col w-full h-full px-2 overflow-hidden">
          <div className="flex flex-row w-full h-14 border-b items-center drop-shadow-lg">
            {columns.map((item) => {
              return (
                <p
                  style={{ width: item.width }}
                  className="text-[#555C68]/80 text-sm font-lato-bold mx-1"
                >
                  {item.name}
                </p>
              );
            })}
          </div>
          {orders.fetchState != 1 ? (
            statusBuilder(orders.fetchState)
          ) : (newOrders || handleOrders()).length == 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="font-lato-bold">No transactions found.</p>
            </div>
          ) : (
            <div className="flex flex-col overflow-auto h-full w-full">
              {(newOrders || handleOrders()).map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      //setShowProduct(item);
                      setReceipt(item);
                    }}
                    className={`cursor-pointer flex flex-row w-full h-[50px] border-b py-2 hover:bg-[#fff2cc] z-10`}
                  >
                    {columns.map((col) => {
                      return (
                        <div
                          style={{ width: col.width }}
                          className="font-lato-bold mx-1 h-full flex flex-row items-center"
                        >
                          {col.cell ? (
                            col.cell(item, index)
                          ) : (
                            <p className="w-full text-sm">
                              {col.selector(item)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!!showReceipt}
          >
            {!!showReceipt && (
              <ReceiptModal
                order={showReceipt}
                close={() => {
                  setReceipt(null);
                }}
              />
            )}
          </Backdrop>
        </div>
      </div>
    </div>
  );
}

export default Purchase;
