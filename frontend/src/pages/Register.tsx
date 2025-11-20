import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const passwordValue = watch("password");

  // ------------------ SUBMIT ------------------ //
  const onSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          reset();
        }, 3000);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ------------- SUCCESS SCREEN ------------- //
  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>
            <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: '#16a34a' }} />
          </div>
          <h2 style={styles.successTitle}>Welcome Aboard!</h2>
          <p style={styles.successText}>
            Your account has been created successfully. Check your email to verify your account.
          </p>
        </div>
      </div>
    );
  }

  // ------------------ MAIN UI ------------------ //
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.logoWrapper}>
          <div style={styles.logoBox}>
            <img src="/images/icon white.png" alt="Logo" style={{ width: '1.75rem' }} />
          </div>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start your learning journey today</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Full Name */}
          <FormInput
            label="Full Name"
            Icon={User}
            error={errors.fullName?.message}
            placeholder="John Doe"
            register={register("fullName", {
              required: "Full name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" }
            })}
          />

          {/* Email */}
          <FormInput
            label="Email Address"
            Icon={Mail}
            placeholder="john@example.com"
            error={errors.email?.message}
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email"
              }
            })}
          />

          {/* Password */}
          <PasswordInput
            label="Password"
            show={showPassword}
            setShow={setShowPassword}
            error={errors.password?.message}
            register={register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              validate: value =>
                /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ||
                "Password must contain uppercase, lowercase, and number"
            })}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm Password"
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            error={errors.confirmPassword?.message}
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: value =>
                value === passwordValue || "Passwords do not match"
            })}
          />

          <button type="submit" style={styles.submitBtn}>
            Sign Up
          </button>

        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <a href="#" style={styles.link}>Sign In</a>
        </p>

      </div>
    </div>
  );
}

// ------------------ REUSABLE INPUT COMPONENT ------------------ //
function FormInput({ label, Icon, error, placeholder, register }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <Icon style={styles.leftIcon} />
        <input
          placeholder={placeholder}
          {...register}
          style={{
            ...styles.input,
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db'
          }}
        />
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// ------------------ PASSWORD INPUT COMPONENT ------------------ //
function PasswordInput({ label, show, setShow, error, register }: any) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <Lock style={styles.leftIcon} />

        <input
          type={show ? "text" : "password"}
          placeholder="••••••••"
          {...register}
          style={{
            ...styles.input,
            paddingRight: "3rem",
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db'
          }}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          style={styles.eyeBtn}
        >
          {show ? <EyeOff style={styles.eyeIcon} /> : <Eye style={styles.eyeIcon} />}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

// ------------------ STYLE OBJECTS ------------------ //
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem'
  },
  logoWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' },
  logoBox: {
    width: '3rem',
    height: '3rem',
    background: '#4f46e5',
    borderRadius: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1f2937' },
  subtitle: { textAlign: 'center', color: '#4b5563', marginBottom: '2rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151' },
  input: {
    width: '100%',
    padding: '0.75rem',
    paddingLeft: '2.75rem',
    borderRadius: '0.5rem',
    outline: 'none',
    fontSize: '1rem'
  },
  leftIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    width: '1.25rem'
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'none',
    cursor: 'pointer'
  },
  eyeIcon: { width: '1.25rem', height: '1.25rem', color: '#9ca3af' },
  error: { color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' },
  submitBtn: {
    width: '100%',
    background: '#4f46e5',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  footerText: { marginTop: '1.5rem', textAlign: 'center', color: '#4b5563' },
  link: { color: '#4f46e5', fontWeight: 600, textDecoration: 'none' },
  successBox: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  successIcon: {
    width: '4rem',
    height: '4rem',
    borderRadius: '9999px',
    background: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem'
  },
  successTitle: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' },
  successText: { color: '#4b5563' }
};
