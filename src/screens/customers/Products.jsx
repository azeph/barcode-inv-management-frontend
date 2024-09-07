import React, { useState, useMemo, useEffect } from "react";
import category from "../../assets/data/category.json";
import { getAllProducts } from "../../api/product_api";
import barcode from "../../assets/images/barcode.png";
import { Backdrop, CircularProgress } from "@mui/material";
import ShowProduct from "./ShowProduct";
import empty from "../../assets/images/no-products.svg";
import error from "../../assets/images/error.svg";

import { STORE } from "../../../config";
import ScanBarcode from "../../components/ScanBarcode";

function Products({ signUp, user, products, refresh }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(0);
  const [showProduct, setShowProduct] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [scan, setScan] = useState(false);

  const categories = useMemo(() => {
    var cat = [
      {
        label: "Filter by categories",
        value: 0,
      },
    ];

    cat = cat.concat(
      category["categories"].map((cat) => {
        return {
          label: cat["category_name"],
          value: cat,
        };
      })
    );

    return cat;
  }, [category]);

  const handleProducts = () => {
    if (filter != 0) return products["groupProducts"][filter.category_id] || [];

    return products["products"];
  };

  const search = (query) => {
    var temp = handleProducts();

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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex flex-row w-full my-4 items-center lg:px-2 ">
        <div className="flex flex-row w-full gap-4">
          <div className="flex-1 flex flex-col">
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
          {/* <div className="flex-1 flex flex-col">
            <p className="font-lato-bold text-sm px-1 py-[2px]">Category</p>
            <div className="h-9 rounded-md focus:outline-none border px-1 bg-white shadow-sm">
              <select
                onChange={(e) => {
                  const value = JSON.parse(e.target.value);
                  if (value == 0) return setFilter(0);

                  setFilter(value);
                }}
                className="w-full h-full focus:outline-none bg-transparent text-sm "
              >
                {categories.map((item, i) => (
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
          </div> */}
        </div>
        {filter != 0 && (
          <div className="h-full flex items-end px-2">
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
      ) : (newProducts || handleProducts()).length == 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="font-lato-bold">No products found.</p>
        </div>
      ) : (
        <div className="w-full h-full overflow-auto lg:px-2">
          <div className="w-full grid lg:grid-cols-4 grid-cols-1 gap-4 py-2">
            {(newProducts || handleProducts()).map((item) => {
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    setShowProduct(item);
                  }}
                  className="cursor-pointer hover:ring-1 ring-[#ffc100] flex flex-col bg-white items-center h-[250px] w-full border rounded-lg shadow-sm p-4"
                >
                  <div className="w-full h-28 flex justify-center">
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="h-32 w-32 object-cover"
                    />
                  </div>
                  <div className="flex w-full h-8 mt-8">
                    <h1 className="font-lato-bold leading-none">{item.name}</h1>
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
                isCustomer={true}
                seeDetails={(product) => {
                  setShowProduct(product);
                }}
              />
            )}
          </Backdrop>
        </div>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!showProduct}
      >
        {!!showProduct && (
          <ShowProduct
            refresh={() => {
              refresh();
            }}
            user={user}
            signUp={signUp}
            product={showProduct}
            action={() => {
              setShowProduct(null);
            }}
          />
        )}
      </Backdrop>
    </div>
  );
}

export default Products;
