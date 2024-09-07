import { XMarkIcon } from "@heroicons/react/24/outline";
import { Backdrop } from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import Barcode from "react-barcode";
import UpdateProduct from "./UpdateProduct";
import { deleteProduct } from "../../api/product_api";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import PopupDialog from "../../components/PopupDialog";

function ProductDetails({
  product,
  close,
  refresh,
  inventory = true,
  categories,
}) {
  const [updateProduct, setUpdateProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const TextBuilder = ({ label, value, className }) => {
    return (
      <div className={className}>
        <label className="text-sm font-lato-bold opacity-80">{label}</label>
        <p className="text-ellipsis font-lato-bold text-sm">{value}</p>
      </div>
    );
  };

  const handleDelete = () => {
    deleteProduct(product._id)
      .then((res) => res.json())
      .then((val) => {
        close();
        refresh();
        dispatch(
          show({
            type: "success",
            message: "Product has been deleted successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          show({
            type: "error",
            message: "Failed to delete the product.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  return (
    <div
      className={`w-[500px] ${
        inventory ? "h-[580px]" : "h-[550px]"
      } bg-white rounded-lg`}
    >
      <div className="w-full h-full flex flex-col p-4 font-lato text-[#555C68]">
        <div className="flex flex-row justify-between px-1">
          <h1 className="font-lato-bold text-base">Product Details</h1>
          <XMarkIcon
            onClick={() => {
              close();
            }}
            className="w-5 cursor-pointer"
          />
        </div>
        <div className="flex flex-row gap-4 py-3 px-2">
          <img
            src={product.photoUrl}
            className="w-40 h-40 border rounded-lg shadow-sm"
          />
          <div className="w-full flex flex-col gap-1">
            <TextBuilder label={"Product Name"} value={product.name} />
            <TextBuilder
              label={"Category"}
              value={product.category.category_name}
            />
            {/* <TextBuilder label={'Manufacturer'} value={product.vendor} /> */}
          </div>
        </div>
        <div className="flex flex-row px-2 justify-between">
          <TextBuilder
            label={"Price"}
            value={product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
          />
          <TextBuilder
            label={"Cost"}
            value={product.cost.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
          />
          <TextBuilder
            className={"w-16"}
            label={"Stock"}
            value={product.stock - product.sold + "/" + product.stock}
          />
        </div>

        <div className="flex flex-col h-28 px-2 w-full overflow-hidden mt-2">
          <label className="py-1 text-sm font-lato-bold opacity-80">
            Description
          </label>
          <div className="w-full h-24 border rounded p-2 text-sm overflow-auto">
            {product.description}
          </div>
        </div>
        <div className="flex flex-row px-2 py-2">
          <div className="flex flex-col w-full gap-2">
            <div className="w-full">
              <label className="py-1 text-sm font-lato-bold opacity-80">
                Date Added
              </label>
              <p className="text-ellipsis font-lato text-sm">
                {format(product.createdAt, "yyyy-MM-dd - p")}
              </p>
            </div>
            <div className="w-full">
              <label className="py-1 text-sm font-lato-bold opacity-80">
                Date Updated
              </label>
              <p className="text-ellipsis font-lato text-sm">
                {format(product.updatedAt, "yyyy-MM-dd - p")}
              </p>
            </div>
          </div>
          <div className="w-full h-full border flex items-center justify-center">
            <Barcode
              margin={0}
              height={40}
              width={1.6}
              background="transparent"
              fontSize={14}
              value={product.barcode}
            />
          </div>
        </div>
        {inventory && (
          <div className="mt-4 flex flex-row justify-end gap-8 mx-2">
            <button
              onClick={() => {
                setShowDialog(true);
              }}
              className="h-9 font-lato-bold text-sm"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setUpdateProduct(product);
              }}
              className="w-36 border h-9 font-lato-bold text-sm text-[#ffc100] border-[#ffc100] rounded"
            >
              Update
            </button>
          </div>
        )}
        <PopupDialog
          show={showDialog}
          close={() => {
            setShowDialog(false);
          }}
          title="Delete Product"
          content="Are you sure you want to delete this product?"
          action1={() => {
            handleDelete();
            setShowDialog(false);
          }}
          action2={() => {
            setShowDialog(false);
          }}
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!updateProduct}
        >
          {!!updateProduct && (
            <UpdateProduct
              refresh={() => {
                setUpdateProduct(null);
                refresh();
              }}
              currentProduct={updateProduct}
              close={() => {
                setUpdateProduct(null);
              }}
              categories={categories}
            />
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export default ProductDetails;
