import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    userType: null,
    phoneNumber: "",
    imageUrl: ""
};

export const customerSlice = createSlice({
    name: "customer",
    initialState: { value: initialStateValue },
    reducers: {
        customerLogin: (state, action) => {
            localStorage.setItem("customer", JSON.stringify(action.payload));
            state.value = action.payload;
        },

        logout: (state) => {
            localStorage.removeItem("customer");
            state.value = initialStateValue;
        },
    },
});

export const { customerLogin, logout } = customerSlice.actions;

export default customerSlice.reducer;