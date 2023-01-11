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
      isCurrentlyActive: true,
    },
    {
      posIdx: 2,
      id: 2,
      placeholder: 'qweqwe 123 4324',
      isCurrentlyActive: false,
    },
    {
      posIdx: 3,
      id: '0.213923',
      placeholder: 'zxczxc',
      isCurrentlyActive: false,
    },
  ])
  function setCurrentlyActive(id) {
    const rowsToUpdate = [...rows]
    rowsToUpdate.find(r => r.isCurrentlyActive === true).isCurrentlyActive = false
    rowsToUpdate.find(r => r.id === id).isCurrentlyActive = true
    const updatedRows = rowsToUpdate
    setRows(updatedRows)
  }
  function addRows(posIdx) {
    setRows([
      ...rows.slice(0, posIdx),
      {
        id: String(Math.random()),
        isCurrentlyActive: false,
      },
      ...rows.slice(posIdx)
    ])
  }

  return (
    <section className="editor">
      {rows.map(({posIdx, id, placeholder, isCurrentlyActive}, i) => (
        <Row
          key={id}
          id={id}
          posIdx={i}
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