import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const token = res.data.token;

      if (!token || typeof token !== "string") {
        throw new Error(
          "Token-ul primit nu este un string valid: " + JSON.stringify(token)
        );
      }

      login(token);
      toast.success("Autentificare reușită!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Autentificare eșuată";
      toast.error(errorMessage, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div className="login-wrapper d-flex justify-content-center align-items-center">
        <form
          className="login-form shadow-lg p-4 rounded-3 animated-form"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center mb-4">Autentificare</h2>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label">
              Username sau E-mail
            </label>
            <input
              type="text"
              className="form-control"
              id="identifier"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="Ex: user123 sau user@example.com"
              required
              aria-label="Introduceți username-ul sau e-mailul"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Parolă
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              aria-label="Introduceți parola"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3 animated-btn"
          >
            Intră în cont
          </button>
          <div className="text-center">
            <p className="mb-0">
              Nu ai cont?{" "}
              <a
                href="/register"
                className="text-primary fw-semibold text-decoration-underline"
                aria-label="Creează un cont nou"
              >
                Creează unul acum
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
