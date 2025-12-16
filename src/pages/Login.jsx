import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            login(response.data);
            toast.success("Login successful!");

            if (response.data.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-200 min-h-screen flex box-border justify-center items-center">
            <div className="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
                {/* LEFT */}
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
                    <p className="text-sm mt-4 text-[#002D74]">
                        If you already a member, easily log in now.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            className="p-2 mt-8 rounded-xl border"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="relative">
                            <input
                                className="p-2 rounded-xl border w-full"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            {!showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="gray"
                                    className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
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
                                    className="bi bi-eye-slash-fill absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowPassword(false)}
                                >
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588z" />
                                    <path d="M5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                    <path d="m1.354 1.646 13 13-.708.708-13-13 .708-.708z" />
                                </svg>
                            )}
                        </div>

                        <button
                            className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* DEMO CREDENTIALS */}
                    <div className="mt-6 p-4 bg-white/70 rounded-lg">
                        <p className="text-xs text-gray-700 text-center mb-2">
                            Demo Credentials
                        </p>
                        <p className="text-xs text-gray-700">
                            Admin: admin@example.com / admin123
                        </p>
                        <p className="text-xs text-gray-700">
                            User: user@example.com / user123
                        </p>
                    </div>

                    {/*<div className="mt-10 text-sm border-b border-gray-500 py-5">*/}
                    {/*    Forget password?*/}
                    {/*</div>*/}

                    <div className="mt-4 text-sm flex justify-between items-center container-mr">
                        <p className="mr-3 md:mr-0">If you don't have an account..</p>
                        <Link
                            to="/signup"
                            className="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="md:block hidden w-1/2">
                    <img
                        className="rounded-2xl max-h-[1600px]"
                        // src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38"
                        src="/loginpic2.png"
                        alt="login form"
                    />
                </div>
            </div>
        </section>
    );
};

export default Login;
