import './editor.css'
import './row.css'
import { useState } from 'react'

function Editor() {
  return (
    <section className="editor">
      <Row placeholder="Write something..." />
      <button>qwe</button>
    </section>
  )
}

function Row({ placeholder }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  function handleSettingBackground() {
    if (isBeingEdited) {
      handleUnsettingBackground()
      return
    }
    setIsHovered(true)
  }
  function handleUnsettingBackground() {  // TODO: r to unsetBackground
    setIsHovered(false)
  }

  function handleEnter(e) {
    if (e.key === 'Enter') console.log('Enter!!!!!')
  }

  return (
    <div
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnter}
      onMouseEnter={handleSettingBackground}
      onMouseLeave={handleUnsettingBackground}
      onFocus={handleSettingBackground}
      onInput={() => {
        handleUnsettingBackground()
        setIsBeingEdited(true)
      }}
      onBlur={() => {
        setIsBeingEdited(false)
        handleUnsettingBackground()
      }}
      onClick={() => console.log('todo: 123')}
      className="row"
      style={{backgroundColor: isHovered ? '#f0f0f0' : 'initial'}}
    >
      {placeholder}
    </div>
  )
}

export default Editor