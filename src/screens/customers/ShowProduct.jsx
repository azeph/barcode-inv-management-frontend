import {
  MinusCircleIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Backdrop, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { STORE } from "../../../config";
import { addOrder } from "../../api/order_api";
import PopupDialog from "../../components/PopupDialog";
import success from "../../assets/images/success-cart.png";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import Checkout from "./Checkout";

function ShowProduct({ product, action, signUp, user, refresh }) {
  const [quantity, setQuantity] = useState(1);
  const [onCart, setCart] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [showDialog, setDialog] = useState(false);

  const dispatch = useDispatch();

  const handleCart = async () => {
    setCart(true);

    var cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const order = {
      storeID: STORE.storeID,
      customerID: user._id,
      productID: product._id,
      customer: cleanUser,
      product: product,
      quantity: quantity,
      orderDate: new Date(),
      orderStatus: 0,
      orderAmount: product.price * quantity,
    };

    addOrder(order)
      .then((res) => {
        setCart(false);
        if (res.status != 200) {
          dispatch(
            show({
              type: "error",
              message: "Something went wrong.",
              duration: 2000,
              show: true,
            })
          );
          return;
        }

        refresh();
        dispatch(
          show({
            type: "success",
            message: "Item added to your cart.",
            duration: 2000,
            show: true,
          })
        );
      })
      .catch((err) => {
        setCart(false);
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 2000,
            show: true,
          })
        );
        console.log(err);
      });
  };

  const handleCheckout = () => {
    var cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const order = {
      storeID: STORE.storeID,
      customerID: user._id,
      productID: product._id,
      customer: cleanUser,
      product: product,
      quantity: quantity,
      orderDate: new Date(),
      orderStatus: 1,
      orderAmount: product.price * quantity,
    };

    setCheckoutItem(order);
  };

  return (
    <div className="w-[800px] h-[500px] bg-[#f5f7f8] rounded-lg mx-2">
      <div className="relative flex lg:flex-row flex-col w-full h-full items-center pt-4">
        <div className="absolute right-4 top-4 text-[#555C68]">
          <XMarkIcon
            onClick={() => {
              action();
            }}
            className="w-5 cursor-pointer"
          />
        </div>
        <div className="flex h-full items-center justify-center lg:w-[45%] w-[50%]">
          <img src={product.photoUrl} className="w-64" />
        </div>
        <div className="flex-1 text-[#555C68] bg-white shadow-sm h-full lg:rounded-e-lg rounded-lg lg:p-4 px-4">
          <div className="w-full h-full flex flex-col lg:p-4 p-2 lg:mt-4 mt-2 justify-center">
            <h1 className="max-w-min text-xs font-lato-bold rounded-xl px-2 py-[2px] text-[#ffc100] border border-[#ffc100]">
              {product.category.category_name}
            </h1>
            <h1 className="lg:py-4 py-2 font-lato-bold text-xl">
              {product.name}
            </h1>
            <p className="py-1 font-lato text-sm text-justify">
              {product.description}
            </p>
            <p className="pt-3 font-lato-bold text-xs opacity-90">PRICE</p>
            <p className="font-lato-bold text-lg tracking-wide">
              {product.price.toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}
            </p>
            <div className="py-3 flex flex-row justify-between select-none">
              {/* <div className="flex flex-col">
                <p className="pt-3 font-lato-bold text-xs opacity-90">
                  QUANTITY
                </p>
                <div className="my-1 items-center flex flex-row max-w-min py-1 px-2 border rounded-[15px] shadow-sm">
                  
                  <p className="w-8 bg-white text-center  font-lato-bold">
                    {quantity}
                  </p>
                  <PlusIcon
                    onClick={() => {
                      if (quantity < product.stock - product.sold) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    className={`w-4 cursor-pointer text-[#1F2F3D]`}
                  />
                </div>
              </div> */}
              <div className="flex flex-col">
                <p className="pt-3 font-lato-bold text-xs opacity-90">STOCK</p>
                <div className="my-1 items-center flex flex-row max-w-min py-1 px-2 border rounded-[15px] shadow-sm">
                  <p className="w-8 bg-white text-center font-lato-bold">
                    {product.stock - product.sold}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="py-3 flex flex-row justify-between gap-4 font-lato-bold text-sm">
              <button
                disabled={onCart}
                onClick={() => {
                  if (!user._id) return signUp(true);

                  handleCart();
                }}
                className={`${
                  onCart && "opacity-60"
                } border-[#ffc100] w-full text-[#ffc100] h-10 border rounded-lg shadow-sm flex items-center justify-center`}
              >
                {onCart ? (
                  <CircularProgress
                    size={"24px"}
                    color="inherit"
                    className="text-[#ffc100]"
                  />
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={() => {
                  if (!user._id) return signUp(true);
                  handleCheckout();
                }}
                className="w-full h-10 shadow-sm rounded-lg bg-[#ffc100]"
              >
                Checkout
              </button>
            </div> */}
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={!!checkoutItem}
          >
            {!!checkoutItem && (
              <Checkout
                checkout={checkoutItem}
                refresh={() => {
                  refresh();
                }}
                close={() => {
                  setCheckoutItem(null);
                }}
              />
            )}
          </Backdrop>
        </div>
      </div>
    </div>
  );
}

export default ShowProduct;
