import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {ToastContainer} from "react-toastify";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
      <ToastContainer/>
          <App/>
  </BrowserRouter>
);

serviceWorker.unregister();
