import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { MaterialTailwindControllerProvider } from "./context/index.jsx";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { PromptProvider } from "./context/PromptProvider.jsx";
import { store } from "./redux/store/store.js";
import { ThemeProvider } from "@material-tailwind/react";

const theme = {
  typography: {
    defaultProps: {
      className: "font-sans",
    },
  },
};
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MaterialTailwindControllerProvider>
    <Toaster />

    <Provider store={store}>
      <BrowserRouter basename="/secureForcehrms">
        <ThemeProvider value={theme}>
          <PromptProvider>
            <App />
          </PromptProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </MaterialTailwindControllerProvider>
  // </React.StrictMode>
);
