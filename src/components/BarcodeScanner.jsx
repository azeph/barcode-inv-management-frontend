import React, { useEffect, useState } from "react";
import barcode from "../assets/images/barcode.png";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Html5QrcodePlugin from "./Html5QrcodePlugin";

function BarcodeScanner({ output, stream, close }) {
  const onNewScanResult = (decodedText, _) => {
    output(decodedText);
  };

  return (
    <div className="w-[500px] h-[500px] bg-white rounded-lg ">
      <div className="w-full h-full flex flex-col text-[#555C68] font-lato">
        <div className="flex flex-row h-1 my-4 items-center justify-between px-4 py-2">
          <h1 className="flex gap-2 items-center text-sm font-lato-bold">
            <span>
              <img src={barcode} className="w-5" />
            </span>
            Barcode Scanner
          </h1>
          <XMarkIcon
            onClick={() => {
              close();
            }}
            className="w-5 cursor-pointer"
          />
        </div>
        <div className="w-[500px] h-[500px]">
          <Html5QrcodePlugin
            fps={15}
            qrbox={280}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanner;
