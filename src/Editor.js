import './editor.css'
import { useState } from 'react'
import Row from './Row'

function Editor() {
  let [moreRows, setMoreRows] = useState([])

  function addRows(posIdx) {
    setMoreRows([
      ...moreRows.slice(0, posIdx),
      { key: String(Math.random()) },
      ...moreRows.slice(posIdx)
    ])
  }

  return (
    <section className="editor">
      <Row key={0} placeholder="Write something... 123 123sdak kasdsa ksakd askkas ka skdksakda skd sk dasdaks da ks 123u 12u312 u321u3 12u83 12u3 128u3 21u3 12u3 12u12u8" posIdx={0} addRows={addRows} />
      <Row key={1} placeholder="qwe qwe kqwek qwk ewkwqke kqw kqwek qwk eqwek kaskdkas ak ask dsakask ksa kkwqk ksadaksd kask ask saksak askdwqk1 123 123 123 21 j213 1230 12 j2 i3j31i j" posIdx={1} addRows={addRows} />
      <Row key={2} placeholder="123123123 123123 123 1312 12" posIdx={2} addRows={addRows} />
      <Row key={3} placeholder="123123123 1231" posIdx={3} addRows={addRows} />
      <Row key={4} placeholder="123123123 1231 123 12 31221 12 3 213" posIdx={4} addRows={addRows} />
      {moreRows.map((r, i) => <Row key={r.key} posIdx={i + 1} addRows={addRows} />)}
    </section>
  )
}

export default Editor