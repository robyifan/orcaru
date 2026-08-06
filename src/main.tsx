import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import ApiDocsPage from "./app/pages/api-docs-page.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/api-documentation" element={<ApiDocsPage />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
  