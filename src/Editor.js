import './editor.css'
import { useState } from 'react'
import Row from './Row'

function Editor() {
  let [rows, setRows] = useState([
    {
      posIdx: 0,
      id: 0,
      placeholder: 'qweqwe',
      isCurrentlyActive: false,
    },
    {
      posIdx: 1,
      id: 1,
      placeholder: 'qweqwe 123',
      isCurrentlyActive: false,
    },
    {
      posIdx: 2,
      id: 2,
      placeholder: 'qweqwe 123 4324',
      isCurrentlyActive: true,
    },
    {
      posIdx: 3,
      id: '0.213923',
      placeholder: 'zxczxc',
      isCurrentlyActive: false,
    },
  ])
  function setCurrentlyActive(posIdx) {
    const rowsToUpdate = [...rows]
    rowsToUpdate.find(r => r.isCurrentlyActive === true).isCurrentlyActive = false
    rowsToUpdate.find(r => r.posIdx === posIdx).isCurrentlyActive = true
    const updatedRows = rowsToUpdate
    setRows(updatedRows)
  }
  function addRows(posIdx) {
    rows.find(r => r.isCurrentlyActive === true).isCurrentlyActive = false

    const firstHalf = [...rows.slice(0, posIdx + 1)]
    const newRowToInsert = {
      id: String(Math.random()),
      isCurrentlyActive: true,
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
      {rows.map(({posIdx, id, placeholder, isCurrentlyActive}) => (
        <Row
          key={id}
          id={id}
          posIdx={posIdx}
          placeholder={placeholder}
          isCurrentlyActive={isCurrentlyActive}
          addRows={addRows}
          setCurrentlyActive={setCurrentlyActive}
        />
      ))}
    </section>
  )
}

export default Editor