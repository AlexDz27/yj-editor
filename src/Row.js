import './row.css'
import { useRef, useState } from 'react'

function Row({ id, placeholder, isCurrentlyActive, setCurrentlyActive }) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="outerRow">
      <button className={'dragHandler ' + (isCurrentlyActive ? 'dib' : '')}>
        <div className="dragHandlerBar"></div>
        <div className="dragHandlerBar"></div>
      </button>
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning="true"
        onFocus={() => setCurrentlyActive(id)}
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