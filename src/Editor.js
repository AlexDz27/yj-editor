import './editor.css'
import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, getCaretIndex } from './functions'

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
      <Row key={0} placeholder="Write something..." posIdx={0} addRows={addRows} />
      {moreRows.map((r, i) => <Row key={r.key} posIdx={i + 1} addRows={addRows} />)}
    </section>
  )
}

function Row({ placeholder, posIdx, addRows }) {
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

  function handleEnterAndArrows(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    // TODO: много текста?
    if (e.key === 'ArrowDown') {
      console.log(getCaretIndex(ref.current))
      let i = getCaretIndex(ref.current)
      let caretCoordsXBefore = getCaretCoordinates().x
      console.log({caretCoordsXBefore})
      // TODO: #1
      e.preventDefault()
      document.getSelection().removeAllRanges()
      let range = new Range()
      range.setStart(ref.current.nextSibling.firstChild, i)
      range.setEnd(ref.current.nextSibling.firstChild, i)
      document.getSelection().addRange(range)

      console.log({caretCoordsXAfter: getCaretCoordinates().x})
      let caretCoordsXAfter = getCaretCoordinates().x
      while (caretCoordsXAfter > caretCoordsXBefore) {
        document.getSelection().removeAllRanges()
        let range = new Range()
        range.setStart(ref.current.nextSibling.firstChild, i++)
        range.setEnd(ref.current.nextSibling.firstChild, i++)
        document.getSelection().addRange(range)

        caretCoordsXBefore = getCaretCoordinates().x
      }
    }
    if (e.key === 'ArrowUp') {
      console.log(getCaretIndex(ref.current))
      let i = getCaretIndex(ref.current)
      const caretCoordsXBefore = getCaretCoordinates().x
      console.log({caretCoordsXBefore})
      // TODO: #1
      e.preventDefault()
      document.getSelection().removeAllRanges()
      let range = new Range()
      range.setStart(ref.current.previousSibling.firstChild, i)
      range.setEnd(ref.current.previousSibling.firstChild, i)
      document.getSelection().addRange(range)

      console.log({caretCoordsXAfter: getCaretCoordinates().x})
      let caretCoordsXAfter = getCaretCoordinates().x
      while (caretCoordsXAfter < caretCoordsXBefore) {
        document.getSelection().removeAllRanges()
        let range = new Range()
        range.setStart(ref.current.previousSibling.firstChild, i++)
        range.setEnd(ref.current.previousSibling.firstChild, i++)
        document.getSelection().addRange(range)

        caretCoordsXAfter = getCaretCoordinates().x
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
      }}
      onBlur={() => {
        setIsBeingEdited(false)
        unsetBackground()
      }}
      onClick={() => {
        unsetBackground()
        console.log({caretCoordsX: getCaretCoordinates().x})
      }}
      className="row"
      style={{ backgroundColor: isHovered ? '#f0f0f0' : 'initial' }}
    >
      {placeholder}
    </div>
  )
}

export default Editor