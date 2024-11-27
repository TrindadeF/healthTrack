import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button onClick={handleBack} style={{ padding: "10px", cursor: "pointer" }}>
      Voltar
    </button>
  );
};

export default BackButton;
