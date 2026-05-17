import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPreferences } from "../services/preference.service.js";
import { registerUser } from "../services/auth.service.js";

const STORAGE_KEY = "smartmatch.registerDraft";

const styleOptions = [
  { value: "conservative", label: "Conservative" },
  { value: "modern", label: "Modern" },
  { value: "open", label: "Open" },
  { value: "classic", label: "Classic" },
];

const ethnicityOptions = [
  { value: "ashkenazi", label: "Ashkenazi" },
  { value: "sephardic", label: "Sephardic" },
  { value: "yemenite", label: "Yemenite" },
  { value: "other", label: "Other" },
];

const appearanceOptions = [
  { value: "slim", label: "Slim" },
  { value: "average", label: "Average" },
  { value: "full", label: "Full" },
  { value: "chubby", label: "Chubby" },
];

export default function PreferencesPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      ageMin: "",
      ageMax: "",
      heightMin: "",
      heightMax: "",
      style: "",
      ethnicity: "",
      appearance: "",
    },
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (!savedDraft) {
      navigate("/register");
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft);
      if (!parsed || !parsed.name || !parsed.idNumber || !parsed.password) {
        navigate("/register");
        return;
      }
    } catch (err) {
      console.error("Invalid registration draft", err);
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    const subscription = watch(() => {
      if (apiError) {
        setApiError("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, apiError]);

  const buildPreferencePayload = (values) => {
    const payload = {};

    ["ageMin", "ageMax", "heightMin", "heightMax"].forEach((key) => {
      const value = values[key];
      if (value !== undefined && value !== null && value !== "") {
        const parsed = Number(value);
        if (!Number.isNaN(parsed)) {
          payload[key] = parsed;
        }
      }
    });

    ["style", "ethnicity", "appearance"].forEach((key) => {
      if (values[key]) {
        payload[key] = values[key];
      }
    });

    return payload;
  };

  const onSubmit = async (values) => {
    setApiError("");
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (!savedDraft) {
      setApiError("Registration data is missing. Please complete the register step first.");
      return;
    }

    let registrationData;
    try {
      registrationData = JSON.parse(savedDraft);
    } catch (err) {
      console.error("Failed to parse registration draft", err);
      setApiError("Saved registration data is corrupted. Please re-enter your registration details.");
      return;
    }

    const registerPayload = {
      name: registrationData.name,
      idNumber: registrationData.idNumber,
      email: registrationData.email,
      password: registrationData.password,
    };

    const preferencePayload = buildPreferencePayload(values);

    console.log("Saved draft raw:", savedDraft);
    console.log("Registration draft from localStorage:", registrationData);
    console.log("Register payload before request:", registerPayload);
    console.log("Preference payload before createPreferences:", preferencePayload);

    setIsSubmitting(true);
    try {
      const registerResponse = await registerUser(registerPayload);
      const token = registerResponse?.token;
      if (!token) {
        throw new Error("Registration did not return an authentication token");
      }

      await createPreferences(preferencePayload, token);
      localStorage.removeItem(STORAGE_KEY);
      navigate("/login");
    } catch (err) {
      console.error("Submit error:", err);
      const message = err?.response?.data?.message || err.message || "Unable to save preferences";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: 24 }}>
      <h1>Preferences</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="ageMin">Minimum age</label>
        <input id="ageMin" type="number" {...register("ageMin")} />

        <label htmlFor="ageMax">Maximum age</label>
        <input id="ageMax" type="number" {...register("ageMax")} />

        <label htmlFor="heightMin">Minimum height</label>
        <input id="heightMin" type="number" {...register("heightMin")} />

        <label htmlFor="heightMax">Maximum height</label>
        <input id="heightMax" type="number" {...register("heightMax")} />

        <label htmlFor="style">Style</label>
        <select id="style" {...register("style")}> 
          <option value="">Select style</option>
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="ethnicity">Ethnicity</label>
        <select id="ethnicity" {...register("ethnicity")}> 
          <option value="">Select ethnicity</option>
          {ethnicityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="appearance">Appearance</label>
        <select id="appearance" {...register("appearance")}> 
          <option value="">Select appearance</option>
          {appearanceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
        <button type="submit" disabled={isSubmitting} style={{ marginTop: 20 }}>
          {isSubmitting ? "Submitting..." : "Submit Preferences"}
        </button>
      </form>
    </main>
  );
}
