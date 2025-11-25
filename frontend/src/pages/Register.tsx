// src/pages/Register.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Hero from "@/assets/images/register_image.jpg";
import Logo from "@/assets/logos/studystream logo white 2X.png";
import { Eye, EyeOff } from "lucide-react";
import { registerUser, verifyOtp } from "@/services/authService";

// Zod schema
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(7, "Phone number is too short"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["user", "tutor"]),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [otpContext, setOtpContext] = useState<{ pendingId: string; email: string } | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  async function onSubmit(data: RegisterFormData) {
    setApiError(null);
    setApiSuccess(null);
    setOtpSuccess(null);

    try {
      const res = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      });

      console.log("Registered user:", res);
      // After registration, show OTP section and success hint
      setApiSuccess("Registration successful! Check your email for the OTP.");
      setOtpContext({ pendingId: res.pendingId, email: res.email });
      setOtpError(null);
      setOtpValue("");
      reset({ role: "user" } as RegisterFormData);
    } catch (err: any) {
      console.error("Register error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setApiError(message);
      setOtpContext(null);
      setOtpValue("");
      setOtpError(null);
    }
  }

  async function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!otpContext) return;

    setOtpError(null);
    setOtpSuccess(null);
    setIsVerifyingOtp(true);

    try {
      const response = await verifyOtp({ pendingId: otpContext.pendingId, otp: otpValue });
      setOtpSuccess(response.message || "Email verified successfully!");
      // Show green success toast and proceed to Login
      toast.success('Email verified. You can now log in.', {
        style: { background: '#16a34a', color: 'white' }
      });
      setOtpContext(null);
      setOtpValue("");
      navigate('/login');
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid or expired OTP. Please try again.";
      setOtpError(message);
    } finally {
      setIsVerifyingOtp(false);
    }
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

            {/* Global messages */}
            {apiError && (
              <p className="text-red-500 text-xs mb-2 text-center">{apiError}</p>
            )}
            {apiSuccess && (
              <p className="text-green-600 text-xs mb-2 text-center">
                {apiSuccess}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* First name */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-xs text-slate-500">First name</label>
                <input
                  {...register("firstName")}
                  placeholder="Enter your first name"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last name */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-xs text-slate-500">Last name</label>
                <input
                  {...register("lastName")}
                  placeholder="Enter your last name"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-xs text-slate-500">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter your email id"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 gap-1">
                <label className="text-xs text-slate-500">Phone number</label>
                <input
                  {...register("phone")}
                  placeholder="Enter your phone no"
                  className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 gap-1 relative">
                <label className="text-xs text-slate-500">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
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
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="grid grid-cols-1 gap-1 relative">
                <label className="text-xs text-slate-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="flex items-center gap-6 text-sm mt-1">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="user"
                    {...register("role")}
                    defaultChecked
                    className="form-radio"
                  />
                  <span className="text-slate-500">user</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="tutor"
                    {...register("role")}
                    className="form-radio"
                  />
                  <span className="text-slate-500">tutor</span>
                </label>
              </div>

              {/* Submit + Google button */}
              <div className="flex items-center justify-between gap-4 mt-4">

                {/* Google Sign-in */}
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

                {/* Register */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#49BBBD] text-white rounded-full py-2 px-6 text-sm shadow hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>

              </div>

            </form>

            {otpContext && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500 text-center mb-3">
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-medium text-slate-700">{otpContext.email}</span>
                </p>

                {otpError && (
                  <p className="text-red-500 text-xs mb-2 text-center">{otpError}</p>
                )}

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-3">
                  <input
                    value={otpValue}
                    onChange={(event) =>
                      setOtpValue(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter OTP"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-full border border-[#49BBBD] py-3 px-4 text-center tracking-[0.4em] text-lg placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#49BBBD]"
                  />

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpValue.length !== 6}
                    className="bg-[#2b8789] text-white rounded-full py-2 px-6 text-sm shadow hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              </div>
            )}

            {otpSuccess && (
              <p className="text-green-600 text-xs mt-4 text-center">{otpSuccess}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
