import './editor.css'
import './row.css'
import { useRef, useState } from 'react'

function Editor() {
  let [moreRows, setMoreRows] = useState([])

  function addRows() {
    setMoreRows([...moreRows, {key: String(Math.random())}])
  }

  return (
    <section className="editor">
      <Row key={1} placeholder="Write something..." posIdx={1} addRows={addRows} />
      {moreRows.map((rObj, i) => <Row key={rObj.key} posIdx={i + 2} addRows={addRows} />)}
    </section>
  )
}

function Row({ placeholder, addRows }) {
  const ref = useRef(null)
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

  function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows()
    }

    unsetBackground()
  }

  return (
    <div
      ref={ref}
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnter}
      onMouseEnter={() => {
        if (document.activeElement !== ref.current) setBackground()
      }}
      onMouseLeave={unsetBackground}
      onFocus={setBackground}
      onInput={() => {
        unsetBackground()
        setIsBeingEdited(true)
      }}
      onBlur={() => {
        setIsBeingEdited(false)
        unsetBackground()
      }}
      onClick={unsetBackground}
      className="row"
      style={{backgroundColor: isHovered ? '#f0f0f0' : 'initial'}}
    >
      {placeholder}
    </div>
  )
}

export default Editor