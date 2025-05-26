// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const { user, logout, token } = useAuth();

  // state pentru user email
  const [email, setEmail] = useState(user?.email || "");

  // state pentru statistici
  const [countToday, setCountToday] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // preluăm statistica zilei
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/images/today-count", {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        });
        setCountToday(data.countToday);
        setRemaining(data.remaining);
        setDailyLimit(data.dailyLimit);
      } catch {
        toast.error("Nu am putut încărca statistica zilei.");
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [token]);

  // trimitem noul email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/auth/profile/email",
        { email },
        {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Email actualizat cu succes!");
    } catch {
      toast.error("Nu am putut actualiza email-ul.");
    }
  };

  // upgrade fake de plan
  const handleUpgrade = () => {
    toast.info("Upgrade fake: acum eşti pe Plan Pro!");
  };

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-5 text-center">Profilul tău</h2>

        <div className="row g-4">
          {/* 1. Datele contului */}
          <div className="col-md-4">
            <div className="card profile-card h-100">
              <div className="card-header">Date cont</div>
              <div className="card-body d-flex flex-column">
                <p>
                  <strong>Username:</strong> {user?.username}
                </p>
                <form onSubmit={handleEmailSubmit} className="mt-3">
                  <label htmlFor="email" className="form-label">
                    Email curent
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary mt-auto"
                  >
                    Modifica Email
                  </button>
                </form>
                <button onClick={logout} className="btn btn-sm btn-danger mt-3">
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* 2. Statistici utilizare */}
          <div className="col-md-4">
            <div className="card profile-card h-100">
              <div className="card-header">Statistici utilizare</div>
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                {loadingStats ? (
                  <p>Se încarcă…</p>
                ) : (
                  <>
                    <h1 className="display-5 mb-2">
                      {countToday} / {dailyLimit}
                    </h1>
                    <p>imagini generate astăzi</p>
                    <p>
                      Mai rămân: <strong>{remaining}</strong>
                    </p>
                    <div className="progress w-100">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(countToday / dailyLimit) * 100}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. Plan tarifar */}
          <div className="col-md-4">
            <div className="card profile-card h-100">
              <div className="card-header">Plan tarifar</div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <p className="mb-2">
                    În prezent eşti pe: <strong>Free</strong>
                  </p>
                  <ul className="list-unstyled mb-0">
                    <li>– {dailyLimit} imagini/zi</li>
                    <li>– Acces de bază la API</li>
                  </ul>
                </div>
                <button
                  onClick={handleUpgrade}
                  className="btn btn-sm btn-outline-success mt-auto"
                >
                  Treci pe Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
