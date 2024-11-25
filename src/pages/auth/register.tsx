import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
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
    .oneOf(["doctor", "patient"], "Selecione um papel válido")
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
        name: data.name,
        hospital: data.role === "doctor" ? data.hospital : undefined,
      });

      setModalMessage("Registro realizado com sucesso!");
    } catch (err: unknown) {
      console.error("Erro durante o registro:", err);
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
            <option value="doctor">Médico</option>
            <option value="patient">Paciente</option>
          </select>
          <p className={styles.errorMessage}>{errors.role?.message}</p>
        </div>

        {role === "doctor" && (
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
