"use client";
import { Card } from "@/components/card/card";
import { useState } from "react";
import styles from "./page.module.css";

const teamNamesIds = {
  Lucas: 43
};

export default function Home({ props }) {
  console.log({ props });

  const workItemTypes = {
    16: { name: "Release" },
    3: { name: "Task" },
    2: { name: "User Story" },
    1: { name: "Bug" },
    5: { name: "Spike" },
    6: { name: "Epic" },
  };

  const [businessMapSizeMode, setBusinessMapSizeMode] = useState(false);
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState([]);
  const [tiposSelecionado, setTiposSelecionado] = useState([]);
  const [dataInicio, setDataInicio] = useState(new Date(2024, 11, 1, 0, 0, 0));
  const [dataFim, setDataFim] = useState(new Date(2024, 10, 30, 23, 59, 59));
  const dados = props.data.filter((item) => {
    return (
      new Date(item.first_start_time) >= dataInicio &&
      new Date(item.first_end_time) <= dataFim
      // (new Date(item.last_start_time) >= dataInicio &&
      //   new Date(item.last_end_time) <= dataFim)
    );
  });

  console.log({ dataInicio, dataFim });

  console.log("data", props);

  const setMonthDates = (year, month) => {
    const firstDay = new Date(year, month, 1, 0, 0, 0);
    // last day of the month and last hour of the day (23:59:59)
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59);
    setDataInicio(firstDay);
    setDataFim(lastDay);
  };

  const filteredData = dados.filter((item) => {
    if (tiposSelecionado.length > 0) {
      if (!tiposSelecionado.includes(item.type_id)) {
        return false;
      }
    }

    if (pessoasSelecionadas.length > 0) {
      if (!item.pessoas.some((id) => pessoasSelecionadas.includes(id))) {
        return false;
      }
    }

    return true;
  });

  const throughputSize = filteredData.reduce((accumulator, currentValue) => {
    if (
      businessMapSizeMode &&
      (currentValue.size === undefined || currentValue.size === null)
    ) {
      return accumulator + 1;
    }

    return accumulator + currentValue.size;
  }, 0);

  console.log(filteredData);

  const bugs = dados.filter((item) => item.type_id == 1).length;

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
            <strong>Tipos de task:</strong>{" "}
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
          </label>
        </div>
        <div>
          <label>
            <strong>Pessoas:</strong>{" "}
            <select
              value={"default"}
              onChange={(e) => {
                const alreadySelected = pessoasSelecionadas.includes(
                  parseInt(e.target.value)
                );

                if (alreadySelected) {
                  setPessoasSelecionadas(
                    pessoasSelecionadas.filter(
                      (item) => item !== parseInt(e.target.value)
                    )
                  );
                } else {
                  setPessoasSelecionadas([
                    ...pessoasSelecionadas,
                    parseInt(e.target.value),
                  ]);
                }
              }}
            >
              <option value="default">Selecione as pessoas</option>
              {Object.entries(teamNamesIds).map(([key, value], i) => (
                <option
                  key={value}
                  value={value}
                  style={{
                    background: pessoasSelecionadas.includes(parseInt(value))
                      ? "purple"
                      : "unset",
                  }}
                >
                  {key}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            <strong>Calcular como o Business Map:</strong>{" "}
            <input
              type="checkbox"
              value={businessMapSizeMode}
              onChange={(e) => setBusinessMapSizeMode(e.target.checked)}
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
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        <main className={styles.main}>
          <h1 className={styles.title}>Metricas Gerais</h1>
          <div className={styles["cards-container"]}>
            <Card label="bugs" value={bugs} />
          </div>
        </main>
        <main className={styles.main}>
          <h1 className={styles.title}>Kanbanize Metrics</h1>
          <div className={styles["cards-container"]}>
            <Card label="throughput" value={filteredData.length} />
            <Card label="story points" value={throughputSize} />
          </div>
        </main>
      </div>
    </div>
  );
}
