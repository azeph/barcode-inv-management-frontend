import React from "react";
import {
  salesIcon,
  costIcon,
  revenueIcon,
  profitIcon,
  purchaseIcon,
  completedIcon,
} from "../../assets/images";

function SalesOverview({ stats }) {
  const itemBuilder = (icon, label, value, isCurrency = false, color) => {
    return (
      <div className="flex flex-1 flex-row">
        <div className={`w-12 h-12 p-2 rounded-lg ${color}`}>
          <img src={icon} className="w-8 h-8" />
        </div>
        <div className="flex flex-col px-4 justify-center">
          <p className="font-lato-bold text-sm leading-none">{label}</p>
          <p className="font-lato-bold text-lg">
            {isCurrency
              ? value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PHP",
                })
              : value}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col w-full flex-1 h-full bg-white rounded-lg border p-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-lato-bold text">Sales Overview</h1>
      </div>
      <div className="flex flex-col py-4 px-2 gap-2">
        <div className="flex flex-row w-full">
          {itemBuilder(
            salesIcon,
            "Total Sales",
            stats.sales,
            true,
            "bg-[#fff2cc]"
          )}
          {itemBuilder(
            revenueIcon,
            "Revenue",
            stats.revenue,
            true,
            "bg-[#8400ff]/10"
          )}
          {itemBuilder(costIcon, "Cost", stats.cost, true, "bg-[#ff007b]/10")}
        </div>
        <div className="flex flex-row py-4 w-full items-center">
          {itemBuilder(
            profitIcon,
            "Stocks",
            stats.stocks,
            true,
            "bg-[#6EBC25]/20"
          )}
          {itemBuilder(
            purchaseIcon,
            "No. of Products",
            stats.products,
            false,
            "bg-[#fff2cc]"
          )}
          {itemBuilder(
            completedIcon,
            "Completed Transactions",
            stats.completed,
            false,
            "bg-[#6EBC25]/20"
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesOverview;
