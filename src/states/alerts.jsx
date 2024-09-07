import { createSlice } from "@reduxjs/toolkit";

const type = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SUCCESS: 'success'
}

const initialStateValue = {
    show: false,
    type: type['INFO'],
    message: '',
    duration: 3000
};

export const alertSlice = createSlice({
    name: "alert",
    initialState: { value: initialStateValue },
    reducers: {
        show: (state, action) => {
            state.value = action.payload;
        },

        hide: (state) => {
            state.value = initialStateValue;
        },
    },
});

export const { show, hide } = alertSlice.actions;

export default alertSlice.reducer;




