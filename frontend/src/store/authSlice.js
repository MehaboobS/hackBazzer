import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    // mention the inital state
    initialState,
    // object of functions
    reducers: {
        // slices
        login: (state, action) => {
            state.status = true;
            console.log(action.payload)
            state.userData = action.payload;
            console.log(state.userData)
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;