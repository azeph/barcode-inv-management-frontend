import React from 'react'
import { CircularProgress } from '@mui/material';

function Loader(props) {
    return (
        <div className='h-screen w-full flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
                <CircularProgress color='inherit' className='text-[#ffc100]' />
                <h1 className='font-lato-bold text-base text-[#1F2F3D]'>{props.message}</h1>
            </div>
        </div>
    )
}

export default Loader