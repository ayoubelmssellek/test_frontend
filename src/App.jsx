import React from "react";
import {HashRouter } from "react-router-dom";
import AppRoutes from "./Rootes";
import AddToHomePrompt from "./Helper/AddToHomePrompt";

function App() {

  

  return (
    <HashRouter>
      <AppRoutes />
      <AddToHomePrompt />
    </HashRouter>
  );
}

export default App;
