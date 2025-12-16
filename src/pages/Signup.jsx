import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            const response = await authAPI.signup(signupData);
            login(response.data);
            toast.success("Account created successfully!");
            navigate("/user/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-200 min-h-screen flex box-border justify-center items-center">

        <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
                {/* LEFT */}
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-[#002D74]">Register</h2>
                    <p className="text-sm mt-4 text-[#002D74]">
                        Create your account to start planning events.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            className="p-2 mt-6 rounded-xl border"
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="p-2 rounded-xl border"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* PASSWORD */}
                        <div className="relative">
                            <input
                                className="p-2 rounded-xl border w-full"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />

                            {!showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="gray"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowPassword(true)}
                                >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowPassword(false)}
                                >
                                    <path d="m1.354 1.646 13 13-.708.708-13-13 .708-.708z" />
                                    <path d="M10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474L.938 6.278 0 8s3 5.5 8 5.5z" />
                                </svg>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="relative">
                            <input
                                className="p-2 rounded-xl border w-full"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />

                            {!showConfirmPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="gray"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowConfirmPassword(true)}
                                >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowConfirmPassword(false)}
                                >
                                    <path d="m1.354 1.646 13 13-.708.708-13-13 .708-.708z" />
                                </svg>
                            )}
                        </div>

                        <button
                            className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-[#002D74] text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold underline">
                            Login
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="md:block hidden w-1/2">
                    <img
                        className="rounded-2xl max-h-[1600px]"
                        src="/loginpic2.png"
                        alt="signup illustration"
                    />
                </div>
            </div>
        </section>
    );
};

export default Signup;
