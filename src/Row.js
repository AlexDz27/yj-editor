import './row.css'
import { useEffect, useRef, useState } from 'react'
import { isCaretOnFirstLine, isCaretOnLastLine } from './functions'

const BEHAVIOR = {
  SINGLE_LINE: 'SINGLE_LINE',
  MULTILINE_WITH_BR: 'MULTILINE_WITH_BR',
  MULTILINE: 'MULTILINE'
}

function Row({ posIdx, placeholder, isActive, addRows, setActive }) {
  const ref = useRef(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  function handleEnterAndArrows(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowUp') {
      if (isCaretOnFirstLine(ref.current)) {
        e.preventDefault()
        setActive(posIdx - 1)
      }
    }

    if (e.key === 'ArrowDown') {
      if (isCaretOnLastLine(ref.current)) {
        e.preventDefault()
        setActive(posIdx + 1)
      }
    }
  }

  useEffect(() => {
    if (isActive) {
      ref.current.focus()

      // Arrow navigation logic start
      let behavior
      if (isCaretOnFirstLine(ref.current) && isCaretOnLastLine(ref.current)) {
        behavior = BEHAVIOR.SINGLE_LINE
      } else if (ref.current.querySelector('br')) {
        behavior = BEHAVIOR.MULTILINE_WITH_BR
      } else {
        behavior = BEHAVIOR.MULTILINE
      }

      switch (behavior) {
        case BEHAVIOR.SINGLE_LINE:
          console.log('single-line')
          break;

        case BEHAVIOR.MULTILINE_WITH_BR:
          console.log('multiline with br')
          break;

        case BEHAVIOR.MULTILINE:
          console.log('multiline')
          break;

        default:
          console.error('Unknown behavior')
      }
    }
  }, [isActive])

  return (
    <div className="outerRow">
      <button className={'dragHandler ' + (isActive ? 'dib' : '')}>
        <div className="dragHandlerBar"></div>
        <div className="dragHandlerBar"></div>
      </button>
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning="true"
        onKeyDown={handleEnterAndArrows}
        onFocus={() => setActive(posIdx)}
        onMouseEnter={() => {
          if (isActive) {
            setIsHighlighted(false)
            return
          }

          setIsHighlighted(true)
        }}
        onMouseLeave={() => setIsHighlighted(false)}
        onClick={() => setIsHighlighted(false)}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="row"
        style={{ backgroundColor: isHighlighted ? '#f0f0f0' : 'initial' }}
      >
        {placeholder}
      </div>
    </div>
  )
}

export default Row