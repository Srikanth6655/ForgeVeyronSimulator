import React, { useState } from 'react'
import PRESETS from '../utils/currencyPresets'

export default function ForgeSimulator() {
  const [fileInfo, setFileInfo] = useState(null)
  const [bets, setBets] = useState(null)
  const [type, setType] = useState('standard')
  const [rows, setRows] = useState([])

  async function onFile(e) {
    const f = e.target.files[0]
    if (!f) return
    if (!f.name.endsWith('.json')) {
      alert('Please upload a JSON file')
      return
    }
    const txt = await f.text()
    try {
      const json = JSON.parse(txt)
      const detected = extractBets(json)
      if (!detected) {
        alert('Could not find min/default/max numeric values')
        return
      }
      setBets(detected)
      setFileInfo(f.name)
    } catch (err) {
      alert('Invalid JSON: ' + err.message)
    }
  }

 function extractBets(obj) {
  if (!obj) return null
 
  // Defensive check for standard level path
  if (
    obj.levels &&
    obj.levels.standard &&
    obj.levels.standard.bets &&
    obj.levels.standard.bets.slot
  ) {
    const slot = obj.levels.standard.bets.slot
    const isNum = v => typeof v === 'number' && Number.isFinite(v)
    if (isNum(slot.min) && isNum(slot.default) && isNum(slot.max)) {
      return { min: slot.min, default: slot.default, max: slot.max }
    }
  }
 
  // fallback to original deep search if needed
  const isNum = v => typeof v === 'number' && Number.isFinite(v)
  if (isNum(obj.min) && isNum(obj.default) && isNum(obj.max))
    return { min: obj.min, default: obj.default, max: obj.max }
 
  let found = null
  function dfs(o) {
    if (found) return
    if (!o || typeof o !== 'object') return
    if (isNum(o.min) && isNum(o.default) && isNum(o.max)) {
      found = { min: o.min, default: o.default, max: o.max }
      return
    }
    for (const k in o) dfs(o[k])
  }
  dfs(obj)
  return found
}

  function calculate() {
    if (!bets) {
      alert('Upload JSON with min/default/max first')
      return
    }
    const preset = PRESETS.forge
    let rs = []

    if (type === 'hybrid') {
      rs = preset.hybrid.map(c => {
        if (c.minMultiplier && c.defaultMultiplier && c.maxMultiplier) {
          return {
            ...c,
            min: bets.min * (c.minMultiplier / 100),
            default: bets.default * (c.defaultMultiplier / 100),
            max: bets.max * (c.maxMultiplier / 100),
          }
        }
        return null
      }).filter(Boolean)
    } else {
      const list = preset[type]
      rs = list.map(c => ({
        ...c,
        min: bets.min * (c.multiplier / 100),
        default: bets.default * (c.multiplier / 100),
        max: bets.max * (c.multiplier / 100),
      }))
    }

    setRows(rs)
  }

  function clearResults() {
    setRows([])
    setBets(null)
    setFileInfo(null)
  }

  function downloadCsv() {
    if (!rows.length) {
      alert('No results')
      return
    }
    const header = ['Currency Name', 'Code', 'Format', 'Multiplier', 'Min Bet', 'Default Bet', 'Max Bet']
    const lines = [header.join(',')]
    rows.forEach(r => {
      const mult = typeof r.multiplier === 'object' ? JSON.stringify(r.multiplier) : r.multiplier
      lines.push([r.name, r.code, r.format, mult, r.min, r.default, r.max].map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'forge-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card simulator-flex">
      <div className="sim-input-box">
        <h2>Forge Currency Simulator</h2>
        <div>
          <input type='file' accept='.json' onChange={onFile} style={{ color: 'rgba(202, 41, 41, 0.6)' }} />
        </div>
        <div className='radioRow'>
          <label><input type='radio' checked={type === 'standard'} onChange={() => setType('standard')} /> Standard</label>
          <label><input type='radio' checked={type === 'lvc'} onChange={() => setType('lvc')} /> LVC</label>
          <label><input type='radio' checked={type === 'newForge'} onChange={() => setType('newForge')} /> New Forge</label>
          <label><input type='radio' checked={type === 'hybrid'} onChange={() => setType('hybrid')} /> Hybrid</label>
        </div>
        <div className="sim-btn-group">
          <button onClick={calculate}>Calculate</button>
          <button onClick={clearResults}>Clear</button>
          <button onClick={downloadCsv}>Download CSV</button>
        </div>
      </div>
      <div className="sim-results-box">
        <div style={{ width: '100%', marginBottom: '10px', fontWeight: 600, fontSize: '1.18rem', color: 'var(--muted)', textAlign: 'left' }}>Result:</div>
        <div className="table-responsive">
          <ResultTable rows={rows} type={type} />
        </div>
      </div>
    </div>
  )
}

function ResultTable({ rows, type }) {
  if (!rows || !rows.length) return <div>No results yet</div>
  return (
    <table className='resultTable' style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
      <thead>
        <tr>
          <th>Currency Name</th>
          <th>Code</th>
          <th>Format</th>
          <th>Multiplier</th>
          <th>Min Bet</th>
          <th>Default Bet</th>
          <th>Max Bet</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.name}</td>
            <td>{r.code}</td>
            <td>{r.format}</td>
            <td>{type === 'hybrid' && r.minMultiplier && r.defaultMultiplier && r.maxMultiplier ? `${r.minMultiplier}/${r.defaultMultiplier}/${r.maxMultiplier}` : r.multiplier}</td>
            <td>{formatNum(r.min)}</td>
            <td>{formatNum(r.default)}</td>
            <td>{formatNum(r.max)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatNum(v) {
  if (v === undefined || v === null) return ''
  return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
