import './row.css'
import { useEffect, useRef, useState } from 'react'
import { isCaretOnFirstLine, isCaretOnLastLine } from './functions'

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
    unsetBackground()

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowDown') {
      // going to the 0th char
      if (!isCaretOnLastLine(ref.current)) return

      e.preventDefault()

      console.log('going down')
    }
    if (e.key === 'ArrowUp') {
      // going to the last char
      if (!isCaretOnFirstLine(ref.current)) return

      e.preventDefault()

      console.log('going up')
    }
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
    <div className="outerRow">
      <button className={'dragHandler ' + (isBeingEdited ? 'dib' : '')}>
        <div className="dragHandlerBar"></div>
        <div className="dragHandlerBar"></div>
      </button>
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
          setIsBeingEdited(true)
        }}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="row"
        style={{ backgroundColor: isHovered ? '#f0f0f0' : 'initial' }}
      >
        {placeholder}
      </div>
    </div>
  )
}

export default Row