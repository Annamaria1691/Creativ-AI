# CreativAI

**CreativAI** este o aplicație web full-stack care permite utilizatorilor să genereze imagini pe baza unor prompturi text folosind inteligență artificială, să își vizualizeze și să își descarce creațiile, să gestioneze un cont cu autentificare JWT și să verifice statistici de utilizare.

---

## Tehnologii folosite

* **Frontend:** React (Vite) cu react-router, React Context API, Bootstrap, React-Toastify
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT pentru autentificare, Joi pentru validare (opțional), DeepAI + Cloudinary pentru generarea și stocarea imaginilor
* **Altele:** dotenv (variabile de mediu), axios pentru apeluri HTTP

---

## Funcționalități cheie

1. **Autentificare & Înregistrare**

   * Înregistrare cu username, email și parolă hasheată (bcrypt + pepper)
   * Login folosind JWT, stocat în localStorage și distribuit prin Bearer token
2. **Generare imagini AI**

   * Până la 10 imagini/zi pentru planul Free
   * Stream de la DeepAI și încărcare în Cloudinary
3. **Galerie personală**

   * Vizualizare imaginilor generate, descărcare și ștergere
4. **Profil utilizator**

   * Vizualizare și actualizare email
   * Verificare statistici: câte imagini generate azi și câte mai rămân
5. **Planuri tarifare (demo)**

   * Free vs Pro (buton upgrade fake)

---

## Structura proiectului

```
project/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Layout, Navbar, ProtectedRoute
│   │   ├── pages/        # Home, Login, Register, Dashboard, Generate, Gallery, Profile
│   │   ├── context/      # AuthContext
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── server/               # Express backend
│   ├── routes/           # auth.js, images.js
│   ├── models/           # User.js, Image.js
│   ├── middleware/       # authMiddleware.js
│   ├── utils/            # deepai.js, cloudinary.js
│   ├── .env              # variabile de mediu (gitignored)
│   └── index.js          # punct de intrare
├── .gitignore
└── README.md
```

---

## Configurare & Instalare

1. **Clonează repository-ul**

   ```bash
   git clone https://github.com/<USERNAME>/Creativ-AI.git
   cd Creativ-AI
   ```

2. **Configurează variabilele de mediu**

   Creează un fișier `.env` în folderul `server/` cu următorul conținut:

   ```ini
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=secret-token-key
   PEPPER=some-pepper-string
   DEEPAI_API_KEY=your_deepai_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloud_api_key
   CLOUDINARY_API_SECRET=your_cloud_api_secret
   ```

3. **Instalează dependențele & pornește aplicația**

   În rădăcina proiectului (unde se află `package.json` care folosește `concurrently`), rulează:

   ```bash
   npm install
   npm run dev
   ```

   * **`npm run dev`** va porni **concurrent** backend-ul (Express) și frontend-ul (Vite) în același timp.

---

## API Reference

### Auth

* **POST** `/api/auth/register`
  Body: `{ username, email, password }` → `{ token }`

* **POST** `/api/auth/login`
  Body: `{ identifier, password }` → `{ token }`

* **PUT** `/api/auth/profile/email`
  Header: `Authorization: Bearer <token>`
  Body: `{ email }` → `{ message, email }`

### Images

* **GET** `/api/images`
  Header: `Authorization: Bearer <token>`
  → `{ images: [...] }`

* **POST** `/api/images/generate`
  Header: `Authorization`
  Body: `{ prompt, title }` → `{ _id, title, imageUrl, prompt, createdAt }`

* **DELETE** `/api/images/:id`
  Header: `Authorization`
  → `{ message }`

* **GET** `/api/images/today-count`
  Header: `Authorization`
  → `{ countToday, remaining, dailyLimit }`

---

## Utilizare

1. Înregistrează-te sau autentifică-te.
2. În pagina **Generate**, scrie un prompt și un titlu, apoi generează imaginea.
3. În **Gallery**, vezi imaginile, descarcă-le sau șterge-le.
4. În **Profile**, actualizează-ți email-ul și vezi câte imagini ai generat azi.

---

## Contribuții

Contribuțiile sunt bineveneite! Deschide un pull request sau issue pe GitHub.

---

## Licență

Acest proiect este licențiat sub MIT License. Vezi `LICENSE.md` pentru detalii.
