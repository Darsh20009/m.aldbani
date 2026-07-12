import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";
import { getGoogleClientId } from "./lib/runtime-config";

setAuthTokenGetter(() => localStorage.getItem("token"));

const GOOGLE_CLIENT_ID = getGoogleClientId();

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
