import React, { useEffect, useReducer } from "react";
import SalesOverview from "./SalesOverview";
import PurchaseOverview from "./PurchaseOverview";
import SalesForecast from "./SalesForecast";

function Dashboard({ sales, products, orders, customers }) {
  const [stats, setStats] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fetchState: 0,
      sales: 0,
      cost: 0,
      revenue: 0,
      stocks: 0,
      products: 0,
      customers: 0,
      pending: 0,
      completed: 0,
    }
  );

  const computeSales = () => {
    var tempSales = 0;
    var tempCost = 0;
    var stocks = 0;

    sales["sales"].map((item) => {
      tempSales = tempSales + item.totalSales;
      tempCost = tempCost + item.totalCost;
    });

    products["products"].map((item) => {
      stocks = stocks + (item.stock - item.sold) * item.price;
    });

    setStats({
      products: products["count"],
      sales: tempSales,
      cost: tempCost,
      stocks: stocks,
      revenue: tempSales - tempCost,
    });
  };

  const getCustomers = () => {
    setStats({
      customers: customers["count"],
    });
  };

  const getOrders = () => {
    setStats({
      completed: !orders["orderGroup"][1] ? 0 : orders["orderGroup"][1].length,
    });
  };

  useEffect(() => {
    getCustomers();
    computeSales();
    getOrders();
  }, [sales, products, orders, customers]);

  return (
    <div className="flex flex-col h-full overflow-auto p-4 gap-2 text-[#555C68]">
      <div className="h-[200px] w-full flex flex-row gap-2 ">
        <SalesOverview stats={stats} />
        {/* <PurchaseOverview stats={stats} /> */}
      </div>
      <SalesForecast sales={sales} />
    </div>
  );
}

export default Dashboard;
