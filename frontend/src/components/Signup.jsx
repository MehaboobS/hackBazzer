import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {Input,Button}from "./index"
import {useDispatch} from 'react-redux'
import axios from "axios";
import {useForm} from 'react-hook-form'

export default  function SignupForm() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    // const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const create = async(data) => {
        setError("")
        console.log(data)
        try {
            const userData = await axios.post('/api/user/signup',{data})
            // if (userData) {
            //     const userData = await authService.getCurrentUser()
            //     if(userData) dispatch(login(userData));
            //     navigate("/")
            // }
            console.log(userData);
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className="flex items-center justify-center">
    <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
    <div className="mb-2 flex justify-center">
           
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
        <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
            <Link
                to={"/login"}
                className="font-medium text-primary transition-all duration-200 hover:underline"
            >
                Sign In
            </Link>
        </p>
       

        <form onSubmit={handleSubmit(create)}>
            <div className='space-y-5'>
                <Input
                label="Full Name: "
                placeholder="Enter your full name"
                {...register("name", {
                    required: true,
                })}
                />
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,})}
                />
                <Button type="submit" className="w-full h-10">
                    Create Account
                </Button>
            </div>
        </form>
    </div>

</div>
  )
}
