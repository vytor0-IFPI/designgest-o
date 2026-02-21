import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import { App } from "./App";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Componente Wrapper para evitar crash total se o GoogleOAuth falhar
function Root() {
  if (!clientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID não encontrado. Funcionalidades do Gmail estarão desativadas.");
    return <App />;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Não foi possível encontrar o elemento root");

createRoot(rootElement).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
