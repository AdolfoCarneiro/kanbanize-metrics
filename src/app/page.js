'use client'
import styles from "./page.module.css";
import { useState } from "react";

export default function Home({ props }) {

  const workItemTypes = {
    release: { id: 16, name: "Release" },
    task: { id: 3, name: "Task" },
    userStory: { id: 2, name: "User Story" },
    bug: { id: 1, name: "Bug" },
    spike: { id: 5, name: "Spike" },
    epic : { id: 6, name: "Epic" }
  };

  const [dataInicio, setDataInicio] = useState(new Date(2024, 10, 1));
  const [dataFim, setDataFim] = useState(new Date(2024, 10, 30));
  const dados = props.data
  .filter((item) => {
    return (
      ((new Date(item.last_end_time_end_time) >= dataInicio && new Date(item.last_end_time) <= dataFim) ||
        (new Date(item.first_end_time) >= dataInicio && new Date(item.first_end_time) <= dataFim))
    );
  });

  const setMonthDates = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    setDataInicio(firstDay);
    setDataFim(lastDay);
  };

  console.log(dados);

  const throwputSize = dados.reduce((accumulator, currentValue) => accumulator + currentValue.size, 0);

  const releases = dados.filter((item) => item.type_id == 16).length;

  return (
    <div className={styles.page}>
      <div>
        <h3>Selecionar Mês</h3>
        <div>
          {Array.from({ length: 12 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setMonthDates(2024, index)} // Define o ano e o mês
              style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: "yellow",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                color: "black"
              }}
            >
              {new Date(2024, index).toLocaleString("default", { month: "long" })}
            </button>
          ))}
        </div>
        <h4>Ou selecione datas específicas:</h4>

        {/* Inputs para selecionar qualquer data */}
        <div style={{ margin: "10px 0" }}>
          <label>
            <strong>Data Início:</strong>{" "}
            <input
              type="date"
              value={dataInicio.toISOString().split("T")[0]}
              onChange={(e) => setDataInicio(new Date(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            <strong>Data Fim:</strong>{" "}
            <input
              type="date"
              value={dataFim.toISOString().split("T")[0]}
              onChange={(e) => setDataFim(new Date(e.target.value))}
            />
          </label>
        </div>
        <div>
          <h4>Datas Selecionadas:</h4>
          <p>
            <strong>Data Início:</strong> {dataInicio.toLocaleDateString()}
          </p>
          <p>
            <strong>Data Fim:</strong> {dataFim.toLocaleDateString()}
          </p>
        </div>
      </div>
      );
      <main className={styles.main}>
        <h1 className={styles.title}>Kanbanize Metrics</h1>
        <p>throwput: {dados.length}</p>
        <p>story ponits: {throwputSize}</p>
        <p>story ponits: {releases}</p>
      </main>
    </div>
  );
}
