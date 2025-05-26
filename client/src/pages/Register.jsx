import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [touched, setTouched] = useState({ password: false });
  const [valid, setValid] = useState({ password: false });
  const [backendErrors, setBackendErrors] = useState([]);

  // pentru toggle „ochi”
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((v) => !v);

  // același regex ca pe backend Joi
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setTouched((t) => ({ ...t, password: true }));
      setValid((v) => ({ ...v, password: passwordRegex.test(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors([]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      login(res.data.token);
      toast.success("Cont creat cu succes!", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } catch (err) {
      // dacă Joi returnează { errors: [...] }
      if (err.response?.data?.errors) {
        setBackendErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.error || "Eroare la înregistrare", {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="register-wrapper d-flex justify-content-center align-items-center">
      <form
        className="register-form shadow-lg p-4 rounded-3"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-center mb-4">Înregistrare</h2>

        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            placeholder="Ex: user123"
            required
            aria-label="Introduceți username-ul"
          />
        </div>

        {/* E-mail */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="Ex: user@example.com"
            required
            aria-label="Introduceți e-mail-ul"
          />
        </div>

        {/* Parolă cu eye + validare */}
        <div className="mb-4 position-relative">
          <label htmlFor="password" className="form-label">
            Parolă
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className={
              "form-control pe-6 " +
              (touched.password
                ? valid.password
                  ? "is-valid"
                  : "is-invalid"
                : "")
            }
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}"
            required
            aria-describedby="passwordHelp"
          />

          {/* eye icon */}
          <span
            onClick={toggleShowPassword}
            style={{
              position: "absolute",
              top: "40px",
              right: "2.3rem",
              cursor: "pointer",
              color: "#6c757d",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          <div id="passwordHelp" className="form-text">
            Minim 8 caractere, cu literă mare, literă mică, cifră și simbol.
          </div>
          <div className="invalid-feedback">
            Parola nu îndeplinește criteriile de mai sus.
          </div>
        </div>

        {/* erori Joi de pe backend */}
        {backendErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {backendErrors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={!valid.password}
        >
          Creează cont
        </button>

        <div className="text-center">
          <p className="mb-0">
            Ai deja cont?{" "}
            <a href="/login" className="text-primary">
              Intră în cont
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
