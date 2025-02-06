import styles from "../styles/recoveryrequest.module.css";
export function RecoveryRequestSuccess() {
  return (
    <div className={styles.outsideContainer}>
        <div className={styles.container}>
            <h1> Password Recovery </h1>
            <p className={styles.text}>An email has been sent to your account.</p>
        </div>
    </div>
  );
}

export default RecoveryRequestSuccess;