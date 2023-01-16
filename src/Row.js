import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, isCaretOnFirstLine, isCaretOnLastLine, isInDiapason, putCaretAtEndOfElement, putCaretAtStartOfElement } from './functions'
import { NAV_BEHAVIOR, TEXT_NODE_TYPE } from './constants'

function Row({ posIdx, placeholder, isActive, xBeforeRemembered, addRows, setActive, rememberXBefore }) {
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
        rememberXBefore(getCaretCoordinates().x)
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
    if (isActive) {
      ref.current.focus()

      // Arrow navigation logic start
      let behavior
      if (isCaretOnFirstLine(ref.current) && isCaretOnLastLine(ref.current)) {
        behavior = NAV_BEHAVIOR.SINGLE_LINE
      } else if (ref.current.querySelector('br')) {
        behavior = NAV_BEHAVIOR.MULTILINE_WITH_BR
      } else {
        behavior = NAV_BEHAVIOR.MULTILINE
      }

      const xBefore = xBeforeRemembered.current
      let xAfter = getCaretCoordinates().x
      let currentIteratingNode
      switch (behavior) {
        case NAV_BEHAVIOR.SINGLE_LINE:
          console.log('single-line')

          putCaretAtEndOfElement(ref.current)
          xAfter = getCaretCoordinates().x
          if (xBefore > xAfter) return

          putCaretAtStartOfElement(ref.current)
          xAfter = getCaretCoordinates().x
          currentIteratingNode = ref.current.firstChild
          while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
            currentIteratingNode = currentIteratingNode.firstChild
          }
          let caretPos2 = 0
          while (!isInDiapason(xBefore, xAfter)) {
            let adjustingRange = document.getSelection().getRangeAt(0)
            caretPos2++
            // handle basic case - one node
            if (caretPos2 < currentIteratingNode.length) {
              adjustingRange.setStart(currentIteratingNode, caretPos2)
              adjustingRange.setEnd(currentIteratingNode, caretPos2)
              document.getSelection().addRange(adjustingRange)
            // if there is more than one node
            } else {
              // if necessary to go up, go up until there is place to move
              while (!currentIteratingNode.nextSibling) {  // TODO: ( я тут почему-то предполагаю что всегда есть nextSibling
                // debugger
                currentIteratingNode = currentIteratingNode.parentNode
              }
              // debugger
              console.log({firstMove: currentIteratingNode})
              // move
              currentIteratingNode = currentIteratingNode.nextSibling
              console.log({secondMove: currentIteratingNode})
              // debugger
              // if necessary, go down (deeper)
              if (!currentIteratingNode) {
                debugger
              }
              if (currentIteratingNode === null) {
                debugger
              }
              // debugger
              if (!currentIteratingNode) return
              while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
                currentIteratingNode = currentIteratingNode.firstChild
              }
              caretPos2 = 0
            }

            xAfter = getCaretCoordinates().x
          }
          break;

        case NAV_BEHAVIOR.MULTILINE_WITH_BR:
          console.log('multiline with br')
          break;

        case NAV_BEHAVIOR.MULTILINE:
          console.log('multiline')
          currentIteratingNode = ref.current.firstChild
          while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
            currentIteratingNode = currentIteratingNode.firstChild
          }
          let caretPos = 0
          while (!isInDiapason(xBefore, xAfter)) {
            let adjustingRange = document.getSelection().getRangeAt(0)
            caretPos++
            // handle basic case - one node
            if (caretPos < currentIteratingNode.length) {
              adjustingRange.setStart(currentIteratingNode, caretPos)
              adjustingRange.setEnd(currentIteratingNode, caretPos)
              document.getSelection().addRange(adjustingRange)
            // if there is more than one node
            } else {
              // if necessary to go up, go up until there is place to move
              while (!currentIteratingNode.nextSibling) {
                console.log({'currentIteratingNode.parentNode': currentIteratingNode.parentNode})
                currentIteratingNode = currentIteratingNode.parentNode
              }
              // move
              currentIteratingNode = currentIteratingNode.nextSibling
              // if necessary, go down (deeper)
              while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
                currentIteratingNode = currentIteratingNode.firstChild
              }
              caretPos = 0
            }

            xAfter = getCaretCoordinates().x
          }
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