import { AppProps } from "next/app";
import "../styles/global.css";
import { useEffect } from "react";
import BackButton from "@/components/SharedComponents/BackButton";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    console.log("Aplicação carregada");
  }, []);

  return (
    <div className="app-container">
      <BackButton />
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
