/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import api from "../../services/api";
import { RegisterFormData } from "@/types/forms";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  role: yup
    .string()
    .oneOf(["doctor", "patient"], "Selecione um papel válido")
    .required("Papel é obrigatório"),
});

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await api.post("/auth/register", {
        uid: user.uid,
        email: data.email,
        role: data.role,
      });

      alert("Registro realizado com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro ao registrar usuário.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        <p>{errors.email?.message}</p>

        <input {...register("password")} type="password" placeholder="Senha" />
        <p>{errors.password?.message}</p>

        <select {...register("role")}>
          <option value="">Selecione um papel</option>
          <option value="doctor">Médico</option>
          <option value="patient">Paciente</option>
        </select>
        <p>{errors.role?.message}</p>

        <button type="submit">Registrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
