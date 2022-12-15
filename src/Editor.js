import './editor.css'
import './row.css'
import { useState } from 'react'

function Editor() {
  let [moreRows, setMoreRows] = useState([])

  function addRows() {
    setMoreRows([...moreRows, moreRows.length + 2])
  }

  return (
    <section className="editor">
      <Row key={1} placeholder="Write something..." addRows={addRows} />
      {moreRows.map(i => <Row key={i} addRows={addRows} />)}
    </section>
  )
}

function Row({ placeholder, addRows }) {
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
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnter}
      onMouseEnter={setBackground}
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