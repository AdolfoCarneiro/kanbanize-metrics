import styles from "./style.module.css";

const Card = ({ label, value }) => {
  return (
    <div className={styles.card}>
      <b>{label}</b>: <p>{value}</p>
    </div>
  );
};

export { Card };
