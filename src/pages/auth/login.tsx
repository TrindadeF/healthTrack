import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import api from "../../services/api";
import { LoginFormData } from "@/types/forms";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCredential.user.getIdToken();

      const response = await api.post("/auth/login", {
        email: data.email,
        idToken: token,
      });

      const user = response.data.user;
      console.log("Resposta do servidor:", user);

      if (!user || !user.role) {
        throw new Error("Dados do usuário inválidos ou incompletos.");
      }

      if (user.role === "medico") {
        router.push("/doctors/profile");
      } else if (user.role === "paciente") {
        router.push("/patients/dashboard");
      } else {
        throw new Error("Papel desconhecido para o usuário.");
      }
    } catch (err: unknown) {
      console.error("Erro ao fazer login:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        <p style={{ color: "red" }}>{errors.email?.message}</p>

        <input {...register("password")} type="password" placeholder="Senha" />
        <p style={{ color: "red" }}>{errors.password?.message}</p>

        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
