# Thomas Prinil - Developer Portfolio

A sleek, premium, and fully responsive software developer portfolio built with React + Vite. Features a customized "Product Designer" high-contrast dark theme, scroll-reveal animations, and a secure real-time Admin Panel natively backed by Firebase Firestore.

## 🌟 Key Features

- **Dynamic Content Management:** Fully functional Admin Panel to update your Profile, Projects, Certificates, Resume, and more in real-time.
- **Hybrid Database Layer:** Seamlessly uses your browser's `localStorage` as an offline fallback, but instantly upgrades to a live global Firebase Cloud Firestore database when API keys are provided.
- **Modern UI/UX:** Glassmorphism, floating pill navigation, custom scrollbars, and high-contrast micro-interactions.
- **Export Control:** Directly upload Resume PDFs and configure routing from within the interface.

---

## 🛠 How to Run Locally

Follow these steps to preview and edit the portfolio on your own machine.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/en/) installed on your system.

### 2. Install Dependencies
Open your terminal, ensure you are inside the `PORTFOLIO` directory, and run:
```bash
npm install
```

### 3. Start the Development Server
Once the installation finishes, start the local Vite server by running:
```bash
npm run dev
```

### 4. View the Site
Your terminal will output a local address. Open your web browser and navigate to it (usually port 5173 or 5174):
```text
🔗 http://localhost:5173/PORTFOLIO/
```

### 5. Access the Admin Panel
To live-edit the data currently on the site:
1. Navigate to the admin path: `http://localhost:5173/PORTFOLIO/admin`
2. Enter the developer password: **`admin123`**
3. Any changes you make and save will instantly reflect on the main site!

*(Note: Unless you have added your Firebase keys to `src/data/firebase.js`, these admin changes will be safely stored in your browser's local cache.)*

---

## 🚀 Deployment (GitHub Pages)

To launch the portfolio live to the internet:
1. Ensure you have followed the `deployment_plan.md` steps to link your GitHub repository.
2. Add your Firebase Database keys to `src/data/firebase.js` so visitors see your live data.
3. Run the automated deployment script:
```bash
npm run deploy
```
This will compile the optimized production code and automatically push it to your GitHub Pages branch.
