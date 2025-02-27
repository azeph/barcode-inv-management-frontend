import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
    _id: "",
    authId: "",
    firstName: "",
    lastName: "",
    email: "",
    userType: null,
    phoneNumber: "",
    imageUrl: ""
};

export const userSlice = createSlice({
    name: "user",
    initialState: { value: initialStateValue },
    reducers: {
        login: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.value = action.payload;
        },

        logout: (state) => {
            state.value = initialStateValue;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;