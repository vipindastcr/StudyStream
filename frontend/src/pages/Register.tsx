import React, { useState } from "react";

import Hero from "@/assets/images/register_image.jpg";
import Logo from "@/assets/logos/studystream logo white 2X.png";

import { Eye, EyeOff } from "lucide-react";


export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submit..............:------", form);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#49BBBD]">
      {/* Logo Section */}
      <div className="flex items-center mb-0.5rem ">
        <img
            src={Logo}
            alt=""
            className="mt-20 mb-[0.1rem] w-40 mr-2 pt-4"
            />
        {/* <Logo className="w-10 h-10 mr-2 fill-white" /> */}
        {/* <h1 className="text-black text-2xl font-semibold">studyS</h1> */}
      </div>

      {/* Main Container */}
      <div className="w-[95%] max-w-6xl bg-white flex flex-col md:flex-row rounded-2xl shadow-lg overflow-hidden scale-55 md:scale-70 transition-transform font-inter">
        {/* Left image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={Hero}
            alt="hero"
            className="w-full h-full object-cover"
            style={{ minHeight: 520 }}
          />
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-[380px] mx-auto w-full">
            <h2 className="text-center text-xl font-semibold text-slate-700">
              User Register
            </h2>
            <p className="text-center text-sm text-slate-400 mt-1 mb-6">
              Already have an account?{" "}
              <a className="text-tealbrand font-medium" href="#">
                Login
              </a>
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs text-slate-500">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="Enter your first name"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs text-slate-500">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Enter your last name"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs text-slate-500">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email id"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs text-slate-500">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Enter your phone no"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 relative">
                <label className="text-xs text-slate-500">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="Enter your Password"
                    className="w-full rounded-full border border-[#49BBBD] py-3 px-4 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    aria-label="toggle password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 relative">
                <label className="text-xs text-slate-500">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    placeholder="Confirm Password"
                    className="w-full rounded-full border border-[#49BBBD] py-3 px-4 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    aria-label="toggle confirm password"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm mt-1">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={form.role === "user"}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, role: "user" }))
                    }
                    className="form-radio"
                  />
                  <span className="text-slate-500">user</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="tutor"
                    checked={form.role === "tutor"}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, role: "tutor" }))
                    }
                    className="form-radio"
                  />
                  <span className="text-slate-500">tutor</span>
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <button
                  type="button"
                  className="flex-1 border border-gray-300 rounded-full py-2 px-4 text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50"

                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="google"
                    className="w-5 h-5"
                  />
                  <span className="text-sm">Sign in with Google</span>
                </button>

                <button
                  type="submit"
                  className="bg-[#49BBBD] text-white rounded-full py-2 px-6 text-sm shadow hover:brightness-95"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
