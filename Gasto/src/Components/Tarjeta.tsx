import styles from "../Styles/Tarjeta.module.css";

interface TarjetaProps {
  titulo: string;
  dinero: number;
  presupuesto: number;
  porcentaje: number;
}

function Tarjeta({ titulo, dinero, presupuesto, porcentaje }: TarjetaProps) {
  return (
    <>
      <h3 className={styles["gastoTipoTitulo"]}>{titulo}</h3>
      <div className={styles["rowContainer"]}>
        <span className={styles["dineroFormato"]}>$</span>
        <span className={styles["dineroGastado"]}>{dinero}</span>
        <span className={styles["dineroAGastar"]}>/ {presupuesto}</span>
      </div>

      <div className={styles["progressContainer"]}>
        <div className={styles["progressBar"]} style={{ width: `${porcentaje}%` }} />
      </div>
      <span className={styles["porcentajeText"]}>{porcentaje.toFixed(0)}%</span>
    </>
  );
}
export default Tarjeta;
