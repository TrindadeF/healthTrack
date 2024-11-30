import { AppProps } from "next/app";
import "../styles/global.css";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/SharedComponents/Sidebar";
import "react-toastify/dist/ReactToastify.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    console.log("Aplicação carregada");
  }, []);

  return (
    <div className="app-container">
      <AuthProvider>
        <Sidebar />
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
};

export default MyApp;
