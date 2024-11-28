"use client";
import { Card } from "@/components/card/card";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home({ props }) {
  const workItemTypes = {
    16: { name: "Release" },
    3: { name: "Task" },
    2: { name: "User Story" },
    1: { name: "Bug" },
    5: { name: "Spike" },
    6: { name: "Epic" },
  };
  // const workItemTypes = {
  //   release: { id: 16, name: "Release" },
  //   task: { id: 3, name: "Task" },
  //   userStory: { id: 2, name: "User Story" },
  //   bug: { id: 1, name: "Bug" },
  //   spike: { id: 5, name: "Spike" },
  //   epic: { id: 6, name: "Epic" },
  // };

  const [tiposSelecionado, setTiposSelecionado] = useState([]);
  const [dataInicio, setDataInicio] = useState(new Date(2024, 10, 1));
  const [dataFim, setDataFim] = useState(new Date(2024, 10, 30));
  const dados = props.data.filter((item) => {
    return (
      (new Date(item.last_end_time_end_time) >= dataInicio &&
        new Date(item.last_end_time) <= dataFim) ||
      (new Date(item.first_end_time) >= dataInicio &&
        new Date(item.first_end_time) <= dataFim)
    );
  });

  const setMonthDates = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    setDataInicio(firstDay);
    setDataFim(lastDay);
  };

  console.log(dados);

  const filteredData = tiposSelecionado.length !== 0 ? dados.filter((item) =>
    tiposSelecionado.includes(item.type_id)
  ) : dados;

  const throwputSize = filteredData.reduce(
    (accumulator, currentValue) => accumulator + currentValue.size,
    0
  );

  console.log(tiposSelecionado);

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
                color: "black",
              }}
            >
              {new Date(2024, index).toLocaleString("default", {
                month: "long",
              })}
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
        <br />
        <div>
          <label>
            <strong>Tipos:</strong>{" "}
            <select
              // value={tiposSelecionado}
              value={"default"}
              onChange={(e) => {
                const alreadySelected = tiposSelecionado.includes(
                  parseInt(e.target.value)
                );

                if (alreadySelected) {
                  setTiposSelecionado(
                    tiposSelecionado.filter(
                      (item) => item !== parseInt(e.target.value)
                    )
                  );
                } else {
                  setTiposSelecionado([
                    ...tiposSelecionado,
                    parseInt(e.target.value),
                  ]);
                }
              }}
            >
              <option value="default">Selecione as opções</option>
              {Object.keys(workItemTypes).map((key, i) => (
                <option
                  key={key}
                  value={key}
                  style={{
                    background: tiposSelecionado.includes(parseInt(key))
                      ? "purple"
                      : "unset",
                  }}
                >
                  {workItemTypes[key].name}
                </option>
              ))}
            </select>
            {/* <input
              type="date"
              value={dataFim.toISOString().split("T")[0]}
              onChange={(e) => setDataFim(new Date(e.target.value))}
            /> */}
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
      <div style={{display: "flex", flexDirection: "column", gap: 64}}>
        <main className={styles.main}>
          <h1 className={styles.title}>Metricas Gerais</h1>
          <div className={styles["cards-container"]}>
            <Card label="releases" value={releases} />
          </div>
        </main>
        <main className={styles.main}>
          <h1 className={styles.title}>Kanbanize Metrics</h1>
          <div className={styles["cards-container"]}>
            <Card label="throwput" value={filteredData.length} />
            <Card label="story points" value={throwputSize} />
          </div>
        </main>
      </div>
    </div>
  );
}
