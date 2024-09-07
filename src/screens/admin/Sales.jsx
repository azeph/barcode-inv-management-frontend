import React, { useEffect, useReducer, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsivePieCanvas } from '@nivo/pie'
import { format } from 'date-fns';

function Sales({ sales }) {

    const [monthly, setMonthly] = useState([]);
    const [productSales, setProductSales] = useState([]);

    const [stats, setStats] = useReducer((prev, next) => {
        return { ...prev, ...next }
    },
        {
            sales: 0,
            cost: 0,
            revenue: 0
        });

    const display = [
        {
            id: 0,
            label: "Sales",
            field: 'sales'
        },
        {
            id: 1,
            label: "Cost",
            field: 'cost'
        },
        {
            id: 2,
            label: "Revenue",
            field: 'revenue'
        }
    ]

    const computeSales = () => {

        var tempSales = 0;
        var tempCost = 0;

        sales['sales'].map((item) => {
            tempSales = tempSales + item.totalSales
            tempCost = tempCost + item.totalCost
        });

        setStats({
            sales: tempSales,
            cost: tempCost,
            revenue: tempSales - tempCost
        })
    }

    const computeMonthlySales = () => {

        var newData = [];

        const group = sales['sales'].reduce((group, sale) => {
            const { dateRecord } = sale;
            group[format(dateRecord, 'MMM/yyyy')] = group[format(dateRecord, 'MMM/yyyy')] ?? [];
            group[format(dateRecord, 'MMM/yyyy')].push(sale);
            return group;
        }, {});

        Object.keys(group).forEach((key) => {

            let sales = 0;
            let cost = 0;
            let revenue = 0;

            group[key].map((item) => {
                sales = sales + item.totalSales
                cost = cost + item.totalCost
                revenue = revenue + item.totalRevenue
            })

            newData.push({
                name: key,
                Sales: sales,
                Cost: cost,
                Revenue: revenue,
            })
        });

        setMonthly(newData);
    }

    const computeProductSales = () => {

        var newData = [];

        const group = sales['sales'].reduce((group, sale) => {
            const { name } = sale.product;
            group[name] = group[name] ?? [];
            group[name].push(sale);
            return group;
        }, {});

        Object.keys(group).forEach((key) => {

            let sales = 0;

            group[key].map((item) => {
                sales = sales + item.totalSales
            })

            newData.push({
                "id": key,
                "label": group[key][0].productID,
                "value": sales
            })
        });

        setProductSales(newData);
    }

    useEffect(() => {
        computeSales();
        computeMonthlySales();
        computeProductSales();
    }, [sales])

    return (
        <div className='w-full h-full p-4 overflow-hidden'>
            <div className='w-full h-full flex flex-col overflow-auto text-[#555C68] font-lato gap-4'>
                <div className='w-full flex flex-row gap-4'>
                    {
                        display.map((item) => {
                            return (
                                <div key={item.id} className='select-none flex flex-col w-full h-28 bg-white rounded-lg shadow-sm border py-2 px-4'>
                                    <h1 className='font-lato-bold text-base'>{item.label}</h1>
                                    <h1 className='p-2 py-4 font-lato-black text-xl'>{stats[item.field].toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'PHP',
                                    })}</h1>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='flex flex-row w-full h-full gap-4'>
                    <div className='flex flex-col p-4 w-1/2 h-full bg-white border shadow-sm rounded-lg gap-2'>
                        <h1 className='font-lato-bold text-base'>Monthly Sales</h1>
                        <ResponsiveContainer className='font-lato' width="100%" height="90%">
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
                    <div className='flex flex-col p-4 w-1/2 h-[500px] bg-white border shadow-sm rounded-lg gap-2'>
                        <h1 className='font-lato-bold text-base'>Sales by Product</h1>
                        <ResponsivePieCanvas
                            data={productSales}
                            margin={{ top: 80, right: 120, bottom: 80, left: 120 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={{ scheme: 'paired' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sales