import React, { useState, useRef } from "react";
import { read, utils } from "xlsx";

export default function VeyronSimulator({ buttonSpacing = true, radioSpacing = true }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();
  const [multiplierType, setMultiplierType] = useState("Bet");
  const [betValues, setBetValues] = useState({});
  const [results, setResults] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const multipliers = {
    Bet: [
      { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "RM#,###.##" },
      { name: "Argentine Peso", code: "ARS", multiplier: 200, format: "$ #.###,##" },
      { name: "Indonesian Rupiah", code: "IDR", multiplier: 200, format: "Rp#,###" },
      { name: "Vietnamese Dong", code: "VND", multiplier: 200, format: "#,###₫" },
      { name: "Thai Baht", code: "THB", multiplier: 50, format: "฿#,###.##" },
      { name: "Korean Won", code: "KRW", multiplier: 200, format: "₩#,###" },
      { name: "Chilean Peso", code: "CLP", multiplier: 200, format: "$#,###" },
      { name: "Nigerian Naira", code: "NGN", multiplier: 100, format: "₦#,###" },
      { name: "Colombian Peso", code: "COP", multiplier: 200, format: "$#,###" },
      { name: "Tanzanian Shilling", code: "TZS", multiplier: 200, format: "#,### TSh" },
      { name: "Ugandan Shilling", code: "UGX", multiplier: 200, format: "#,### USh" },
      { name: "Paraguayan Guarani", code: "PYG", multiplier: 200, format: "₲#,###" },
    ],
    LVC: [
      { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "RM#,###.##" },
      { name: "Indonesian Rupiah", code: "IDR", multiplier: 10000, format: "Rp#,###" },
      { name: "Vietnamese Dong", code: "VND", multiplier: 10000, format: "#,###₫" },
      { name: "Thai Baht", code: "THB", multiplier: 50, format: "฿#,###.##" },
      { name: "Korean Won", code: "KRW", multiplier: 1000, format: "₩#,###" },
      { name: "Chilean Peso", code: "CLP", multiplier: 500, format: "$#,###" },
      { name: "Nigerian Naira", code: "NGN", multiplier: 500, format: "₦#,###" },
      { name: "Colombian Peso", code: "COP", multiplier: 1000, format: "$#,###" },
      { name: "Tanzanian Shilling", code: "TZS", multiplier: 1000, format: "#,### TSh" },
      { name: "Ugandan Shilling", code: "UGX", multiplier: 1000, format: "#,### USh" },
      { name: "Paraguayan Guarani", code: "PYG", multiplier: 5000, format: "₲#,###" },
    ],
    CEP: [
      { name: "Malaysian Ringgit", code: "MYR", multiplier: 5, format: "RM#,###.##" },
      { name: "Indonesian Rupiah", code: "IDR", multiplier: 200, format: "Rp#,###" },
      { name: "Vietnamese Dong", code: "VND", multiplier: 200, format: "#,###₫" },
      { name: "Thai Baht", code: "THB", multiplier: 20, format: "฿#,###.##" },
      { name: "Korean Won", code: "KRW", multiplier: 200, format: "₩#,###" },
      { name: "Chilean Peso", code: "CLP", multiplier: 200, format: "$#,###" },
      { name: "Nigerian Naira", code: "NGN", multiplier: 200, format: "₦#,###" },
      { name: "Colombian Peso", code: "COP", multiplier: 200, format: "$#,###" },
      { name: "Tanzanian Shilling", code: "TZS", multiplier: 200, format: "#,### TSh" },
      { name: "Ugandan Shilling", code: "UGX", multiplier: 200, format: "#,### USh" },
      { name: "Paraguayan Guarani", code: "PYG", multiplier: 200, format: "₲#,###" },
    ],
    Hybrid: [
  { name: "Yuan Renminbi", code: "CNY", multiplierMin: 5, multiplierDefault: 5, multiplierMax: 10, format: "¥#,###.##" },
  { name: "Argentine Peso", code: "ARS", multiplier: 200, format: "$ #.###,##", isSingleMultiplier: true },
    ],
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setShowTable(false);
  };

  const parseFile = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = read(data);
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(ws);

    const lowerKeys = (str) => str.toLowerCase();
    const bets = {};
    jsonData.forEach((row) => {
      const key = lowerKeys(row.GamePropertyTypeName);
      if (["maxbet", "minbet", "defaultnumchips", "defaultchipsize"].includes(key)) {
        bets[key] = Number(row.Value);
      }
    });

    setBetValues(bets);
    calculateResults(bets);
    setShowTable(true);
  };

  const calculateResults = (bets) => {
    if (!bets) return;

    const selectedMultipliers = multipliers[multiplierType];
    const calculated = selectedMultipliers.map((cur) => {
      if (multiplierType === "Hybrid") {
        if (cur.isSingleMultiplier) {
          // For currencies like ARS that only have a single multiplier
          return {
            ...cur,
            min: Math.round((bets.minbet || 0) * (cur.multiplier || 1) / 100),
            default: Math.round((bets.defaultchipsize || 0) * (bets.defaultnumchips || 0) * (cur.multiplier || 1) / 100),
            max: Math.round((bets.maxbet || 0) * (cur.multiplier || 1) / 100),
          };
        } else {
          return {
            ...cur,
            min: Math.round((bets.minbet || 0) * (cur.multiplierMin || 1) / 100),
            default: Math.round((bets.defaultchipsize || 0) * (bets.defaultnumchips || 0) * (cur.multiplierDefault || 1) / 100),
            max: Math.round((bets.maxbet || 0) * (cur.multiplierMax || 1) / 100),
          };
        }
      } else {
        return {
          ...cur,
          min: Math.round((bets.minbet || 0) * cur.multiplier / 100),
          default: Math.round((bets.defaultchipsize || 0) * (bets.defaultnumchips || 0) * cur.multiplier / 100),
          max: Math.round((bets.maxbet || 0) * cur.multiplier / 100),
        };
      }
    });
    setResults(calculated);
  };

  const clearResults = () => {
    setFile(null);
    setResults([]);
    setBetValues({});
    setShowTable(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
 
  const downloadCSV = () => {
    if (!results.length) return;

    const header = ["Currency Name","Currency Code","Currency Format","Currency Multiplier","Min Bet","Default Bet","Max Bet"];
    const rows = results.map(r => [
      r.name,
      r.code,
      r.format,
      multiplierType === "Hybrid" ? `${r.multiplierMin}/${r.multiplierDefault}/${r.multiplierMax}` : r.multiplier,
      r.min,
      r.default,
      r.max
    ]);

    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "VeyronResults.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card simulator-flex">
      <div className="sim-input-box">
        <h2>Veyron Currency Simulator</h2>
        {/* File Upload */}
        <div style={{ marginBottom: "15px" }}>
          <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" onChange={handleFile} />
        </div>
        {/* Radio Buttons */}
        <div className='radioRow'>
          {["Bet", "LVC", "CEP", "Hybrid"].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="multiplierType"
                value={type}
                checked={multiplierType === type}
                onChange={() => setMultiplierType(type)}
              />
              {type} Multiplier
            </label>
          ))}
        </div>
        {/* Buttons */}
        <div className="sim-btn-group">
          <button onClick={() => {
            if (!file) {
              alert('Please upload a file first');
              return;
            }
            parseFile();
          }}>Calculate</button>
          <button onClick={clearResults}>Clear</button>
          {results.length > 0 && <button onClick={downloadCSV}>Download</button>}
        </div>
      </div>
      <div className="sim-results-box">
        <div style={{ width: '100%', marginBottom: '10px', fontWeight: 600, fontSize: '1.18rem', color: 'var(--muted)', textAlign: 'left' }}>Result:</div>
        {showTable && results.length > 0 && (
          <div className="table-responsive">
            <table className="resultTable">
              <thead>
                <tr>
                  <th>Currency Name</th>
                  <th>Currency Code</th>
                  <th>Currency Format</th>
                  <th>Currency Multiplier</th>
                  <th>Min Bet</th>
                  <th>Default Bet</th>
                  <th>Max Bet</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.code}</td>
                    <td>{row.format}</td>
                    <td>{multiplierType === "Hybrid" ? (row.isSingleMultiplier ? row.multiplier : `${row.multiplierMin}/${row.multiplierDefault}/${row.multiplierMax}`) : row.multiplier}</td>
                    <td>{row.min}</td>
                    <td>{row.default}</td>
                    <td>{row.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
