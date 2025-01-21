import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/authContext.jsx";
import AddProductProvider from "./context/addProduct.jsx";
import CartProductContextProvider from "./context/cartProductContext.jsx";
import SearchedProductProvider from "./context/searchedProductContext.jsx";
import "core-js/stable";
import "regenerator-runtime/runtime";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AddProductProvider>
          <CartProductContextProvider>
            <SearchedProductProvider>
              <App />
            </SearchedProductProvider>
          </CartProductContextProvider>
        </AddProductProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
