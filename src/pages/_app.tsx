import { AppProps } from "next/app";
import "../styles/global.css";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Toolbar from "@/components/SharedComponents/toolbar";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    console.log("Aplicação carregada");
  }, []);

  return (
    <div className="app-container">
      <AuthProvider>
        <Toolbar />
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
};

export default MyApp;
