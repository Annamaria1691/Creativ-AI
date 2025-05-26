import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="home-container">
        <div className="left-side">
          <div className="text-box">
            <h1>Creativ AI</h1>

            <p>
              Bine ai venit în universul în care ideile tale prind viață! <br />
              <strong>Creativ AI</strong> este platforma ta de creație vizuală
              asistată de inteligență artificială — un spațiu unde inspirația
              întâlnește tehnologia.
            </p>

            <p>
              <strong>Ce îți oferim:</strong>
            </p>
            <ul>
              <li>Generare instantă de imagini pe baza textului tău</li>
              <li>Galerie personală cu toate creațiile tale</li>
              <li>Interfață intuitivă, prietenoasă și rapidă</li>
              <li>Inspirație nelimitată pentru orice proiect vizual</li>
            </ul>

            <p>
              <strong>Începe acum!</strong>
              <br />
              Creează-ți un cont gratuit și lasă-ți imaginația să zboare libera
              cu ajutorul AI-ului.
            </p>

            <div className="d-flex justify-content-center gap-3">
              <Link
                to="/login"
                className="btn btn-outline-light"
                aria-label="Autentificare"
              >
                Autentificare
              </Link>
              <Link
                to="/register"
                className="btn btn-outline-light"
                aria-label="Creare cont"
              >
                Creare cont
              </Link>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="image-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <img
                key={n}
                src={`/assets/sample${n}.jpg`}
                alt={`Sample${n}`}
                loading="lazy"
                style={{ animationDelay: `${n * 0.5}s` }}
                className="animated-img"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
