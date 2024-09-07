import React, { useEffect, useMemo, useState } from 'react'
import error from '../../assets/images/error.svg'
import empty from '../../assets/images/empty-cart.svg'
import { Backdrop, CircularProgress } from '@mui/material';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { removeOrder, updateQuantity } from '../../api/order_api';
import { useDispatch } from "react-redux";
import { show } from '../../states/alerts';
import Checkout from './Checkout';

function ShoppingCart({ carts, refresh }) {

    const [query, setQuery] = useState('');
    const [quantity, setQuantity] = useState(null)
    const [onCheckout, setCheckout] = useState(null)

    const dispatch = useDispatch();

    useEffect(() => {

        var temp = [];

        carts['products'].map((item) => {
            temp.push({
                quantity: item.quantity,
                available: item.product.stock - item.product.sold,
                orderAmount: item.orderAmount,
                onUpdate: false
            });
        })

        setQuantity(temp)
    }, [carts.fetchState])

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
                cell: (row, index) => {

                    return (
                        <div className={`my-1 items-center flex flex-row max-w-min py-1 px-2 border rounded-[15px] shadow-sm select-none`}>
                            <MinusIcon
                                onClick={async () => {
                                    if (!quantity[index]['onUpdate']) {
                                        if (quantity[index]['quantity'] > 1) {

                                            let newArr = [...quantity]

                                            const uQuantity = quantity[index]['quantity'] - 1;

                                            updateQuantity({
                                                quantity: uQuantity,
                                                orderID: row._id,
                                                orderAmount: row.product.price * uQuantity,
                                                productID: row.product._id
                                            })
                                                .then((res) => res.json())
                                                .then((val) => {

                                                    if (!val._id) {
                                                        return;
                                                    }

                                                    newArr[index]['quantity'] = val.quantity;
                                                    newArr[index]['orderAmount'] = val.orderAmount;
                                                    newArr[index]['available'] = val.product.stock - val.product.sold;

                                                    setQuantity(newArr)
                                                }).catch((err) => {
                                                    console.log(err)
                                                });
                                        }
                                    }
                                }
                                } className={`w-4 cursor-pointer text-[#1F2F3D]`} />
                            <p className='w-8 bg-white text-center font-lato-bold'>{quantity[index]['quantity']}</p>
                            <PlusIcon onClick={async () => {
                                if (!quantity[index]['onUpdate']) {
                                    if (quantity[index]['quantity'] < quantity[index].available) {

                                        let newArr = [...quantity]

                                        const uQuantity = quantity[index]['quantity'] + 1;

                                        updateQuantity({
                                            quantity: uQuantity,
                                            orderID: row._id,
                                            orderAmount: row.product.price * uQuantity,
                                            productID: row.product._id
                                        })
                                            .then((res) => res.json())
                                            .then((val) => {

                                                if (!val._id) {
                                                    return;
                                                }

                                                newArr[index]['quantity'] = val.quantity;
                                                newArr[index]['orderAmount'] = val.orderAmount;
                                                newArr[index]['available'] = val.product.stock - val.product.sold;

                                                setQuantity(newArr)
                                            }).catch((err) => {
                                                console.log(err)
                                            });

                                    }
                                }
                            }
                            } className={`w-4 cursor-pointer text-[#1F2F3D]`} />
                        </div>)
                },
                width: '150px'
            },
            {
                name: "Total Amount",
                cell: (row, index) => <p className='w-full text-base overflow-hidden font-lato-bold text-ellipsis'>{quantity[index].orderAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'PHP',
                })}</p>,
                width: '130px'
            },
            {
                name: "Actions",
                cell: (row, index) =>
                    <div className='flex flex-row gap-2'>
                        <button
                            onClick={() => {

                                const newItem = {
                                    orderID: row._id,
                                    productID: row.product._id,
                                    product: row.product,
                                    quantity: quantity[index]['quantity'],
                                    orderAmount: quantity[index]['orderAmount']
                                }

                                setCheckout(newItem)
                            }}
                            className='w-24 py-[6px] rounded-lg text-sm font-lato-bold bg-[#ffc100]'>Checkout</button>
                        <button
                            onClick={() => {
                                removeOrder(row._id).then((res) => res.json())
                                    .then((val) => {
                                        dispatch(show({
                                            type: 'success',
                                            message: 'Item has been removed.',
                                            duration: 3000,
                                            show: true
                                        }))
                                        refresh();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        dispatch(show({
                                            type: 'error',
                                            message: 'Failed to remove the item.',
                                            duration: 3000,
                                            show: true
                                        }))
                                    });
                            }}
                            className='w-20 font-lato-bold text-sm'>Delete</button>
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
                <h1 className='font-lato'>Loading cart, please wait...</h1>
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
                carts.fetchState != 1 || !quantity ?
                    statusBuilder(!quantity ? 0 : carts.fetchState)
                    :
                    <div className='w-full h-full overflow-auto'>
                        <div className='flex flex-col gap-2'>{
                            carts['products'].map((item, index) => {
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={!!onCheckout}
            >
                {!!onCheckout && <Checkout checkout={onCheckout} refresh={() => { refresh() }} close={() => { setCheckout(null) }} />}
            </Backdrop>
        </div>
    )
}

export default ShoppingCart