import React, { useEffect, useReducer, useState } from "react";
import { STORE } from "../../config";
import logo from "../assets/images/logo.png";
import { Search } from "@mui/icons-material";
import { getAllProducts } from "../api/product_api";
import { Backdrop, CircularProgress } from "@mui/material";
import ScanBarcode from "../components/ScanBarcode";
import { useDispatch } from "react-redux";
import { logout } from "../states/customer";
import ShowProduct from "../screens/customers/ShowProduct";

function NewHomepage() {
  const [newProducts, setNewProducts] = useState(null);
  const [showProduct, setShowProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [scan, setScan] = useState(false);

  const dispatch = useDispatch();

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

  const fetchProduct = () => {
    setProducts({ fetchState: 0 });
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

  const statusBuilder = (state) => {
    if (state == 2) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
          <h1 className="font-lato text-lg ">
            Oops, this store has no products yet.
          </h1>
        </div>
      );
    }

    if (state == -1) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center pb-8">
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

  const handleProducts = () => {
    if (filter != 0) return products["groupProducts"][filter.category_id] || [];

    return products["products"];
  };

  const search = (query) => {
    var temp = products["products"];

    temp = temp.filter((product) => {
      var name = product.name.toLowerCase().indexOf(query.toLowerCase());
      return name !== -1;
    });

    return temp;
  };

  useEffect(() => {
    fetchProduct();
    dispatch(logout());
  }, []);

  return (
    <div className="w-full h-screen">
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 font-lato overflow-hidden">
        <img src={logo} className="w-36 h-36" />
        <h1 className="cursor-pointer text-center font-cinzel font-extrabold text-xl text-[#1F2F3D]">
          {STORE.storeName}
        </h1>
        <div className="flex flex-col h-[60%] w-80 gap-4">
          <div className="w-full flex flex-row rounded-md h-10 border shadow-sm items-center px-2 bg-white">
            <Search fontSize="small" color="disabled" />
            <input
              placeholder="Search an item..."
              className="w-full h-10 px-2 text-base focus:outline-none bg-transparent"
              value={query}
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query);

                if (query == "") return setNewProducts(null);

                setNewProducts(search(query));
              }}
            />
          </div>
          <div className="w-full h-10 rounded-md shadow-sm">
            <button
              onClick={() => {
                setScan(true);
              }}
              className="w-full h-10 bg-[#ffc100] rounded-md text-sm font-lato-bold text-[#555C68] "
            >
              SCAN ITEM
            </button>
          </div>

          <div className="w-full h-full flex flex-col overflow-auto py-1 gap-2">
            {products.fetchState != 1
              ? statusBuilder(products.fetchState)
              : !!newProducts &&
                newProducts.map((item) => {
                  return (
                    <div>
                      <div
                        key={item._id}
                        onClick={() => {
                          setShowProduct(item);
                        }}
                        className="cursor-pointer flex flex-row bg-white items-center h-20 w-full border rounded-lg shadow-sm p-2 gap-2"
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="h-14 w-14 object-cover rounded-lg"
                        />
                        <div className="flex flex-col w-full">
                          <h1 className="font-lato-bold leading-none">
                            {item.name}
                          </h1>
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
                      </div>
                    </div>
                  );
                })}
          </div>
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!showProduct}
        >
          {!!showProduct && (
            <ShowProduct
              product={showProduct}
              action={() => {
                setShowProduct(null);
              }}
            />
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export default NewHomepage;
