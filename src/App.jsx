import React from "react";
import {HashRouter } from "react-router-dom";
import AppRoutes from "./Rootes";
import InstallAppPrompt from "./Helper/AddToHomePrompt";

function App() {

  

  return (
    <HashRouter>
            <InstallAppPrompt/>

      <AppRoutes />
    </HashRouter>
  );
}

export default App;
