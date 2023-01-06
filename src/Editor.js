import './editor.css'
import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, isCaretOnFirstLine, isCaretOnLastLine, isInDiapason } from './functions'

function Editor() {
  let [moreRows, setMoreRows] = useState([])

  function addRows(posIdx) {
    setMoreRows([
      ...moreRows.slice(0, posIdx),
      { key: String(Math.random()) },
      ...moreRows.slice(posIdx)
    ])
  }

  return (
    <section className="editor">
      <Row key={0} placeholder="Write something... 123 123sdak kasdsa ksakd askkas ka skdksakda skd sk dasdaks da ks 123u 12u312 u321u3 12u83 12u3 128u3 21u3 12u3 12u12u8" posIdx={0} addRows={addRows} />
      <Row key={1} placeholder="qwe qwe kqwek qwk ewkwqke kqw kqwek qwk eqwek kaskdkas ak ask dsakask ksa kkwqk ksadaksd kask ask saksak askdwqk1 123 123 123 21 j213 1230 12 j2 i3j31i j" posIdx={1} addRows={addRows} />
      <Row key={2} placeholder="123123123 123123 123 1312 12" posIdx={2} addRows={addRows} />
      {moreRows.map((r, i) => <Row key={r.key} posIdx={i + 1} addRows={addRows} />)}
    </section>
  )
}

function Row({ placeholder, posIdx, addRows }) {
  const ref = useRef(null)
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

  function handleEnterAndArrows(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addRows(posIdx)
    }

    if (e.key === 'ArrowDown') {
      // going to the 0th char
      if (isCaretOnLastLine(ref.current)) {
        if (ref.current.nextSibling === null) {e.preventDefault(); return}
        if (ref.current.nextSibling.firstChild === null) {ref.current.nextSibling.focus(); return}
        e.preventDefault()

        let xBefore = getCaretCoordinates().x
        // putting
        document.getSelection().removeAllRanges()
        let range = new Range()
        let firstNode = ref.current.nextSibling.firstChild // might be textNode or regularNode. The goal is textNode
        while (firstNode.nodeType !== 3) {
          firstNode = firstNode.firstChild
        }
        range.setStart(firstNode, 0)
        range.setEnd(firstNode, 0)
        document.getSelection().addRange(range)
        // END putting
        let xAfter = getCaretCoordinates().x
        let i = 0
        let currentNode = firstNode
        while (!isInDiapason(xBefore, xAfter, 6)) {
          let fittingRange = document.getSelection().getRangeAt(0)
          ++i
          // handle basic case - one node
          if (i <= currentNode.length) {
            fittingRange.setStart(currentNode, i)
            fittingRange.setEnd(currentNode, i)
            document.getSelection().addRange(fittingRange)
          // if there is more than one node
          } else {
            // if necessary to go up, go up until there is place to move
            while (!currentNode.nextSibling) {
              currentNode = currentNode.parentNode
            }
            // move (edge case in if - ooooooooo| and ooo| situation)
            if (currentNode.id === 'root') {
              return
            }
            currentNode = currentNode.nextSibling
            // if necessary, go down (deeper)
            while (currentNode.nodeType !== 3) {
              currentNode = currentNode.firstChild
            }
            i = 0
          }

          xAfter = getCaretCoordinates().x
        }
      }
    }
    if (e.key === 'ArrowUp') {
      // going to the last char
      if (isCaretOnFirstLine(ref.current)) {
        if (posIdx === 0) {e.preventDefault(); return}
        e.preventDefault()

        const xBefore = getCaretCoordinates().x
        // putting
        document.getSelection().removeAllRanges()
        let range = new Range()
        let lastNode = ref.current.previousSibling.lastChild // might be textNode or regularNode. The goal is textNode
        while (lastNode.nodeType !== 3) {
          lastNode = lastNode.firstChild
        }
        range.setStart(lastNode, lastNode.length)
        range.setEnd(lastNode, lastNode.length)
        document.getSelection().addRange(range)
        // END putting
        let xAfter = getCaretCoordinates().x
        let i = lastNode.length
        let currentNode = lastNode
        console.log({xBefore, xAfter})
        while (!isInDiapason(xBefore, xAfter, 6)) {
          let fittingRange = document.getSelection().getRangeAt(0)
          --i
          // handle basic case - one node
          if (i <= currentNode.length && i >= 0) {
            fittingRange.setStart(currentNode, i)
            fittingRange.setEnd(currentNode, i)
            document.getSelection().addRange(fittingRange)
            // if there is more than one node
          } else {
            // go up until there is place to move
            while (!currentNode.previousSibling) {
              currentNode = currentNode.parentNode
            }
            currentNode = currentNode.previousSibling
            // move right (to the last node) when possible (Iqwe I BzxcB situation, we need to go to BzxcB first)
            if (currentNode.nodeType === 1) {
              currentNode = currentNode.firstChild
              while (currentNode.nextSibling) {
                currentNode = currentNode.nextSibling
              }
            }
            // if necessary, go down (deeper)
            while (currentNode.nodeType !== 3) {
              currentNode = currentNode.firstChild
            }
            i = currentNode.length
          }

          xAfter = getCaretCoordinates().x
        }
      }
    }

    unsetBackground()
  }

  useEffect(() => {
    if (posIdx === 0) {
      let range = new Range()
      range.setStart(ref.current.firstChild, 18)
      range.setEnd(ref.current.firstChild, 18)
      document.getSelection().addRange(range)
      return
    }

    ref.current.focus()
  }, [])

  return (
    <div
      ref={ref}
      contentEditable="true"
      suppressContentEditableWarning="true"
      onKeyDown={handleEnterAndArrows}
      onMouseEnter={() => {
        if (document.activeElement !== ref.current) setBackground()
      }}
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
  )
}

export default Editor