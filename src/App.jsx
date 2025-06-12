import React from "react";
import {HashRouter } from "react-router-dom";
import AppRoutes from "./Rootes";
import AddToHomeMessage from "./Helper/AddToHomePrompt";

function App() {

  

  return (
    <HashRouter>
      <AppRoutes />
      <AddToHomeMessage />
    </HashRouter>
  );
}

export default App;
