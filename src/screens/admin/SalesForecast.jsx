import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import salesforecast from "../../assets/data/salesforecast.json";
import makePrediction from "../../components/SimpleSalesForecast";
import { format } from "date-fns";
import { forecastIcon, growthIcon } from "../../assets/images";

function SalesForecast({ sales }) {
  const [forecastData, setForecast] = useState([]);
  const [selected, setSelected] = useState(2);
  const [monthly, setMonthly] = useState([]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getPrediction = () => {
    const predictions = makePrediction(
      salesforecast["forecast_input"],
      salesforecast["months_to_predict"],
      salesforecast["sales_cycle"]
    );

    const group = sales["sales"].reduce((group, sale) => {
      const { dateRecord } = sale;
      group[format(dateRecord, "MMM")] = group[format(dateRecord, "MMM")] ?? [];
      group[format(dateRecord, "MMM")].push(sale);
      return group;
    }, {});

    var newData = [];
    months.map((key, index) => {
      let sales = 0;

      if (!group[key]) {
        return newData.push({
          name: key,
          Forecasted: Math.round(predictions["predictions"][index]),
        });
      }

      group[key].map((item) => {
        sales = sales + item.totalSales;
      });

      newData.push({
        name: key,
        Actual: sales,
        Forecasted: Math.round(predictions["predictions"][index]),
      });
    });

    const mon = new Date().getMonth();

    setSelected({
      label: newData[mon].name,
      actual: newData[mon]["Actual"] || "No data yet.",
      forecast: newData[mon]["Forecasted"] || "No data yet.",
    });
    setForecast(newData);
  };

  const computeMonthlySales = () => {
    var newData = [];

    const group = sales["sales"].reduce((group, sale) => {
      const { dateRecord } = sale;
      group[format(dateRecord, "MMM/yyyy")] =
        group[format(dateRecord, "MMM/yyyy")] ?? [];
      group[format(dateRecord, "MMM/yyyy")].push(sale);
      return group;
    }, {});

    Object.keys(group).forEach((key) => {
      let sales = 0;
      let cost = 0;
      let revenue = 0;

      group[key].map((item) => {
        sales = sales + item.totalSales;
        cost = cost + item.totalCost;
        revenue = revenue + item.totalRevenue;
      });

      newData.push({
        name: key,
        Sales: sales,
        Cost: cost,
        Revenue: revenue,
      });
    });

    setMonthly(newData);
  };

  useEffect(() => {
    getPrediction();
    computeMonthlySales();
  }, [sales]);

  return (
    <div className="flex flex-row w-full h-full gap-2">
      <div className="flex flex-col flex-1 h-full bg-white border rounded-lg p-4 gap-2">
        <div className="flex flex-row w-full items-center justify-between ">
          <h1 className="font-lato-bold">Sales Forecast</h1>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-2">
              <label className="w-4 h-1 bg-[#ffc100]" />
              <h1 className="font-lato-bold text-sm">
                Actual({selected["label"]}):
              </h1>
              <p className="font-lato-bold text-sm">{selected["actual"]}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <label className="w-4 h-1 bg-[#8400ff]" />
              <h1 className="font-lato-bold text-sm">
                Forcasted({selected["label"]}):
              </h1>
              <p className="font-lato-bold text-sm">{selected["forecast"]}</p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="90%" className="text-sm py-2">
          <LineChart
            width={450}
            height={250}
            data={forecastData}
            onClick={(e) => {
              const payload = e.activePayload[0]["payload"];
              setSelected({
                label: e.activeLabel,
                actual: payload["Actual"] || "No data yet.",
                forecast: payload["Forecasted"] || "No data yet.",
              });
            }}
            margin={{
              top: 5,
              right: 10,
              left: 15,
              bottom: 15,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <XAxis dataKey="name">
              <Label value="Months of the Year" offset={0} position="bottom" />
            </XAxis>
            <YAxis>
              <Label value="Sales" angle={-90} offset={0} position="left" />
            </YAxis>
            <Line
              type="monotone"
              dataKey="Actual"
              stroke="#ffc100"
              activeDot={{ r: 5 }}
            />
            <Line type="monotone" dataKey="Forecasted" stroke="#8400ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col p-4 w-1/2 h-full bg-white border shadow-sm rounded-lg gap-2">
        <h1 className="font-lato-bold">Monthly Sales</h1>
        <ResponsiveContainer className="text-sm py-2" width="100%" height="90%">
          <BarChart
            width={350}
            height={250}
            data={monthly}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sales" fill="#ffc100" />
            <Bar dataKey="Cost" fill="#ff007b" />
            <Bar dataKey="Revenue" fill="#8400ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesForecast;
