import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/authContext.jsx";
import StripeProvider from "./components/Global/StripeProvider.jsx";
import AddProductProvider from "./context/addProduct.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AddProductProvider>
          <App />
        </AddProductProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
