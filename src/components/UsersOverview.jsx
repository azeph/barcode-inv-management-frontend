import React from 'react'
import {
    customerIcon,
    storeIcon
} from '../assets/images'

function UsersOverview() {
    return (
        <div className='w-[300px] h-full bg-white rounded-lg border p-4'>
            <h1 className='font-lato-bold text-sm'>No. of Users</h1>
            <div className='flex flex-col py-4 px-1 gap-4'>
                <div className='flex flex-1 flex-row'>
                    <div className='w-10 h-10 p-2 bg-[#8400ff]/10 rounded-lg'>
                        <img src={customerIcon} className='w-6 h-6' />
                    </div>
                    <div className='flex flex-col px-4'>
                        <p className='font-lato-bold text-xs'>Total Customers</p>
                        <p className='font-lato-bold'>10</p>
                    </div>
                </div>
                <div className='flex flex-1 flex-row'>
                    <div className='w-10 h-10 p-2 bg-[#6EBC25]/20 rounded-lg'>
                        <img src={storeIcon} className='w-6 h-6' />
                    </div>
                    <div className='flex flex-col px-4'>
                        <p className='font-lato-bold text-xs'>Total Stores</p>
                        <p className='font-lato-bold'>4</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersOverview