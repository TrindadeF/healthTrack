/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../services/api";
import styles from "./register.module.css";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  name: yup.string().required("Nome é obrigatório"),
  role: yup
    .string()
    .oneOf(["medico", "paciente"], "Selecione um papel válido")
    .required("Papel é obrigatório"),
  hospital: yup.string().when("role", {
    is: (role: string) => role === "medico",
    then: (schema) => schema.required("Hospital é obrigatório para médicos"),
    otherwise: (schema) => schema.notRequired(),
  }),
  crm: yup.string().when("role", {
    is: (role: string) => role === "medico",
    then: (schema) =>
      schema
        .matches(/^\d+$/, "CRM deve conter apenas números")
        .required("CRM é obrigatório para médicos"),
    otherwise: (schema) => schema.notRequired(),
  }),
  cpf: yup.string().when("role", {
    is: (role: string) => role === "paciente",
    then: (schema) =>
      schema
        .matches(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos")
        .required("CPF é obrigatório para pacientes"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const role = watch("role");

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        hospital: data.role === "medico" ? data.hospital : undefined,
        crm: data.role === "medico" ? data.crm : undefined,
        cpf: data.role === "paciente" ? data.cpf : undefined,
      });

      if (response.status === 201) {
        toast.success("Registro realizado com sucesso!");
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Erro ao registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Registro</h2>

        <div className={styles.formField}>
          <label>Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Digite seu email"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.email?.message}</p>
        </div>

        <div className={styles.formField}>
          <label>Senha</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Digite sua senha"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.password?.message}</p>
        </div>

        <div className={styles.formField}>
          <label>Nome</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Digite seu nome"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.name?.message}</p>
        </div>

        <div className={styles.formField}>
          <label>Papel</label>
          <select {...register("role")} className={styles.input}>
            <option value="">Selecione</option>
            <option value="medico">Médico</option>
            <option value="paciente">Paciente</option>
          </select>
          <p className={styles.errorMessage}>{errors.role?.message}</p>
        </div>

        {role === "medico" && (
          <>
            <div className={styles.formField}>
              <label>Hospital</label>
              <input
                {...register("hospital")}
                placeholder="Digite o nome do hospital"
                className={styles.input}
              />
              <p className={styles.errorMessage}>{errors.hospital?.message}</p>
            </div>
            <div className={styles.formField}>
              <label>CRM</label>
              <input
                {...register("crm")}
                placeholder="Digite seu CRM"
                className={styles.input}
              />
              <p className={styles.errorMessage}>{errors.crm?.message}</p>
            </div>
          </>
        )}

        {role === "paciente" && (
          <div className={styles.formField}>
            <label>CPF</label>
            <input
              {...register("cpf")}
              placeholder="Digite seu CPF"
              className={styles.input}
            />
            <p className={styles.errorMessage}>{errors.cpf?.message}</p>
          </div>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={() => router.push("/auth/login")}
        >
          Ir para Login
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
