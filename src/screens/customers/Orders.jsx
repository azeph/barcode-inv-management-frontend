import React, { useEffect, useMemo, useState } from 'react'
import error from '../../assets/images/error.svg'
import empty from '../../assets/images/empty-cart.svg'
import { Backdrop, CircularProgress } from '@mui/material';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cancelOrder, removeOrder, updateQuantity } from '../../api/order_api';
import { useDispatch } from "react-redux";
import { show } from '../../states/alerts';
import PopupDialog from '../../components/PopupDialog';

function Orders({ orders, refresh }) {
    const [query, setQuery] = useState('');
    const [orderID, setOrderID] = useState(null)

    const dispatch = useDispatch();

    const orderStatus = (state) => {

        if (state == 2) {
            return <h1 className='text-sm py-[2px] px-3 font-lato-bold text-[#49a54d] border border-[#49a54d] rounded-xl'>Completed</h1>
        }

        if (state == 3) {
            return <h1 className='text-sm py-[2px] px-3 font-lato-bold text-[#fb0200] border border-[#fb0200] rounded-xl'>Canceled</h1>
        }

        if (state == 4) {
            return <h1 className='text-sm py-[2px] px-3 font-lato-bold text-[#fb0200] border border-[#fb0200] rounded-xl'>Denied</h1>
        }

        return (
            <h1 className='text-sm py-[2px] px-3 font-lato-bold text-[#ffc100] border border-[#ffc100] rounded-xl'>Pending</h1>
        )
    }

    const columns = useMemo(
        () => [
            {
                name: "#",
                cell: (row, index) => {
                    return (
                        <div className='flex flex-row h-full w-full items-center justify-center gap-5'>
                            <div className='p-1 w-[72px] h-[72px] rounded-lg border'>
                                <img className='w-full h-full rounded-lg object-cover' src={row.product.photoUrl} alt='product photo' />
                            </div>
                        </div>
                    )
                },
                width: '120px'
            },
            {
                name: "Product Name",
                selector: (row) => row.product.name,
                width: '280px'
            },
            {
                name: "Price",
                cell: (row) => <p className='w-full text-base overflow-hidden font-lato-bold text-ellipsis'>{row.product.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                })}</p>,
                width: '120px'
            },
            {
                name: "Quantity",
                cell: (row) => {

                    return (
                        <p className='py-[2px] border w-10 rounded-lg font-lato-bold text-base shadow-sm text-center'>{row.quantity}</p>
                    )
                },
                width: '150px'
            },
            {
                name: "Total Amount",
                cell: (row, index) => <p className='w-full text-base overflow-hidden font-lato-bold text-ellipsis'>{row.orderAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                })}</p>,
                width: '130px'
            },
            {
                name: "Order Status",
                cell: (row, index) =>
                    <div className='flex flex-row gap-4'>
                        <div className='flex-1'>
                            {
                                orderStatus(row.orderStatus)
                            }
                        </div>
                        {
                            row.orderStatus == 1 && <button
                                onClick={() => {
                                    setOrderID(row._id)
                                }}
                                className='w-20 font-lato-bold text-sm'>Cancel</button>
                        }
                    </div>,
                width: '120px'
            }
        ]
    );

    const statusBuilder = (state) => {
        if (state == 2) {
            return (
                <div className='w-full h-full flex flex-col items-center pt-4'>
                    <img src={empty} className='w-60 h-60' />
                    <h1 className='font-lato text-lg '>Your cart is empty, get some items now!</h1>
                </div>
            )
        }

        if (state == -1) {
            return (
                <div className='w-full h-full flex flex-col items-center pt-4'>
                    <img src={error} className='w-60 h-60' />
                    <h1 className='font-lato text-lg '>Oops, an error occurred.</h1>
                </div>
            )
        }

        return (
            <div className='w-full h-full flex flex-col items-center justify-center pb-8 gap-4'>
                <CircularProgress color='inherit' className='text-[#ffc100]' />
                <h1 className='font-lato'>Loading orders, please wait...</h1>
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            <div className='bg-white rounded-lg border shadow-sm flex flex-col w-full my-4 px-4 pt-4'>
                <div className='w-1/4 flex flex-col'>
                    <input
                        value={query}
                        onChange={(e) => {
                            const query = e.target.value
                            setQuery(query)
                        }}
                        className='px-2 text-sm rounded-md h-10 border focus:outline-non'
                        placeholder='Search item' />
                </div>
                <div className='flex flex-row w-full h-14 items-center'>
                    {
                        columns.map((item) => {
                            return (
                                <p key={item.name} style={{ width: item.width }} className='text-[#555C68]/80 text font-lato-bold mx-1'>{item.name}</p>
                            );
                        })
                    }
                </div>

            </div>
            {
                orders.fetchState != 1 ?
                    statusBuilder(orders.fetchState)
                    :
                    <div className='w-full h-full overflow-auto'>
                        <div className='flex flex-col gap-2'>{
                            orders['orders'].map((item, index) => {
                                return (
                                    <div key={item._id} className='w-full rounded-lg bg-white border h-24 px-4'>
                                        <div className='flex flex-row items-center h-full'>
                                            {columns.map((col) => {
                                                return (
                                                    <div style={{ width: col.width }} className='font-lato mx-1 h-full flex flex-row items-center'>
                                                        {col.cell ? col.cell(item, index)
                                                            : <p className='w-full text-base font-lato-bold'>{col.selector(item)}</p>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                    </div>
            }
            {!!orderID && <PopupDialog
                title='Cancel Order'
                content='Are you sure you want to cancel this order?'
                show={!!orderID}
                close={() => { setOrderID(null) }}
                action1={() => {
                    cancelOrder(orderID, 3).then((res) => res.json()).then((val) => {

                        if (!val) {
                            setOrderID(null);
                            return dispatch(show({
                                type: 'error',
                                message: 'Failed to cancel order.',
                                duration: 3000,
                                show: true
                            }));
                        }

                        refresh();
                        dispatch(show({
                            type: 'success',
                            message: 'Your order was cancelled.',
                            duration: 3000,
                            show: true
                        }));
                        setOrderID(null);
                    })
                }}
                action2={() => {
                    setOrderID(null)
                }}
            />}

        </div>
    )
}

export default Orders