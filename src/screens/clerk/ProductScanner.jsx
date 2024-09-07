import React, { useState } from "react";
import Html5QrcodePlugin from "../../components/Html5QrcodePlugin";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ProductScanner({ close, createOrder, data, scannedProduct }) {
  var isTimeout = false;

  const onNewScanResult = (result, _) => {
    if (!isTimeout) {
      isTimeout = true;
      createOrder(result);
      setTimeout(() => {
        isTimeout = false;
      }, 3000);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center ">
      <div
        onClick={() => {
          close();
        }}
        className="absolute right-0 top-0 flex gap-2 cursor-pointer border border-[#555C68]/40 py-2 w-36 justify-center rounded-lg shadow-sm"
      >
        <XMarkIcon className="w-5" />
        <h1 className="font-lato-bold text-sm">Close Scanner</h1>
      </div>
      <div className="w-[500px] h-[550px]">
        <Html5QrcodePlugin
          fps={15}
          qrbox={250}
          disableFlip={false}
          qrCodeSuccessCallback={onNewScanResult}
        />
      </div>
      {!data ? (
        <div className="h-full py-4">
          <p className="text-base font-lato-bold">Scan a barcode now.</p>
        </div>
      ) : scannedProduct ? (
        <div className="flex-col w-full h-full p-4 justify-center items-center">
          <div className="px-4 w-full flex flex-col items-center">
            <p className="">
              Barcode:{" "}
              <span className="font-lato-bold">{scannedProduct.barcode}</span>
            </p>
            <p>
              Product:{" "}
              <span className="font-lato-bold">{scannedProduct.name}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full p-4 justify-center items-center">
          <div className="px-4 w-full h-full">
            <p className="pb-2">
              Barcode: <span className="font-lato-bold">{data}</span>
            </p>
            <p className="text-base font-lato-bold">
              No product found from this barcode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductScanner;
