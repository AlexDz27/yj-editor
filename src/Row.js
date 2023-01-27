import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, isCaretOnFirstLine, isCaretOnLastLine, setCaretAccordingToPrevXCoord, setCaretAccordingToPrevXCoordFromEnd } from './functions'
import { TEXT_NODE_TYPE } from './constants'

function Row({ posIdx, id, text, isActive, xBeforeRemembered, navIntentToGoUp, currentlyDraggedRowPosIdx, addRow, setActive, setRowsAfterDragAndDrop }) {
  const isClicked = useRef(false)
  const ref = useRef(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  const [whichDropZoneBorderIsHighlighted, setWhichDropZoneBorderIsHighlighted] = useState(null)

  function handleEnterAndArrows(e) {
    navIntentToGoUp.current = false

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      const selection = window.getSelection()
      if (!selection.isCollapsed) return
      console.log(selection)
      // TODO: handle case with from my notebook
      let leftOverText = '' // TODO: ref down
      // Simple case
      console.log('selection.anchorOffset', selection.anchorOffset, 'selection.anchorNode.length', selection.anchorNode.length)
      console.log('nextSibl', selection.anchorNode.nextSibling)
      if (selection.anchorOffset < selection.anchorNode.length) {
        console.log('there is leftOverText')
      // Nodes case
      } else if (selection.anchorNode.nextSibling) {
        if (selection.anchorNode.nextSibling.nodeName === 'BR') return
        let anchorNodeNextSiblingTextNode = selection.anchorNode.nextSibling
        while (anchorNodeNextSiblingTextNode.nodeType !== TEXT_NODE_TYPE) {
          anchorNodeNextSiblingTextNode = anchorNodeNextSiblingTextNode.firstChild
        }
        console.log('nextSiblText', anchorNodeNextSiblingTextNode, 'nextSiblTextLen', anchorNodeNextSiblingTextNode.length)
        if (anchorNodeNextSiblingTextNode.length > 0) {
          console.log('there is leftOverText in nextSibling node')
        }
      // If caret is stuck, e.g. Bqwe|BUIzxcIU  
      } else if (!selection.anchorNode.nextSibling) {
        let iteratorNode = selection.anchorNode
        while (!iteratorNode.parentNode?.classList?.contains('row')) {
          iteratorNode = iteratorNode.parentNode
        }
        const outerAnchorNode = iteratorNode
        // TODO: мне навероно надо этот элс-иф переносить как-то наверх, тк
        // вроде как мне нужна логика из Nodes case
        if (outerAnchorNode.nextSibling) {  // TODO: вроде работает, но один раз как будто был баг что не доходил код до сюда...
          console.log('we can continue onto next node to find if it contains some left over text')
          console.log('ref.cur.lastChild', ref.current.lastChild, 'ref.current.lastChild.childNodes.length', ref.current.lastChild.childNodes.length)
          let howManyCharsOrNodesToSelect
          // if focus node is a node
          if (ref.current.lastChild.childNodes.length > 0) {
            howManyCharsOrNodesToSelect = ref.current.lastChild.childNodes.length
          // if focus node is a text
          } else {
            howManyCharsOrNodesToSelect = ref.current.lastChild.length
          }
          selection.setBaseAndExtent(selection.anchorNode, selection.anchorOffset, ref.current.lastChild, howManyCharsOrNodesToSelect)
        }
      }
      // TODO: ref: func isTextLeftOver() <- logic

      // addRow(posIdx, leftOverText)
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
        e.dataTransfer.setData('text/plain', JSON.stringify({posIdx, id, text, isActive}))
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
        {text}
      </div>
    </div>
  )
}

export default Row