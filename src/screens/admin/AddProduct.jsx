import React, { useState, useReducer, useRef, useMemo, useEffect } from "react";
import {
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  PencilSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { addProduct } from "../../api/product_api";
import { useSelector } from "react-redux";
import { CLOUDINARY_URL } from "../../../config";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import PopupDialog from "../../components/PopupDialog";
import { CircularProgress } from "@mui/material";
import Barcode from "react-barcode";
import barcodeIcon from "../../assets/images/barcode.png";
import Backdrop from "@mui/material/Backdrop";
import BarcodeScanner from "../../components/BarcodeScanner";

function AddProduct({ close, refresh, barcode, categories, products }) {
  const hiddenFileInput = useRef(null);
  const [error, setError] = useState("");
  const [fileImage, setFileImage] = useState(null);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdding, setAdding] = useState(false);
  const [scan, setScan] = useState(false);

  const [product, updateProduct] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      userID: "",
      name: "",
      description: "",
      photoUrl: null,
      price: "",
      stock: "",
      cost: "",
      category: "",
      barcode: barcode || "",
      sold: "",
    }
  );

  const cat = useMemo(() => {
    if (categories.fetchState != 1) return [];

    return categories["categories"].map((temp) => {
      return {
        label: temp["category_name"],
        value: temp,
      };
    });
  }, [categories]);

  const Field = (label, value, field, isCurrency = false) => {
    if (isCurrency) {
      return (
        <div className="flex flex-col w-full">
          <label className="pb-1 text-xs font-lato-bold text-[#555C68]/80">
            {label}
          </label>
          <div className="flex flex-row items-center w-full h-8 rounded-md focus:outline-none border border-[#555C68]/50 text-sm px-2">
            <p className="text-[#555C68]/80">&#x20B1;</p>
            <input
              required
              value={value}
              placeholder="0"
              min={0}
              type="number"
              onChange={(e) => {
                const value = e.target.value;
                updateProduct({ [field]: !!value ? parseFloat(value) : null });
              }}
              className="w-full h-8 focus:outline-none bg-transparent text-end"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col w-full">
        <label className="pb-1 text-xs font-lato-bold text-[#555C68]/80">
          {label}
        </label>
        <input
          required
          value={value}
          onChange={(e) => {
            updateProduct({ [field]: e.target.value });
          }}
          className="w-full h-8 rounded-md focus:outline-none border border-[#555C68]/50 text-sm px-2"
        />
      </div>
    );
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryApp");

    return fetch(`${CLOUDINARY_URL}/image/upload`, {
      method: "POST",
      body: data,
    });
  };

  const handleAddProduct = async () => {
    setAdding(true);
    const photoUrl = await uploadImage(fileImage)
      .then((res) => res.json())
      .then((data) => data.url)
      .catch((error) => console.log(error));

    var newProduct = product;
    newProduct["photoUrl"] = photoUrl;

    addProduct(newProduct)
      .then((res) => res.json())
      .then((val) => {
        setAdding(false);
        handleReset();
        refresh();

        dispatch(
          show({
            type: "success",
            message: "Product added successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setAdding(false);
        dispatch(
          show({
            type: "error",
            message: "Failed to add the product.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileImage == null) {
      setError("Please add a product image.");
      return;
    }

    setError(null);

    updateProduct({
      userID: user._id,
      category: JSON.parse(e.target[2].value),
    });

    setShowDialog(true);
  };

  const handleReset = () => {
    Object.keys(product).forEach((inputKey) => {
      updateProduct({
        [inputKey]: ["price", "cost", "stock"].includes(inputKey) ? 0 : "",
      });
    });

    setFileImage(null);

    close();
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const fileUploaded = event.target.files[0];

    if (!allowedTypes.includes(fileUploaded.type)) {
      setError("Invalid image file.");
      return;
    }
    setError(null);
    setFileImage(fileUploaded);
  };

  const imageDisplay = (photo) => {
    if (photo != null) {
      return (
        <div className="relative w-full h-full rounded-lg">
          <div className="absolute z-10 opacity-0 hover:opacity-100 bg-black/40 w-[140px] h-[120px] rounded-lg">
            <div className="flex flex-row items-center text-white justify-center h-full gap-2 cursor-pointer select-none">
              <PencilSquareIcon className="w-5" />
              <p className="text-xs font-lato-bold flex flex-row gap-1 items-center">
                Edit Image
              </p>
            </div>
          </div>
          <img
            src={URL.createObjectURL(photo)}
            className="object-cover w-[140px] h-[120px] rounded-lg"
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 cursor-pointer select-none">
        <PhotoIcon className="w-8 " />
        <p className="text-xs font-lato-bold flex flex-row gap-1 items-center">
          <span>
            <PlusIcon className="w-3 h-3" />
          </span>
          Add image
        </p>
      </div>
    );
  };

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
      updateProduct({ barcode: e.detail });
    });

    return () => {
      document.removeEventListener("scanComplete", function (e) {
        console.log(e.detail);
      });
    };
  }, []);

  return (
    <div className="relative w-[500px] h-[540px] bg-white rounded-lg text-[#555C68]">
      {isAdding && (
        <div className="flex items-center justify-center absolute w-full h-full bg-white/60">
          <CircularProgress color="inherit" className="text-[#ffc100]" />
        </div>
      )}
      <div className="flex flex-col w-full h-full p-4">
        <div className="flex flex-row h-1 my-4 items-center justify-between px-2">
          <h1 className="flex gap-2 items-center font-lato-bold">
            <span>
              <PlusIcon className="w-5" />
            </span>
            Add new Product
          </h1>
          <XMarkIcon
            onClick={() => {
              handleReset();
              close();
            }}
            className="w-5 cursor-pointer"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="flex flex-col p-4 w-full h-full"
        >
          <div className="flex flex-row gap-4">
            <div
              onClick={handleClick}
              className="w-[140px] text-[#555C68]/70 h-[120px] rounded-lg border-[#555C68]/50 border "
            >
              <input
                onChange={handleChange}
                ref={hiddenFileInput}
                type="file"
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              {imageDisplay(fileImage)}
            </div>
            <div className="flex flex-col flex-1 h-full w-full gap-2">
              {Field("Product Name", product.name, "name")}
              <div className="flex flex-col w-full">
                <label className="pb-1 text-xs font-lato-bold text-[#555C68]/80">
                  Category
                </label>
                <div className="w-full h-8 rounded-md focus:outline-none border border-[#555C68]/50 px-1">
                  <select
                    required
                    className="w-full h-full focus:outline-none bg-transparent text-sm "
                  >
                    {cat.map((item, i) => (
                      <option id={item.id} value={JSON.stringify(item.value)}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-2">
            {Field("Price", product.price, "price", true)}
            {Field("Cost", product.cost, "cost", true)}
            <div className="w-42 flex flex-col">
              <label className="pb-1 text-xs font-lato-bold text-[#555C68]/80">
                Stock
              </label>
              <input
                required
                type="number"
                min={0}
                value={product.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  updateProduct({
                    stock: !!value ? parseFloat(value) : 0,
                  });
                }}
                className="w-full h-8 rounded-md focus:outline-none border border-[#555C68]/50 text-sm px-2"
              />
            </div>
          </div>

          <label className="mt-2 p-1 text-xs font-lato-bold text-[#555C68]/80">
            Description
          </label>
          <textarea
            value={product.description}
            onChange={(e) => {
              updateProduct({ description: e.target.value });
            }}
            placeholder="Add product description"
            rows={2}
            className="text-sm p-2 border-[#555C68]/50 border rounded-md resize-none focus:outline-none"
          />
          <div className="h-[100px] w-full flex flex-row mt-4 gap-2">
            <div className="flex flex-col flex-1 justify-between">
              {Field("Product Barcode", product.barcode, "barcode")}
              <div className="flex flex-row w-full items-center gap-2">
                <div
                  onClick={() => {
                    const genBarcode = String(Date.now()).slice(3, 13);

                    updateProduct({ barcode: genBarcode });
                  }}
                  className="flex gap-2 h-8 items-center cursor-pointer border border-[#555C68]/40 py-1 flex-1 justify-center rounded-lg shadow-sm"
                >
                  <ArrowPathIcon className="w-4" />
                  <h1 className="font-lato-bold text-xs">Generate</h1>
                </div>
                {/* <div
                  onClick={() => {
                    setScan(true);
                  }}
                  className="flex gap-2 cursor-pointer items-center border h-8 border-[#555C68]/40 py-1 flex-1 justify-center rounded-lg shadow-sm"
                >
                  <img src={barcodeIcon} className="w-4 h-4" />
                  <h1 className="font-lato-bold text-xs">Scan Code</h1>
                </div> */}
              </div>
            </div>
            <div className="flex-1 h-[100px] w-[200px] border border-[#555C68]/50 rounded-lg flex items-center justify-center">
              {product.barcode ? (
                <Barcode
                  margin={0}
                  height={40}
                  width={1.6}
                  background="transparent"
                  fontSize={12}
                  value={product.barcode}
                />
              ) : (
                <p className="text-sm font-lato-bold">No barcode</p>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full gap-5 px-2 justify-end mt-5">
            {error && <p className="flex-1 text-sm text-[#ff3333]">{error}</p>}
            <button
              type="submit"
              className="bg-[#ffc100] rounded-md p-2 px-4 text-sm font-lato-bold"
            >
              Add Product
            </button>
            <button
              type="reset"
              className="font-lato-bold text-sm text-[#555C68]"
            >
              Cancel
            </button>
          </div>
        </form>
        <PopupDialog
          show={showDialog}
          close={() => {
            setShowDialog(false);
          }}
          title="Add Product"
          content="Are you sure you want to add this product?"
          action1={() => {
            handleAddProduct();
            setShowDialog(false);
          }}
          action2={() => {
            setShowDialog(false);
          }}
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={scan}
        >
          {scan && (
            <BarcodeScanner
              close={() => {
                setScan(false);
              }}
              stream={scan}
              output={(val) => {
                updateProduct({ barcode: "" });
                setError("");

                const product = products["products"].find(
                  (product) => product.barcode === val
                );

                if (!product) {
                  updateProduct({ barcode: val });
                } else {
                  setError(
                    "The scanned product barcode was already in the inventory."
                  );
                }
                setScan(false);
              }}
            />
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export default AddProduct;
