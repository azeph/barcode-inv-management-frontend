import React, { useState, useMemo } from "react";
import { PlusIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import barcode from "../../assets/images/barcode.png";
import Backdrop from "@mui/material/Backdrop";
import AddProduct from "./AddProduct";
import Barcode from "react-barcode";
import { getAllProducts } from "../../api/product_api";
import { STORE } from "../../../config";
import ProductDetails from "./ProductDetails";
import error from "../../assets/images/error.svg";
import empty from "../../assets/images/add-product.svg";
import { CircularProgress } from "@mui/material";
import ScanBarcode from "../../components/ScanBarcode";

function Inventory({ user, products, refresh, categories }) {
  const [query, setQuery] = useState("");
  const [addProduct, setAddProduct] = useState({ add: false, barcode: null });
  const [isSelectAll, setSelectAll] = useState(false);
  const [showProduct, setShowProduct] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [scan, setScan] = useState(false);
  const [filter, setFilter] = useState(0);
  const [byStock, setByStock] = useState(0);

  const search = (query) => {
    var temp = handleProducts();

    temp = temp.filter((product) => {
      var name = product.name.toLowerCase().indexOf(query.toLowerCase());
      var category = product.category.category_name
        .toLowerCase()
        .indexOf(query.toLowerCase());
      return name !== -1 || category !== -1;
    });

    return temp;
  };

  const handleProducts = () => {
    let temp = [];

    if (filter != 0) {
      temp = products["productGroup"][filter.category_name] || [];
    } else {
      temp = products["products"];
    }

    if (byStock != 0) {
      if (byStock == 1) {
        temp.sort((a, b) => a.stock - a.sold - (b.stock - b.sold));
      } else {
        temp.sort((a, b) => b.stock - b.sold - (a.stock - a.sold));
      }
    }

    return temp;
  };

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

  const columns = useMemo(() => [
    {
      name: "#",
      cell: (row, index) => {
        return (
          <div className="flex flex-row h-full w-full items-center gap-5">
            <div className="ml-4 p-[1px] w-12 h-12 rounded-lg border shadow-sm">
              <img
                className="w-full h-full rounded-lg object-cover"
                src={row.photoUrl}
                alt="product photo"
              />
            </div>
          </div>
        );
      },
      width: "90px",
    },
    {
      name: "Product Name",
      cell: (row) => <p className="text-sm">{row.name}</p>,
      width: "250px",
    },
    {
      name: "Category",
      selector: (row) => row.category.category_name,
      width: "180px",
    },
    {
      name: "Price",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.price.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "100px",
    },
    {
      name: "Cost",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.cost.toLocaleString("en-US", {
            style: "currency",
            currency: "PHP",
          })}
        </p>
      ),
      width: "100px",
    },
    {
      name: "Stock",
      cell: (row) => (
        <p className="w-full text-sm overflow-hidden text-ellipsis">
          {row.stock - row.sold}/{row.stock}
        </p>
      ),
      width: "100px",
    },
    {
      name: "Barcode",
      cell: (row) => (
        <Barcode
          margin={0}
          height={32}
          width={1.5}
          background="transparent"
          fontSize={12}
          value={row.barcode}
        />
      ),
      width: "120px",
    },
  ]);

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center pt-4">
          <img src={empty} className="w-60 h-60" />
          <h1 className="font-lato text-lg ">
            Your have no products, add now!
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
        <h1 className="font-lato">Loading inventory, please wait...</h1>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-4 text-[#555C68]">
      <div className="flex flex-col flex-1 h-full rounded-lg border bg-white py-4 px-6">
        <h1 className="font-lato-bold text-base">Inventory</h1>
        <div className="flex flex-row justify-between w-full items-center pt-4 pb-2">
          <div className="flex flex-row items-center gap-2">
            <input
              value={query}
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query);

                if (query == "") return setNewProducts(null);

                setNewProducts(search(query));
              }}
              className="px-2 text-sm rounded-md h-9 w-56 border border-[#555C68]/40 focus:outline-none"
              placeholder="Quick Search"
            />
            <div className="flex flex-row gap-2 items-center w-60">
              <div className="h-9 rounded-md focus:outline-none border border-[#555C68]/40 px-1 bg-white shadow-sm w-40">
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
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              {filter != 0 && (
                <p
                  onClick={() => {
                    setFilter(0);
                  }}
                  className="text-sm h-9 flex items-center font-lato-bold cursor-pointer"
                >
                  Clear filter
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2 select-none items-center px-2">
            <div
              onClick={() => {
                if (byStock < 2) {
                  setByStock(byStock + 1);
                } else {
                  setByStock(1);
                }

                handleProducts();
              }}
              className="flex gap-2 cursor-pointer border border-[#555C68]/40 py-2 w-28 justify-center rounded-lg shadow-sm"
            >
              <ArrowsUpDownIcon className="w-5" />
              <h1 className="font-lato-bold text-sm">By Stock</h1>
            </div>
            {/* <div
              onClick={() => {
                setScan(true);
              }}
              className="flex gap-2 cursor-pointer border border-[#555C68]/40 py-2 w-36 justify-center rounded-lg shadow-sm"
            >
              <img src={barcode} className="w-5" />
              <h1 className="font-lato-bold text-sm">Scan Barcode</h1>
            </div> */}
            <h1
              onClick={() => {
                setAddProduct({ add: true, barcode: null });
              }}
              className="px-2 cursor-pointer flex gap-2 font-lato-bold text-sm text-[#555C68] border border-[#ffc100] w-36 shadow-sm py-2 rounded-lg justify-center bg-[#ffc100]"
            >
              <span>{<PlusIcon className="w-5" />}</span> Add Product
            </h1>
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={scan}
          >
            {scan && (
              <ScanBarcode
                products={products["products"]}
                stream={scan}
                close={() => {
                  setScan(false);
                }}
                addProduct={(barcode) => {
                  setAddProduct({ add: true, barcode: barcode });
                }}
                seeDetails={(product) => {
                  setShowProduct(product);
                }}
              />
            )}
          </Backdrop>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={addProduct.add}
          >
            {addProduct.add && (
              <AddProduct
                barcode={addProduct.barcode}
                products={products}
                close={() => {
                  setAddProduct({
                    add: false,
                    barcode: null,
                  });
                }}
                refresh={() => {
                  refresh();
                  setAddProduct({
                    add: false,
                    barcode: null,
                  });
                }}
                categories={categories}
              />
            )}
          </Backdrop>
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
          {products.fetchState != 1 ? (
            statusBuilder(products.fetchState)
          ) : (newProducts || handleProducts()).length == 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="font-lato-bold">No products found.</p>
            </div>
          ) : (
            <div className="flex flex-col overflow-auto h-full w-full">
              {(newProducts || handleProducts()).map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      setShowProduct(item);
                    }}
                    className={`cursor-pointer flex flex-row w-full h-[72] border-b py-2 hover:bg-[#fff2cc] z-10`}
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
            open={!!showProduct}
          >
            {!!showProduct && (
              <ProductDetails
                refresh={() => {
                  refresh();
                }}
                product={showProduct}
                close={() => {
                  setShowProduct(null);
                }}
                categories={categories}
              />
            )}
          </Backdrop>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
