import { useNavigate } from "react-router-dom";
import styles from "../styles/recoverysuccess.module.css";
export function RecoveryRequestSuccess() {

  const navigate = useNavigate();

  function onClick(){
    navigate("/login", {replace: true});
  }
  
  return (
    <div className={styles.page}>
    <div className={styles.container}>
          <p className={styles.text}>A temporary password has been sent to your email. Please change it as soon as possible </p>
          <button type="button" onClick={onClick} className={styles.button}>Back to Login Page</button>
    </div>
    </div>
  );
}

export default RecoveryRequestSuccess;