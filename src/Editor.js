import './editor.css'
import { useRef, useState } from 'react'
import Row from './Row'
import { LEFT_EXTREME_EDGE_POINT } from './constants'

function Editor() {
  const navIntentToGoUp = useRef(false)
  const xBeforeRemembered = useRef(LEFT_EXTREME_EDGE_POINT)
  const [rows, setRows] = useState([
    {
      posIdx: 0,
      id: '0.232123',
      placeholder: 'Write something... 123 123sdak kasdsa ksakd askkas ka skdksakda skd sk dasdaks da ks 123u 12u312 u321u3 12u83 12u3 128u3 21u3 12u3 12u12u8',
      isActive: false,
    },
    {
      posIdx: 1,
      id: '0.423001',
      placeholder: 'qwe qwe kqwek qwk ewkwqke kqw kqwek qwk eqwek kaskdkas ak ask dsakask ksa kkwqk ksadaksd kask ask saksak askdwqk1 123 123 123 21 j213 1230 12 j2 i3j31i j',
      isActive: true,
    },
    {
      posIdx: 2,
      id: '0.623701',
      placeholder: '123123123 123123 123 1312 12',
      isActive: false,
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
    if (!rows.find(r => r.posIdx === posIdx)) return  // EC for 0th and last row - we just do nothing

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

  const currentlyDraggedRowPosIdx = useRef(null)
  // TODO: Ref 3 - describe general algo
  function setRowsAfterDragAndDrop(droppedRow) {
    const rowsBeingUpdated = [...rows]
    const rowsWithoutDroppedRow = rowsBeingUpdated.filter(row => row.id !== droppedRow.id)

    // Decide firstHalf and secondHalf
    const droppedOntoRowIdx = rowsWithoutDroppedRow.findIndex(row => row.posIdx === droppedRow.droppedOntoRowPosIdx)
    let firstHalf
    let secondHalf
    if (droppedRow.dropDirection === 'Top') {
      const rowsBeforeDroppedOntoRow = rowsWithoutDroppedRow.slice(0, droppedOntoRowIdx)
      firstHalf = rowsBeforeDroppedOntoRow
      secondHalf = rowsWithoutDroppedRow.slice(droppedOntoRowIdx)
    } else if (droppedRow.dropDirection === 'Bottom') {
      const rowsAfterDroppedOntoRow = rowsWithoutDroppedRow.slice(0, droppedOntoRowIdx + 1)
      firstHalf = rowsAfterDroppedOntoRow
      secondHalf = rowsWithoutDroppedRow.slice(droppedOntoRowIdx + 1)
    }

    // Glue firstHalf, droppedRow, and secondHalf together
    const mergedHalvesWithDroppedRow = firstHalf.concat(droppedRow, secondHalf)
    // Recalculate posIdxes
    for (let i = 0; i < mergedHalvesWithDroppedRow.length; i++) {
      const row = mergedHalvesWithDroppedRow[i]
      row.posIdx = i
    }

    setRows(mergedHalvesWithDroppedRow)
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
          xBeforeRemembered={xBeforeRemembered}
          navIntentToGoUp={navIntentToGoUp}
          currentlyDraggedRowPosIdx={currentlyDraggedRowPosIdx}
          addRows={addRows}
          setActive={setActive}
          setRowsAfterDragAndDrop={setRowsAfterDragAndDrop}
        />
      ))}
    </section>
  )
}

export default Editor