import React from "react";
import {
  costIcon,
  purchaseIcon,
  pendingIcon,
  completedIcon,
  customerIcon,
} from "../../assets/images";

function PurchaseOverview({ stats }) {
  return (
    <div className="flex-1 h-full bg-white rounded-lg border p-4">
      <h1 className="font-lato-bold text-sm">Store Overview</h1>
      <div className="flex flex-col py-4 px-1">
        <div className="flex flex-row w-full">
          <div className="flex flex-1 flex-row">
            <div className="w-10 h-10 bg-[#fff2cc] p-2 rounded-lg">
              <img src={purchaseIcon} className="w-6 h-6" />
            </div>
            <div className="flex flex-col px-4">
              <p className="font-lato-bold text-xs">No. of Products</p>
              <p className="font-lato-bold">{stats.products}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row py-4 w-full">
          <div className="flex flex-1 flex-row">
            <div className="w-10 h-10 p-2 bg-[#6EBC25]/20 rounded-lg">
              <img src={completedIcon} className="w-6 h-6" />
            </div>
            <div className="flex flex-col px-4">
              <p className="font-lato-bold text-xs">Completed Orders</p>
              <p className="font-lato-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOverview;
