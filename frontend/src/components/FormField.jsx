import { useTheme, TK } from "../context/ThemeContext";

/**
 * FormField — reusable labeled input with error display.
 * Props: label, name, type, placeholder, form (from useForm hook), tk (optional override)
 */
export default function FormField({ label, name, type = "text", placeholder, form, tkOverride }) {
  const { dark } = useTheme();
  const tk = tkOverride || TK(dark);
  const hasError = !!form.errors[name];

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontWeight: 700,
          fontSize: 12,
          color: tk.textMid,
          marginBottom: 5,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        value={form.values[name]}
        onChange={form.set(name)}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          border: `1.5px solid ${hasError ? "#e74c3c" : tk.border}`,
          background: hasError ? "#fff0f0" : tk.bgInput,
          color: tk.text,
          fontSize: 14,
          boxSizing: "border-box",
          outline: "none",
          fontFamily: "inherit",
          transition: "border-color 0.2s",
        }}
      />
      {hasError && (
        <div
          style={{
            color: "#e74c3c",
            fontSize: 11,
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          ⚠ {form.errors[name]}
        </div>
      )}
    </div>
  );
}
