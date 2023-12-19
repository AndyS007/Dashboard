import "./App.css";
import { AuthProvider } from "./provider/AuthProvider";
import DashBoard from "./page/DashBoard";
import React from "react";

function App() {
  return (
    <>
      <AuthProvider>
        <DashBoard />
      </AuthProvider>
    </>
  );
}

export default App;
