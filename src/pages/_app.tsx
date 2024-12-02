import { AppProps } from "next/app";
import "../styles/global.css";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/SharedComponents/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    console.log("Aplicação carregada");
  }, []);

  return (
    <div className="app-container">
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Sidebar />
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
};

export default MyApp;
