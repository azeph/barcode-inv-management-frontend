import { XMarkIcon } from '@heroicons/react/24/outline';
import { BookmarkBorder } from '@mui/icons-material';
import { Backdrop } from '@mui/material';
import React, { useState } from 'react'
import Confirmation from './Confirmation';
import { checkoutOrder } from '../../api/order_api';

function Checkout({ checkout, close, refresh }) {

    const [isConfirm, setConfirm] = useState(null);

    const handleCheckout = async () => {
        checkoutOrder(checkout)
            .then((res) => res.json())
            .then((data) => {
                setConfirm(data);
            }).catch((err) => {
                setConfirm(data);
            })
    }

    return (
        <div className='w-[400px] h-[420px] bg-white rounded-lg'>
            <div className='w-full h-full flex flex-col py-5 px-4 text-[#555C68]'>
                <div className='flex flex-row justify-between px-2'>
                    <h1 className='font-lato-bold text-base'>Checkout Details</h1>
                    <XMarkIcon onClick={() => {
                        close();
                    }} className='w-5 cursor-pointer' />
                </div>
                <div className='flex flex-col w-full h-full px-2'>
                    <p className='py-2 font-lato-light'>Please confirm your order to proceed.</p>
                    <div className='flex flex-col w-full py-4'>
                        <div className='flex flex-row gap-4 pb-4'>
                            <img className='w-28 border rounded-lg shadow-sm' src={checkout.product['photoUrl']} alt='product' />
                            <div className='w-full flex flex-col gap-2 py-2'>
                                <h1 className='font-lato-bold'>{checkout.product.name}</h1>
                                <h1 className='font-lato-bold'>{checkout.product.price.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'PHP',
                                })}</h1>
                            </div>
                        </div>
                        <div className='flex flex-row justify-between font-lato py-2 text-sm'>
                            <h1 className=''>Quantity</h1>
                            <p className='py-[2px] border w-10 rounded-lg shadow-sm text-center'>{checkout.quantity}</p>
                        </div>
                        <div className='h-[1px] bg-[#555C68]/20 my-1'></div>
                        <div className='flex flex-row justify-between font-lato-bold py-2 text-base'>
                            <h1 className=''>Total Amount</h1>
                            <h1 className=''>{checkout.orderAmount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'PHP',
                            })}</h1>
                        </div>
                    </div>
                    <div className='h-full w-full items-end flex mb-6'>
                        <button
                            onClick={() => {
                                handleCheckout();
                            }}
                            className='w-full h-10 rounded-lg justify-end font-lato-bold bg-[#ffc100]'>Place your order</button>
                    </div>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={!!isConfirm}
                    >
                        {!!isConfirm && <Confirmation
                            refresh={
                                () => {
                                    close();
                                    refresh();
                                }
                            }
                            confirm={isConfirm} close={() => { setConfirm(null) }} />}
                    </Backdrop>
                </div>
            </div>

        </div>
    )
}

export default Checkout