import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../services/api";
import { RegisterFormData } from "@/types/forms";
import Loader from "../../components/SharedComponents/Loader";
import Modal from "../../components/SharedComponents/Modal";
import styles from "../../styles/Form.module.css";

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
  hospital: yup.string().when("role", (role, schema) => {
    if (typeof role === "string" && role === "doctor") {
      return schema.required("Hospital é obrigatório para médicos");
    }
    return schema.notRequired();
  }),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const role = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      const role = data.role === "medico" ? "medico" : "paciente";

      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        name: data.name,
        role,
        hospital: data.role === "medico" ? data.hospital : undefined,
      });

      if (response.status === 201) {
        setModalMessage("Registro realizado com sucesso!");
      }
    } catch (err: unknown) {
      console.error("Erro durante o registro:", err);
      setModalMessage("Ocorreu um erro durante o registro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Registrar</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formField}>
          <label className={styles.label}>Email</label>
          <input
            {...register("email")}
            placeholder="Digite seu email"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.email?.message}</p>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Senha</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Digite sua senha"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.password?.message}</p>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Nome</label>
          <input
            {...register("name")}
            placeholder="Digite seu nome"
            className={styles.input}
          />
          <p className={styles.errorMessage}>{errors.name?.message}</p>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Papel</label>
          <select {...register("role")} className={styles.select}>
            <option value="">Selecione um papel</option>
            <option value="medico">Médico</option>
            <option value="paciente">Paciente</option>
          </select>
          <p className={styles.errorMessage}>{errors.role?.message}</p>
        </div>

        {role === "medico" && (
          <div className={styles.formField}>
            <label className={styles.label}>Hospital</label>
            <input
              {...register("hospital")}
              placeholder="Digite o nome do hospital"
              className={styles.input}
            />
            <p className={styles.errorMessage}>{errors.hospital?.message}</p>
          </div>
        )}

        <button type="submit" className={styles.button}>
          Registrar
        </button>
      </form>

      {loading && (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      )}

      {modalMessage && (
        <div className={styles.modalWrapper}>
          <Modal
            title="Sucesso"
            isOpen={true}
            onClose={() => setModalMessage(null)}
          >
            <p>{modalMessage}</p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Register;
