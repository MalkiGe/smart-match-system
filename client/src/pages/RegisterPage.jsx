import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

const STORAGE_KEY = "smartmatch.registerDraft";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      idNumber: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        reset(JSON.parse(savedDraft));
      } catch (err) {
        console.error("Failed to parse registration draft", err);
      }
    }

    if (location.state?.serverError) {
      setServerError(location.state.serverError);
    }
  }, [reset, location.state]);

  useEffect(() => {
    const subscription = watch(() => {
      if (serverError) {
        setServerError("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, serverError]);

  const onSubmit = (data) => {
    console.log("Register submit data:", data);
    setServerError("");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    navigate("/preferences");
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

        <label htmlFor="idNumber">ID Number</label>
        <input
          id="idNumber"
          type="text"
          {...register("idNumber", {
            required: "ID number is required",
            pattern: {
              value: /^\d{9}$/,
              message: "ID number must contain exactly 9 digits",
            },
          })}
        />
        {errors.idNumber && <p style={{ color: "red" }}>{errors.idNumber.message}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email must be a valid email address",
            },
          })}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 16,
              message: "Password must be no more than 16 characters",
            },
            pattern: {
              value: /[A-Za-z]/,
              message: "Password must include at least one English letter",
            },
          })}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}

        <button type="submit" style={{ marginTop: 20 }}>
          Save Data
        </button>
      </form>
    </main>
  );
}
