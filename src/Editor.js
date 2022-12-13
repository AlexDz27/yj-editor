import './editor.css'
import './row.css'
import { useRef, useState } from 'react'

function Editor() {
  let [moreChildren, setMoreChildren] = useState([]) // TODO: r to mm (moreRows); const
  let idx = useRef(2)

  function handleEnter(e) {  // TODO: r to m
    if (e.key === 'Enter') {
      e.preventDefault()

      let newIdx = idx.current++ // TODO: ++ | simply new line
      console.log('Enter!!!!!') // TODO: r
      setMoreChildren([...moreChildren, newIdx]) // TODO: ofc mm
    }
  }

  return (
    <section className="editor">
      <Row key={1} placeholder="Write something..." onEnter={handleEnter} />
      {moreChildren.map(c => (<Row key={c} onEnter={handleEnter} />))}
    </section>
  )
}

function Row({ placeholder, onEnter }) {
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

  return (
    <div
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={onEnter}
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