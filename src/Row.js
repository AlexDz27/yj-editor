import './row.css'
import { useEffect, useRef, useState } from 'react'

function Row({ posIdx, placeholder, isActive, addRows, setCurrentlyActive }) {
  const ref = useRef(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  function handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }
  }

  useEffect(() => {
    if (isActive) ref.current.focus()
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
        onKeyDown={handleEnter}
        onFocus={() => setCurrentlyActive(posIdx)}
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