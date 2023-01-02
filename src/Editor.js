import './editor.css'
import './row.css'
import { useEffect, useRef, useState } from 'react'

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
      {moreRows.map((r, i) => <Row key={r.key} posIdx={i + 1} addRows={addRows} />)}
    </section>
  )
}

function Row({ placeholder, posIdx, addRows }) {
  const SINGLE_LINE_ROW_MAX_HEIGHT_PX = 27

  const ref = useRef(null)
  const [isWithBehavior, setIsWithBehavior] = useState(false)
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  function setBackground() {
    if (isBeingEdited) {
      unsetBackground()
      return
    }
    setIsHovered(true)
  }
  function unsetBackground() {
    setIsHovered(false)
  }

  function handleEnterAndArrows(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowDown') {
      if (isWithBehavior) {
        e.preventDefault()
        console.log('going down, behavior fired')
      }
    }
    if (e.key === 'ArrowUp') {
      if (isWithBehavior) {
        e.preventDefault()
        console.log('going up, behavior fired')
      }
    }

    unsetBackground()
  }

  useEffect(() => {
    if (posIdx === 0) {
      let range = new Range()
      range.setStart(ref.current.firstChild, 18)
      range.setEnd(ref.current.firstChild, 18)
      document.getSelection().addRange(range)
      return
    }

    ref.current.focus()
  }, [])

  return (
    <div
      ref={ref}
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnterAndArrows}
      onMouseEnter={() => {
        if (document.activeElement !== ref.current) setBackground()
      }}
      onMouseLeave={unsetBackground}
      onFocus={setBackground}
      onInput={() => {
        unsetBackground()
        setIsBeingEdited(true)
        console.log({
          'ref.current.getBoundingClientRect().height': ref.current.getBoundingClientRect().height,
          SINGLE_LINE_ROW_MAX_HEIGHT_PX,
          'ref > PX': ref.current.getBoundingClientRect().height > SINGLE_LINE_ROW_MAX_HEIGHT_PX
        })
        if (ref.current.getBoundingClientRect().height < SINGLE_LINE_ROW_MAX_HEIGHT_PX) {
          setIsWithBehavior(true)  // TODO: set to true when caret is on first or last line
        } else {
          setIsWithBehavior(false)
        }
      }}
      onBlur={() => {
        setIsBeingEdited(false)
        unsetBackground()
      }}
      onClick={unsetBackground}
      className="row"
      style={{ backgroundColor: isHovered ? '#f0f0f0' : 'initial', color: isWithBehavior ? 'red' : 'initial' }}
    >
      {placeholder}
    </div>
  )
}

export default Editor