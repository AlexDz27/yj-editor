import './editor.css'
import { useState } from 'react'
import Row from './Row'

function Editor() {
  let [rows, setRows] = useState([
    {
      posIdx: 0,
      id: 0,
      placeholder: 'Write something... 123 123sdak kasdsa ksakd askkas ka skdksakda skd sk dasdaks da ks 123u 12u312 u321u3 12u83 12u3 128u3 21u3 12u3 12u12u8',
      isActive: false,
    },
    {
      posIdx: 1,
      id: 1,
      placeholder: 'qwe qwe kqwek qwk ewkwqke kqw kqwek qwk eqwek kaskdkas ak ask dsakask ksa kkwqk ksadaksd kask ask saksak askdwqk1 123 123 123 21 j213 1230 12 j2 i3j31i j',
      isActive: false,
    },
    {
      posIdx: 2,
      id: 2,
      placeholder: '123123123 123123 123 1312 12',
      isActive: true,
    },
    {
      posIdx: 3,
      id: '0.213923',
      placeholder: '123123123 1231',
      isActive: false,
    },
    {
      posIdx: 4,
      id: '0.394918',
      placeholder: '123123123 1231 123 12 31221 12 3 213',
      isActive: false,
    },
  ])
  function setActive(posIdx) {
    if (!rows.find(r => r.posIdx === posIdx)) return

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
          setActive={setActive}
        />
      ))}
    </section>
  )
}

export default Editor