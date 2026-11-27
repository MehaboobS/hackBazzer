import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "./index";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function SignupForm() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const create = async (data) => {
        setError("");
        try {
            const response = await axios.post("/api/user/signup", data);
            if (response.data?.user) {
                dispatch(authLogin(response.data.user));
            }
            toast.success(
                response.data?.message ||
                    "Account created successfully! Welcome to HackBazzer!"
            );
            navigate("/");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to create account";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-10">
            <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
                <div className="mb-2 flex justify-center"></div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/user/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {error && (
                    <p className="mt-4 rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(create)} className="mt-6">
                    <div className="space-y-5">
                        <div>
                            <Input
                                label="Username: "
                                placeholder="Enter a unique username"
                                {...register("name", {
                                    required: "Username is required",
                                })}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Email: "
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPattern: (value) =>
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                                value
                                            ) ||
                                            "Email address must be a valid address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Password: "
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 disabled:opacity-60"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
