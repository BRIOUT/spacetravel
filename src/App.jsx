// ============================================
// App.jsx - The Root Component
// ============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";




import HomePage from "./pages/HomePage/HomePage";

import SpacecraftsPage from "./pages/SpacecraftsPage/SpacecraftsPage";

import SpacecraftPage from "./pages/SpacecraftPage/SpacecraftPage";

import ConstructionPage from "./pages/ConstructionPage/ConstructionPage";

import PlanetsPage from "./pages/PlanetsPage/PlanetsPage";

// ============================================
// APP COMPONENT
// ============================================
function App() {
  return (
    <div className={styles.app}>
      {

      }
      <BrowserRouter>
        {
        }
        <Routes>
          {

          }
          <Route path="/" element={<HomePage />} />

          {

          }
          <Route path="/spacecrafts" element={<SpacecraftsPage />} />

          {

          }
          <Route path="/spacecraft/:id" element={<SpacecraftPage />} />

          {

          }
          <Route path="/construction" element={<ConstructionPage />} />

          {

          }
          <Route path="/planets" element={<PlanetsPage />} />

          {}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;