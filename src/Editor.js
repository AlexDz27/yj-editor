import './editor.css'
import './row.css'
import { useRef, useState } from 'react'

function Editor() {
  return (
    <section className="editor">
      <Row placeholder="Write something..." />
      <button>qwe</button>
    </section>
  )
}

function Row({ placeholder }) {
  const htmlRef = useRef(null)
  let textRef = useRef(placeholder)
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
  function handleBackgroundOnClick() {
    if (textRef.current === placeholder) return
    if (textRef.current === '') return

    handleUnsettingBackground()
  }

  function handleEnter(e) {
    if (e.key === 'Enter') console.log('Enter!!!!!')
  }

  return (
    <div
      ref={htmlRef}
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnter}
      onMouseEnter={handleSettingBackground}
      onMouseLeave={handleUnsettingBackground}
      onFocus={handleSettingBackground}
      onInput={(e) => {
        handleUnsettingBackground()
        setIsBeingEdited(true)
        textRef.current = htmlRef.current.innerText
      }}
      onBlur={() => {
        setIsBeingEdited(false)
        handleUnsettingBackground()
      }}
      onClick={handleBackgroundOnClick}
      className="row"
      style={{backgroundColor: isHovered ? '#f0f0f0' : 'initial'}}
    >
      {textRef.current}
    </div>
  )
}

export default Editor