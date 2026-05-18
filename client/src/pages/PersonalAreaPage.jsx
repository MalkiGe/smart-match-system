import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { getMyProfile, updateProfile } from "../services/profile.service.js";
import { getMyPreferences, updatePreferences } from "../services/preference.service.js";

export default function PersonalAreaPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [preferencesSuccess, setPreferencesSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [preferencesSubmitting, setPreferencesSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const genderOptions = [
    { value: "male", label: "זכר" },
    { value: "female", label: "נקבה" },
  ];

  const ethnicityOptions = [
    { value: "ashkenazi", label: "אשכנזי" },
    { value: "sephardic", label: "ספרדי" },
    { value: "yemenite", label: "תימני" },
    { value: "other", label: "אחר" },
  ];

  const styleOptions = [
    { value: "conservative", label: "שמור" },
    { value: "classic", label: "קלאסי" },
    { value: "open", label: "פתוח" },
  ];

  const appearanceOptions = [
    { value: "slim", label: "רזה" },
    { value: "classic", label: "קלאסי" },
    { value: "full", label: "מלא" },
    { value: "chubby", label: "שמן" },
  ];

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      gender: "",
      ethnicity: "",
      age: "",
      city: "",
      height: "",
      style: "",
      appearance: "",
      financialRequirement: "",
      description: "",
    },
  });

  const {
    control: preferencesControl,
    handleSubmit: handlePreferencesSubmit,
    reset: resetPreferences,
    formState: { errors: preferencesErrors },
  } = useForm({
    defaultValues: {
      ageMin: "",
      ageMax: "",
      city: "",
      heightMin: "",
      heightMax: "",
      style: "",
      preferredAppearance: "",
      financialMin: "",
      financialMax: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setLoadingError("נדרש אימות כדי לטעון נתונים");
      setLoadingData(false);
      return;
    }

    const loadData = async () => {
      setLoadingError("");
      setLoadingData(true);

      try {
        const [profileResult, preferencesResult] = await Promise.allSettled([
          getMyProfile(token),
          getMyPreferences(token),
        ]);

        if (profileResult.status === "fulfilled") {
          const profileResponse = profileResult.value;
          const profile = profileResponse?.profile ?? profileResponse;
          resetProfile({
            gender: profile?.gender ?? "",
            ethnicity: profile?.ethnicity ?? "",
            age: profile?.age?.toString() ?? "",
            city: profile?.city ?? "",
            height: profile?.height?.toString() ?? "",
            style: profile?.style ?? "",
            appearance: profile?.appearance ?? "",
            financialRequirement: profile?.financialRequirement?.toString() ?? "",
            description: profile?.description ?? "",
          });
        }

        if (preferencesResult.status === "fulfilled") {
          const preferencesResponse = preferencesResult.value;
          const preferences = preferencesResponse?.preferences ?? preferencesResponse;
          resetPreferences({
            ageMin: preferences?.ageMin?.toString() ?? "",
            ageMax: preferences?.ageMax?.toString() ?? "",
            city: preferences?.city ?? "",
            heightMin: preferences?.heightMin?.toString() ?? "",
            heightMax: preferences?.heightMax?.toString() ?? "",
            style: preferences?.style ?? "",
            preferredAppearance: preferences?.preferredAppearance ?? "",
            financialMin: preferences?.financialMin?.toString() ?? "",
            financialMax: preferences?.financialMax?.toString() ?? "",
          });
        }

        if (profileResult.status === "rejected" || preferencesResult.status === "rejected") {
          const rejected = [profileResult, preferencesResult].find((item) => item.status === "rejected");
          const errorMessage = rejected?.reason?.response?.data?.message || rejected?.reason?.message;
          setLoadingError(errorMessage || "לא ניתן לטעון את הנתונים האישיים");
        }
      } catch (error) {
        setLoadingError(error?.response?.data?.message || error?.message || "אירעה שגיאה בטעינת הנתונים");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [token, resetProfile, resetPreferences]);

  const onUpdateProfile = async (data) => {
    setApiError("");
    setProfileSuccess("");
    setProfileSubmitting(true);

    if (!token) {
      setApiError("נדרש אימות לעדכון הפרופיל");
      setProfileSubmitting(false);
      return;
    }

    const payload = {
      gender: data.gender || undefined,
      ethnicity: data.ethnicity || undefined,
      age: data.age === "" ? undefined : Number(data.age),
      city: data.city || undefined,
      height: data.height === "" ? undefined : Number(data.height),
      style: data.style || undefined,
      appearance: data.appearance || undefined,
      financialRequirement: data.financialRequirement === "" ? undefined : Number(data.financialRequirement),
      description: data.description || undefined,
    };

    try {
      const response = await updateProfile(payload, token);
      const updatedProfile = response?.profile ?? response;
      setProfileSuccess("הפרופיל עודכן בהצלחה");
        setSuccessOpen(true);
      resetProfile({
        gender: updatedProfile?.gender ?? "",
        ethnicity: updatedProfile?.ethnicity ?? "",
        age: updatedProfile?.age?.toString() ?? "",
        city: updatedProfile?.city ?? "",
        height: updatedProfile?.height?.toString() ?? "",
        style: updatedProfile?.style ?? "",
        appearance: updatedProfile?.appearance ?? "",
        financialRequirement: updatedProfile?.financialRequirement?.toString() ?? "",
        description: updatedProfile?.description ?? "",
      });
        // Close the edit section only after successful update
        setIsEditingProfile(false);
    } catch (error) {
      setApiError(error?.response?.data?.message || error?.message || "שגיאה בעדכון הפרופיל");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const onUpdatePreferences = async (data) => {
    setApiError("");
    setPreferencesSuccess("");
    setPreferencesSubmitting(true);

    if (!token) {
      setApiError("נדרש אימות לעדכון ההעדפות");
      setPreferencesSubmitting(false);
      return;
    }

    const payload = {
      ageMin: data.ageMin === "" ? undefined : Number(data.ageMin),
      ageMax: data.ageMax === "" ? undefined : Number(data.ageMax),
      city: data.city || undefined,
      heightMin: data.heightMin === "" ? undefined : Number(data.heightMin),
      heightMax: data.heightMax === "" ? undefined : Number(data.heightMax),
      style: data.style || undefined,
      preferredAppearance: data.preferredAppearance || undefined,
      financialMin: data.financialMin === "" ? undefined : Number(data.financialMin),
      financialMax: data.financialMax === "" ? undefined : Number(data.financialMax),
    };

    try {
      const response = await updatePreferences(payload, token);
      const updatedPreferences = response?.preferences ?? response;
      setPreferencesSuccess("העדפות עודכנו בהצלחה");
        setSuccessOpen(true);
      resetPreferences({
        ageMin: updatedPreferences?.ageMin?.toString() ?? "",
        ageMax: updatedPreferences?.ageMax?.toString() ?? "",
        city: updatedPreferences?.city ?? "",
        heightMin: updatedPreferences?.heightMin?.toString() ?? "",
        heightMax: updatedPreferences?.heightMax?.toString() ?? "",
        style: updatedPreferences?.style ?? "",
        preferredAppearance: updatedPreferences?.preferredAppearance ?? "",
        financialMin: updatedPreferences?.financialMin?.toString() ?? "",
        financialMax: updatedPreferences?.financialMax?.toString() ?? "",
      });
        // Close the edit section only after successful update
        setIsEditingPreferences(false);
    } catch (error) {
      setApiError(error?.response?.data?.message || error?.message || "שגיאה בעדכון ההעדפות");
    } finally {
      setPreferencesSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        האזור האישי
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setIsEditingProfile((prev) => !prev)}>
          עדכון פרופיל
        </Button>
        <Button variant="contained" color="primary" onClick={() => setIsEditingPreferences((prev) => !prev)}>
          עדכון העדפות
        </Button>
      </Box>

      {loadingData ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {loadingError && (
            <Typography color="error.main" sx={{ mb: 2 }}>
              {loadingError}
            </Typography>
          )}

          {apiError && (
            <Typography color="error.main" sx={{ mb: 2 }}>
              {apiError}
            </Typography>
          )}

              {/* success notifications are shown via Snackbar */}

          {isEditingProfile && (
            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
              <Typography variant="h5" gutterBottom>
                עדכון פרופיל
              </Typography>
              <Box component="form" onSubmit={handleProfileSubmit(onUpdateProfile)} noValidate sx={{ display: "grid", gap: 2 }}>
                <Controller
                  name="gender"
                  control={profileControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="personal-gender-label">מגדר</InputLabel>
                      <Select labelId="personal-gender-label" label="מגדר" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {genderOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="ethnicity"
                  control={profileControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="personal-ethnicity-label">עדה</InputLabel>
                      <Select labelId="personal-ethnicity-label" label="עדה" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {ethnicityOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="age"
                  control={profileControl}
                  render={({ field }) => <TextField {...field} label="גיל" type="number" fullWidth />}
                />

                <Controller
                  name="city"
                  control={profileControl}
                  render={({ field }) => <TextField {...field} label="עיר" fullWidth />}
                />

                <Controller
                  name="height"
                  control={profileControl}
                  render={({ field }) => <TextField {...field} label="גובה" type="number" fullWidth />}
                />

                <Controller
                  name="style"
                  control={profileControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="personal-style-label">סגנון</InputLabel>
                      <Select labelId="personal-style-label" label="סגנון" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {styleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="appearance"
                  control={profileControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="personal-appearance-label">מראה חיצוני</InputLabel>
                      <Select labelId="personal-appearance-label" label="מראה חיצוני" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {appearanceOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="financialRequirement"
                  control={profileControl}
                  render={({ field }) => <TextField {...field} label="מצב כלכלי" type="number" fullWidth />}
                />

                <Controller
                  name="description"
                  control={profileControl}
                  render={({ field }) => <TextField {...field} label="תיאור" multiline minRows={3} fullWidth />}
                />

                <Button variant="contained" color="primary" type="submit" disabled={profileSubmitting}>
                  {profileSubmitting ? "שולח..." : "שמור עדכון פרופיל"}
                </Button>
              </Box>
            </Paper>
          )}

          {isEditingPreferences && (
            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
              <Typography variant="h5" gutterBottom>
                עדכון העדפות
              </Typography>
              <Box component="form" onSubmit={handlePreferencesSubmit(onUpdatePreferences)} noValidate sx={{ display: "grid", gap: 2 }}>
                <Controller
                  name="ageMin"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="גיל מינימום" type="number" fullWidth />}
                />

                <Controller
                  name="ageMax"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="גיל מקסימום" type="number" fullWidth />}
                />

                <Controller
                  name="city"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="עיר" fullWidth />}
                />

                <Controller
                  name="heightMin"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="גובה מינימום" type="number" fullWidth />}
                />

                <Controller
                  name="heightMax"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="גובה מקסימום" type="number" fullWidth />}
                />

                <Controller
                  name="style"
                  control={preferencesControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="preferences-style-label">סגנון</InputLabel>
                      <Select labelId="preferences-style-label" label="סגנון" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {styleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="preferredAppearance"
                  control={preferencesControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="preferences-appearance-label">מראה חיצוני מועדף</InputLabel>
                      <Select labelId="preferences-appearance-label" label="מראה חיצוני מועדף" {...field}>
                        <MenuItem value="">לא נבחר</MenuItem>
                        {appearanceOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="financialMin"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="מצב כלכלי מינימום" type="number" fullWidth />}
                />

                <Controller
                  name="financialMax"
                  control={preferencesControl}
                  render={({ field }) => <TextField {...field} label="מצב כלכלי מקסימום" type="number" fullWidth />}
                />

                <Button variant="contained" color="primary" type="submit" disabled={preferencesSubmitting}>
                  {preferencesSubmitting ? "שולח..." : "שמור עדכון העדפות"}
                </Button>
              </Box>
            </Paper>
          )}
          <Snackbar
            open={successOpen}
            autoHideDuration={10000}
            onClose={() => setSuccessOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: "100%" }}>
              עודכן בהצלחה
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
}
