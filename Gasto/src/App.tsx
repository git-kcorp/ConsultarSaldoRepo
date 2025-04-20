import { useEffect, useState } from "react";
import "./Styles/App.css";
import fetchGetSaldo from "./Methods/fetchGetSaldo";
import Tarjeta from "./Components/Tarjeta";
import { useAuth } from "./Components/AuthContext";
import Login from "./Components/Login";

function App() {
  const { token } = useAuth();
  const [total, setTotal] = useState(0);
  const [small, setSmall] = useState(0);
  const [mid, setMid] = useState(0);
  const [big, setBig] = useState(0);

  const presupuestoBajo = Number(localStorage.getItem("bajo"));
  const presupuestoMedio = Number(localStorage.getItem("mid"));
  const presupuestoAlto = Number(localStorage.getItem("alto"));

  const porcentajeB = Math.min((small / presupuestoBajo) * 100, 100);
  const porcentajeM = Math.min((mid / presupuestoMedio) * 100, 100);
  const porcentajeA = Math.min((big / presupuestoAlto) * 100, 100);

  useEffect(() => {
    const getSaldo = async () => {
      if (!token) return;

      const response = await fetchGetSaldo(token);
      setSmall(Math.round(response.gastoShort));
      setMid(Math.round(response.gastoMid));
      setBig(Math.round(response.gastoBig));
      setTotal(
        Math.round(response.gastoShort + response.gastoMid + response.gastoBig)
      );
    };
    getSaldo();
  }, [token]);

  if (!token) return <Login />;

  return (
    <div className="container">
      {total === 0 ? (
        <h2 className="loading">Cargando...</h2>
      ) : (
        <>
          <Tarjeta
            titulo="Gastos Bajos"
            dinero={small}
            presupuesto={presupuestoBajo}
            porcentaje={porcentajeB}
          />
          {mid > 0 && (
            <Tarjeta
              titulo="Gastos Medios"
              dinero={mid}
              presupuesto={presupuestoMedio}
              porcentaje={porcentajeM}
            />
          )}
          {big > 0 && (
            <Tarjeta
              titulo="Gastos Altos"
              dinero={big}
              presupuesto={presupuestoAlto}
              porcentaje={porcentajeA}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
