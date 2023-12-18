import { useState } from "react";
import "./App.css";
import { AuthProvider } from "./provider/AuthProvider";
import DashBoard from "./page/DashBoard";

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
