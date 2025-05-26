import Layout from "../components/Layout";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-5">Bine ai venit pe CreativAI!</h1>
        <p className="lead text-center mb-4 border rounded p-4 description">
          În această secțiune poți verifica instant planul curent (Free sau Pro)
          și data când se reînnoiește abonamentul. De aici poți face upgrade la
          Planul Pro pentru acces nelimitat, poți gestiona setările contului și
          găsi rapid link-urile către Galerie, Generare AI și Profilul tău.
          Toate opțiunile sunt la un click distanță!
        </p>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card plan-card text-center h-100">
              <div className="card-header bg-light">
                <h5 className="mb-0">Plan Gratuit</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <ul className="list-unstyled mb-4">
                  <li>✓ Acces la galerie</li>
                  <li>✓ Descarcare imagine</li>
                  <li>✓ 10 generari AI gratuite pe zi</li>
                  <li>✓ Suport de bază</li>
                </ul>
                <button
                  className="btn btn-outline-dark mt-auto disabled"
                  disabled
                >
                  Ești pe Free
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card plan-card text-center h-100 border-secondary">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Plan Pro</h5>
              </div>
              <div className="card-body d-flex flex-column">
                <ul className="list-unstyled mb-4">
                  <li>✓ 50% Reducere in prima luna!</li>
                  <li>✓ Generări nelimitate</li>
                  <li>✓ Acces prioritar la servere</li>
                  <li>✓ Suport dedicat 24/7</li>
                  <li>✓ Acces API</li>
                </ul>
                <button className="btn btn-warning mt-auto btn-outline-dark">
                  Începe Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
