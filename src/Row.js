import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, isCaretOnFirstLine, isCaretOnLastLine, setCaretAccordingToPrevXCoord, setCaretAccordingToPrevXCoordFromEnd } from './functions'

function Row({ posIdx, placeholder, isActive, xBeforeRemembered, navIntentToGoUp, addRows, setActive, rememberXBefore }) {
  const isClicked = useRef(false)
  const ref = useRef(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  function handleEnterAndArrows(e) {
    navIntentToGoUp.current = false

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowUp') {
      if (isCaretOnFirstLine(ref.current)) {
        e.preventDefault()
        rememberXBefore(getCaretCoordinates().x)
        navIntentToGoUp.current = true
        setActive(posIdx - 1)
      }
    }

    if (e.key === 'ArrowDown') {
      if (isCaretOnLastLine(ref.current)) {
        e.preventDefault()
        rememberXBefore(getCaretCoordinates().x)
        setActive(posIdx + 1)
      }
    }
  }

  useEffect(() => {
    // EC: we are on last row, hit enter -> new row appears, but putCaret func doesn't work bc
    // it needs a .firstChild. Thus, we simply focus and return.
    if (isActive && !ref.current.firstChild) {
      ref.current.focus()
      return
    }

    //               isClicked prevents the logic from firing on click - that is undesirable
    if (isActive && !isClicked.current) {
      if (navIntentToGoUp.current) {
        setCaretAccordingToPrevXCoordFromEnd(ref.current, xBeforeRemembered.current)
      } else {
        setCaretAccordingToPrevXCoord(ref.current, xBeforeRemembered.current)
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
        onKeyDown={(e) => {
          isClicked.current = false
          handleEnterAndArrows(e)
        }}
        onBlur={() => isClicked.current = false}
        onFocus={() => setActive(posIdx)}
        onMouseEnter={() => {
          if (isActive) {
            setIsHighlighted(false)
            return
          }

          setIsHighlighted(true)
        }}
        onMouseLeave={() => setIsHighlighted(false)}
        onClick={() => {
          isClicked.current = true
          setIsHighlighted(false)
        }}
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