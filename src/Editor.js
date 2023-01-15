import './editor.css'
import { useState } from 'react'
import Row from './Row'

function Editor() {
  let [rows, setRows] = useState([
    {
      posIdx: 0,
      id: 0,
      placeholder: 'qweqwe',
      isActive: false,
    },
    {
      posIdx: 1,
      id: 1,
      placeholder: 'qweqwe 123',
      isActive: false,
    },
    {
      posIdx: 2,
      id: 2,
      placeholder: 'qweqwe 123 4324',
      isActive: true,
    },
    {
      posIdx: 3,
      id: '0.213923',
      placeholder: 'zxczxc',
      isActive: false,
    },
  ])
  function setCurrentlyActive(posIdx) {
    const rowsToUpdate = [...rows]
    rowsToUpdate.find(r => r.isActive === true).isActive = false
    rowsToUpdate.find(r => r.posIdx === posIdx).isActive = true
    const updatedRows = rowsToUpdate
    setRows(updatedRows)
  }
  function addRows(posIdx) {
    rows.find(r => r.isActive === true).isActive = false

    const firstHalf = [...rows.slice(0, posIdx + 1)]
    const newRowToInsert = {
      id: String(Math.random()),
      isActive: true,
      posIdx: posIdx + 1
    }
    const secondHalf = [...rows.slice(posIdx + 1)]
    for (const row of secondHalf) {
      row.posIdx++
    }

    const mergedHalvesWithNewRow = firstHalf.concat(newRowToInsert, secondHalf)
    setRows(mergedHalvesWithNewRow)
  }

  return (
    <section className="editor">
      {rows.map(({posIdx, id, placeholder, isActive}) => (
        <Row
          key={id}
          id={id}
          posIdx={posIdx}
          placeholder={placeholder}
          isActive={isActive}
          addRows={addRows}
          setCurrentlyActive={setCurrentlyActive}
        />
      ))}
    </section>
  )
}

export default Editor