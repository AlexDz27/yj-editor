import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, isCaretOnFirstLine, isCaretOnLastLine, setCaretAccordingToPrevXCoord, setCaretAccordingToPrevXCoordFromEnd } from './functions'

function Row({ posIdx, id, placeholder, isActive, xBeforeRemembered, navIntentToGoUp, currentlyDraggedRowPosIdx, addRows, setActive, setRowsAfterDragAndDrop }) {
  const isClicked = useRef(false)
  const ref = useRef(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  const [whichDropZoneBorderIsHighlighted, setWhichDropZoneBorderIsHighlighted] = useState(null)

  function handleEnterAndArrows(e) {
    navIntentToGoUp.current = false

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowUp') {
      if (isCaretOnFirstLine(ref.current)) {
        e.preventDefault()
        xBeforeRemembered.current = getCaretCoordinates().x
        navIntentToGoUp.current = true
        setActive(posIdx - 1)
      }
    }

    if (e.key === 'ArrowDown') {
      if (isCaretOnLastLine(ref.current)) {
        e.preventDefault()
        xBeforeRemembered.current = getCaretCoordinates().x
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
    <div
      className="outerRow"
      draggable
      data-posidx={posIdx}
      style={{[`border${whichDropZoneBorderIsHighlighted}`]: '5px solid #14c4e396'}}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({posIdx, id, placeholder, isActive}))
        currentlyDraggedRowPosIdx.current = posIdx
      }}
      onDrop={(e) => {
        e.preventDefault()

        const droppedRow = JSON.parse(e.dataTransfer.getData('text/plain'))
        droppedRow.dropDirection = whichDropZoneBorderIsHighlighted
        droppedRow.droppedOntoRowPosIdx = Number(e.currentTarget.dataset.posidx)
        setRowsAfterDragAndDrop(droppedRow)

        setWhichDropZoneBorderIsHighlighted(null)
      }}
      onDragOver={(e) => {
        // Ref #2
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        // Highlight top or bottom border to inform the user where the dragged row will be placed
        if (posIdx === currentlyDraggedRowPosIdx.current) return  // Skip highlighting if it's the row we are currently dragging
        const dropZoneRowRect = e.target.getBoundingClientRect()
        const mouseY = e.clientY
        const mouseYRelativeToDropZoneRowRect = mouseY - dropZoneRowRect.top

        if (mouseYRelativeToDropZoneRowRect > (dropZoneRowRect.bottom - dropZoneRowRect.top) / 2) {
          setWhichDropZoneBorderIsHighlighted('Bottom')
        } else {
          setWhichDropZoneBorderIsHighlighted('Top')
        }
      }}
      onDragLeave={() => setWhichDropZoneBorderIsHighlighted(null)}
    >
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
          setIsHighlighted(false)
        }}
        onMouseDown={() => isClicked.current = true}
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