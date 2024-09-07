import React from 'react'
import success from '../../assets/images/success.png'
import fail from '../../assets/images/failed.png'

function Confirmation({ confirm, close, refresh }) {
    return (
        <div className='w-[360px] h-[310px] bg-white rounded-lg'>
            {
                confirm.status == 'success' ? <div className='flex flex-col w-full h-full p-8 items-center text-[#555C68]'>
                    <img src={success} alt='logo' className='w-20' />
                    <h1 className='py-4 text-lg font-lato-bold'>Order successfully placed!</h1>
                    <p className='font-lato-light'>Keep track of the status of your order.</p>
                    <button
                        onClick={() => {
                            close();
                            refresh();
                        }}
                        className='p-2 mt-8 border border-[#ffc100] rounded-lg w-36 text-sm text-[#ffc100]'>Close</button>
                </div> :
                    <div className='flex flex-col w-full h-full p-6 items-center text-[#555C68]'>
                        <img src={fail} alt='logo' className='w-20' />
                        <h1 className='py-4 text-lg font-lato-bold'>Failed to place order!</h1>
                        <p className='font-lato-light text-center'>{confirm.message}</p>
                        <button
                            onClick={() => {
                                close();
                            }}
                            className='p-2 mt-6 border border-[#ffc100] rounded-lg w-32 text-sm text-[#ffc100]'>Close</button>
                    </div>
            }
        </div>
    )
}

export default Confirmation