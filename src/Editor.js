import './editor.css'
import './row.css'
import { useRef, useState } from 'react'

function Editor() {
  let [moreChildren, setMoreChildren] = useState([])
  let moreChildrenRef = useRef(moreChildren)
  let idx = useRef(2)

  function onEnter() { // TODO: m
    // debugger
    moreChildrenRef.current = [...moreChildrenRef.current, <Row key={idx.current++} onEnter={onEnter} />]
    setMoreChildren(moreChildrenRef.current) // TODO: might be wrong
  }

  return (
    <section className="editor">
      <Row key={1} placeholder="Write something..." onEnter={onEnter} />
      {moreChildren}
    </section>
  )
}

function Row({ placeholder, onEnter }) { // TODO: m onEnter
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

  function handleEnter(e) { // TODO: m
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onEnter()
    }
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