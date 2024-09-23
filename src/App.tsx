import "./App.css";
import { AuthProvider } from "./provider/AuthProvider";
import DashBoard from "./page/DashBoard";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <DashBoard />
      </AuthProvider>
    </>
  );
}

export default App;
