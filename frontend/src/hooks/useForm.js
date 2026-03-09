import { useState } from "react";

/**
 * useForm — manages form state and client-side validation for registration forms.
 * Validates: username (min 6), fullName, email format, phone (10 digits),
 *            password (min 6), confirmPassword match, address, city.
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const set = (key) => (event) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const validate = () => {
    const errs = {};
    if (!values.username || values.username.length < 6)
      errs.username = "Username must be at least 6 characters";
    if (!values.fullName)
      errs.fullName = "Full name is required";
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      errs.email = "Please enter a valid email address";
    if (!values.phone || !/^\d{10}$/.test(values.phone))
      errs.phone = "Phone number must be exactly 10 digits";
    if (!values.password || values.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (values.password !== values.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!values.address)
      errs.address = "Address is required";
    if (!values.city)
      errs.city = "City is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, set, errors, validate, reset };
}
