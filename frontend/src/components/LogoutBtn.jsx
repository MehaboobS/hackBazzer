import React from "react";
import { useState,useEffect } from 'react'
// import authService from "../../appwrite/auth";
import {logout} from '../store/authSlice'
import { useDispatch } from "react-redux";
import axios from "axios";
export default function LogoutBtn({authValueState,setAuthValueState}){
    const dispatch=useDispatch()
   const handleClick=async()=>{
        // authService.logout().then(()=>{
        //     dispatch(logout())
        // })
       try{
        const response=await axios.get('/api/user/lg');
        if(response){
            dispatch(logout());
            setAuthValueState(!authValueState);
            alert(response.data.message)
        }
       }catch(err){
        console.log(err)
       }

   }
    return(
        <>
            <button
                onClick={handleClick}
                className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                Log out
            </button>
        </>
    )
}