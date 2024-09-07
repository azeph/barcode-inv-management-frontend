import React, { useState, useMemo, useEffect, useReducer, useRef } from "react";
import barcode from "../../assets/images/barcode.png";
import { Backdrop, CircularProgress } from "@mui/material";
import empty from "../../assets/images/no-products.svg";
import error from "../../assets/images/error.svg";
import { TrashIcon } from "@heroicons/react/24/outline";
import Html5QrcodePlugin from "../../components/Html5QrcodePlugin";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { STORE } from "../../../config";
import ScanBarcode from "../../components/ScanBarcode";
import { addOrder } from "../../api/order_api";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import { Close } from "@mui/icons-material";
import ProductScanner from "./ProductScanner";

function Dashboard({ signUp, user, products, refresh, categories }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const [showProduct, setShowProduct] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [scan, setScan] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isProceed, setProceed] = useState(false);
  const [barcodeData, setBarcode] = useState();
  const [scannedProduct, setProduct] = useState();

  const myRef = useRef(null);

  let isTimeout = false;
  let tempBarcode = null;

  const dispatch = useDispatch();

  const [order, updateOrder] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      orders: [],
      totalItems: 0,
      totalAmount: 0,
      bill: null,
      change: 0,
    }
  );

  const tableItems = [
    {
      width: 50,
      label: "Qty.",
    },
    {
      width: null,
      label: "Name",
    },
    {
      width: 60,
      label: "Amount",
    },
    {
      width: 40,
      label: "",
    },
  ];

  const handleBarcodeScan = (e) => {
    if (!window.hasOwnProperty("scan")) {
      window.scan = [];
    }

    if (
      window.scan.length > 0 &&
      e.timeStamp - window.scan.slice(-1)[0].timeStamp > 10
    ) {
      window.scan = [];
    }

    if (e.key === "Enter" && window.scan.length > 0) {
      let scannedString = window.scan.reduce(function (scannedString, entry) {
        return scannedString + entry.key;
      }, "");
      window.scan = [];

      return document.dispatchEvent(
        new CustomEvent("scanComplete", { detail: scannedString })
      );
    }

    if (e.key !== "Shift") {
      let data = JSON.parse(JSON.stringify(e, ["key", "timeStamp"]));

      data.timeStampDiff =
        window.scan.length > 0
          ? data.timeStamp - window.scan.slice(-1)[0].timeStamp
          : 0;

      window.scan.push(data);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleBarcodeScan);

    return () => {
      document.removeEventListener("keydown", handleBarcodeScan);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("scanComplete", function (e) {
      console.log(e.detail);
      onNewScanResult(e.detail);
    });

    return () => {
      document.removeEventListener("scanComplete", function (e) {
        console.log(e.detail);
      });
    };
  }, []);

  useEffect(() => {
    let tempS = 0;
    let tempQ = 0;
    order["orders"].map((item) => {
      tempS += item["item"]["price"] * item["quantity"];
      tempQ += item["quantity"];
    });

    updateOrder({ totalAmount: tempS, totalItems: tempQ });
  }, [order["orders"], orders, barcodeData]);

  const cat = useMemo(() => {
    var temp = [
      {
        label: "Filter by categories",
        value: 0,
      },
    ];

    if (categories.fetchState != 1) return temp;

    temp = temp.concat(
      categories["categories"].map((c) => {
        return {
          label: c["category_name"],
          value: c,
        };
      })
    );

    return temp;
  }, [categories]);

  // const handleProducts = () => {
  //   if (filter != 0)
  //     return products["groupProducts"][filter.category_name] || [];

  //   return products["products"];
  // };

  const handleProducts = useMemo(() => {
    if (filter != 0)
      return products["groupProducts"][filter.category_name] || [];

    return products["products"];
  }, [products["products"], filter]);

  const search = (query) => {
    var temp = handleProducts;

    temp = temp.filter((product) => {
      var name = product.name.toLowerCase().indexOf(query.toLowerCase());
      return name !== -1;
    });

    return temp;
  };

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
          <img src={empty} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">
            Oops, this store has no products yet.
          </h1>
        </div>
      );
    }

    if (state == -1) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
          <img src={error} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">Oops, an error occurred.</h1>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center pb-8 gap-4">
        <CircularProgress color="inherit" className="text-[#ffc100]" />
        <h1 className="font-lato">Loading products, please wait...</h1>
      </div>
    );
  };

  const clearOrder = () => {
    tempBarcode = "&%%null%%";
    setBarcode(null);
    updateOrder({ orders: [], bill: 0, change: 0 });

    if (scan) {
      setScan(false);
      setTimeout(() => {
        setScan(true), 1000;
      });
    }
  };

  const proceedOrder = async () => {
    setProceed(true);

    let products = order["orders"].map((product, index) => {
      const orderProduct = {
        product: product["item"],
        quantity: product["quantity"],
        amount: product["item"].price * product["quantity"],
      };

      return orderProduct;
    });

    const newOrder = {
      storeID: STORE.storeID,
      clerkID: user._id,
      clerk: user,
      products: products,
      totalItems: order["totalItems"],
      totalAmount: order["totalAmount"],
      bill: order["bill"],
      change: order["change"],
      orderDate: new Date(),
      orderStatus: 1,
    };

    addOrder(newOrder)
      .then((res) => res.json())
      .then((_) => {
        clearOrder();
        setProceed(false);
        dispatch(
          show({
            type: "success",
            message: "Order was successful.",
            duration: 3000,
            show: true,
          })
        );
        refresh();
      })
      .catch((err) => {
        setProceed(false);
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 2000,
            show: true,
          })
        );
      });
  };

  const createOrder = (item) => {
    let isAdded = false;

    if (item.stock - item.sold < 1) return null;

    if (order["orders"]) {
      isAdded = order["orders"].filter((order) => {
        return order["item"]["_id"] == item["_id"];
      });
    }

    let temp = order["orders"];

    if (isAdded.length > 0) {
      let index = order["orders"]
        .map((order) => order["item"]._id)
        .indexOf(item._id);

      if (
        temp[index]["quantity"] <
        temp[index]["item"]["stock"] - temp[index]["item"]["sold"]
      ) {
        temp[index]["quantity"] = temp[index]["quantity"] + 1;
      }
    } else {
      temp.push({
        item: item,
        quantity: 1,
      });
    }

    setOrders(orders + 1);
    updateOrder({ orders: temp });
  };

  const onNewScanResult = (result) => {
    if (!isTimeout) {
      isTimeout = true;

      if (tempBarcode != result) {
        const product = products["products"].find(
          (product) => product.barcode === result
        );

        tempBarcode = result;
        setProduct(product);
        setBarcode(result);
        createOrder(product);
      }

      setTimeout(() => {
        isTimeout = false;
      }, 3000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden mt-4">
      <div className="w-full h-full flex flex-row gap-4">
        {
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-row w-full my-4 items-center lg:px-2 ">
              <div className="flex flex-row w-full gap-4">
                <div className="w-[300px] flex flex-col">
                  <p className="font-lato-bold text-sm px-1 py-[2px]">Search</p>
                  <input
                    value={query}
                    onChange={(e) => {
                      const query = e.target.value;
                      setQuery(query);

                      if (query == "") return setNewProducts(null);

                      setNewProducts(search(query));
                    }}
                    className="px-2 text-sm rounded-md h-9 border focus:outline-none bg-white shadow-sm"
                    placeholder="Search a product"
                  />
                </div>
                <div className="w-[250px] flex flex-col">
                  <p className="font-lato-bold text-sm px-1 py-[2px]">
                    Category
                  </p>
                  <div className="h-9 rounded-md focus:outline-none border px-1 bg-white shadow-sm">
                    <select
                      onChange={(e) => {
                        const value = JSON.parse(e.target.value);
                        if (value == 0) return setFilter(0);

                        setFilter(value);
                      }}
                      className="w-full h-full focus:outline-none bg-transparent text-sm "
                    >
                      {cat.map((item, i) => (
                        <option
                          selected={item.value == 0 && filter == 0}
                          id={item.id}
                          value={JSON.stringify(item.value)}
                          onChange={() => {
                            const value = JSON.parse(e.target.value);
                            if (value == 0) return setFilter(0);

                            setFilter(value);
                          }}
                        >
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {filter != 0 && (
                <div className="h-full w-full flex items-end px-2">
                  {
                    <p
                      onClick={() => {
                        setFilter(0);
                      }}
                      className="text-sm h-9 flex items-center font-lato-bold cursor-pointer"
                    >
                      Clear filter
                    </p>
                  }
                </div>
              )}

              {/* <div className="flex-1 flex flex-col self-end items-end">
                <div
                  onClick={() => {
                    setScan(true);
                  }}
                  className="shadow-sm flex gap-2 cursor-pointer justify-center h-9 p-2 w-52 rounded-md bg-white border"
                >
                  <img src={barcode} className="w-5" />
                  <h1 className="font-lato-bold text-sm">Scan Barcode</h1>
                </div>
              </div> */}
            </div>

            {products.fetchState != 1 ? (
              statusBuilder(products.fetchState)
            ) : (newProducts || handleProducts).length == 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="font-lato-bold">No products found.</p>
              </div>
            ) : (
              <div className="w-full h-full overflow-auto lg:px-2">
                <div className="w-full grid lg:grid-cols-4 grid-cols-1 gap-4 py-2">
                  {(newProducts || handleProducts).map((item) => {
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          createOrder(item);
                        }}
                        className={`${
                          item.stock - item.sold < 1 && "opacity-50"
                        } cursor-pointer hover:ring-1 ring-[#ffc100] flex flex-col bg-white items-center h-[250px] w-full border rounded-lg shadow-sm p-4`}
                      >
                        <div className="w-full h-28 flex justify-center">
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            className="h-32 w-32 object-cover"
                          />
                        </div>
                        <div className="flex w-full h-8 mt-8">
                          <h1 className="font-lato-bold leading-none">
                            {item.name}
                          </h1>
                        </div>
                        <div className="mt-2 flex flex-row w-full justify-between">
                          <p className="font-lato-bold text-sm">
                            {item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "PHP",
                            })}
                          </p>
                          <p className="px-2 text-sm">
                            Stock:{" "}
                            <span className="font-lato-bold">
                              {item.stock - item.sold}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={scan}
                >
                  {scan && (
                    <ScanBarcode
                      products={products["products"]}
                      stream={scan}
                      close={() => {
                        setScan(false);
                      }}
                      isCustomer={true}
                      seeDetails={(product) => {
                        setShowProduct(product);
                      }}
                    />
                  )}
                </Backdrop>
              </div>
            )}
          </div>
        }

        <div className="w-[600px] h-full bg-white rounded-lg border">
          <div className="flex flex-col p-4 h-full w-full">
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-lato-bold text-lg">Orders</h1>
              {order["orders"].length > 0 && (
                <p
                  onClick={() => {
                    clearOrder();
                  }}
                  className="text-sm cursor-pointer"
                >
                  Clear all
                </p>
              )}
            </div>

            <div className="w-full flex-1 flex flex-col overflow-hidden mb-3 border p-2 rounded-lg mt-2">
              <div className="flex flex-row">
                {tableItems.map((items, index) => {
                  return (
                    <p
                      style={{ width: items.width }}
                      className={`${
                        !items.width && "flex-1"
                      } font-lato-bold text-sm ${index == 2 && "text-end"}`}
                    >
                      {items.label}
                    </p>
                  );
                })}
              </div>
              {order["orders"].length < 1 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <h1 className="text-center text-sm">
                    Select or scan barcode an item to order.
                  </h1>
                </div>
              ) : (
                <div className="h-full w-full flex flex-col px-1 py-2 overflow-auto gap-1">
                  {order["orders"].map((item, index) => {
                    let temp = [...order["orders"]];

                    let newItem = temp[index];

                    return (
                      <div className="flex flex-row items-center">
                        <div
                          style={{
                            width: tableItems[0].width,
                          }}
                          className="pr-2"
                        >
                          <input
                            value={item.quantity}
                            type="number"
                            min={1}
                            max={
                              newItem["item"]["stock"] - newItem["item"]["sold"]
                            }
                            className="text-sm font-lato w-full"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              newItem["quantity"] = value;

                              if (
                                value >
                                newItem["item"]["stock"] -
                                  newItem["item"]["sold"]
                              )
                                return;

                              updateOrder({ orders: temp });
                              setOrders(orders + 1);
                            }}
                          />
                        </div>

                        <h1 className="font-lato leading-none flex-1 text-sm">
                          {item["item"].name}
                        </h1>
                        <p
                          style={{ width: tableItems[2].width }}
                          className="font-lato text-sm text-end"
                        >
                          {item["item"].price * item["quantity"]}
                        </p>
                        <div
                          style={{ width: tableItems[3].width }}
                          onClick={() => {
                            let temp = [...order["orders"]];
                            temp.splice(index, 1);
                            updateOrder({ orders: temp });
                          }}
                          className="flex items-center justify-center cursor-pointer select-none"
                        >
                          <Close fontSize="12px" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="w-full h-[160px] flex flex-col px-2">
              <div className="flex flex-row justify-between">
                <h1 className="text-sm font-lato-bold">Total No. of Items</h1>
                <h1 className="text-sm font-lato-bold">
                  {order["totalItems"]}
                </h1>
              </div>
              <div className="flex flex-row justify-between">
                <h1 className="text-sm font-lato-bold">Total Amount</h1>
                <h1 className="text-sm font-lato-bold">
                  {order["totalAmount"].toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h1>
              </div>
              <div className="h-[1px] my-2 border border-b-[#555C68] border-dashed"></div>
              <div className="flex flex-row justify-between items-center py-1">
                <h1 className="text-sm font-lato-bold">Bill</h1>
                <div className="flex flex-row items-center w-40 h-7 rounded-md focus:outline-none border border-[#555C68]/50 text-sm pl-2">
                  <p className="text-[#555C68]/80">&#x20B1;</p>
                  <input
                    required
                    value={order["bill"]}
                    placeholder="0"
                    min={0}
                    type="number"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const change = value - order["totalAmount"];
                      updateOrder({
                        bill: value == 0 ? null : value,
                        change: change < 0 ? 0 : change,
                      });
                      setOrders(orders + 1);
                    }}
                    className="w-full h-8 focus:outline-none bg-transparent text-end"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <h1 className="text-sm font-lato-bold">Change</h1>
                <h1 className="text-sm font-lato-bold">
                  {order["change"].toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h1>
              </div>
              <button
                disabled={
                  (order["orders"].length < 1 &&
                    order["bill"] < order["totalAmount"]) ||
                  isProceed
                }
                onClick={() => {
                  proceedOrder();
                }}
                className={`p-2 mt-3 ${
                  order["orders"].length > 0 &&
                  !isProceed &&
                  order["bill"] >= order["totalAmount"]
                    ? "bg-[#ffc100]"
                    : "bg-[#ffc100]/40"
                } rounded-lg w-full text-sm text-[#555C68] font-lato-bold`}
              >
                {isProceed ? (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <CircularProgress size={"16px"} color="inherit" />
                    <p className="text-sm">Processing order, please wait...</p>
                  </div>
                ) : (
                  "Proceed Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
