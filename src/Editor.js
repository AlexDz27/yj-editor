import './editor.css'
import './row.css'
import { useEffect, useRef, useState } from 'react'
import { getCaretCoordinates, getCaretIndex, isInDiapason } from './functions'

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
      <Row key={0} placeholder="Write something..." posIdx={0} addRows={addRows} />
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

    // TODO: #1 много текста?
    if (e.key === 'ArrowDown') {
      if (ref.current.nextSibling === null) {e.preventDefault(); return}
      e.preventDefault()

      let i = getCaretIndex(ref.current)
      let iXCoordBefore = getCaretCoordinates().x
      console.log({iXCoordBefore})
      document.getSelection().removeAllRanges()
      try {
        let range = new Range()
        range.setStart(ref.current.nextSibling.firstChild, i)
        range.setEnd(ref.current.nextSibling.firstChild, i)
        document.getSelection().addRange(range)
        // handle going from empty to full row [down] case
        if (i === 0) {
          ref.current.nextSibling.focus()
          return
        }
      } catch (e) {
        // TODO: exact err...
        // handle empty row case
        if (ref.current.nextSibling.firstChild === null) {
          ref.current.nextSibling.focus()
          return
        }

        let range = new Range()
        range.setStart(ref.current.nextSibling.firstChild, ref.current.nextSibling.firstChild.length)
        range.setEnd(ref.current.nextSibling.firstChild, ref.current.nextSibling.firstChild.length)
        document.getSelection().addRange(range)
        i = getCaretIndex(ref.current.nextSibling)
      }

      // TODO: rename to iXAfter, same for Before
      let iXCoordAfter = getCaretCoordinates().x
      console.log({iXCoordAfter})

      while (!isInDiapason(iXCoordBefore, iXCoordAfter, 6)) {
        document.getSelection().removeAllRanges()
        let range = new Range()
        if (iXCoordAfter > iXCoordBefore) {
          // go left
          range.setStart(ref.current.nextSibling.firstChild, --i)
          range.setEnd(ref.current.nextSibling.firstChild, i)
        } else if (iXCoordAfter < iXCoordBefore) {
          // go right
          // handle the case where going down with ooooooooooo[|] and ooooooo[|]
          try {
            range.setStart(ref.current.nextSibling.firstChild, ++i)
            range.setEnd(ref.current.nextSibling.firstChild, i)
          } catch (e) {
            // TODO: exact err...
            range.setStart(ref.current.nextSibling.firstChild, ref.current.nextSibling.firstChild.length)
            range.setEnd(ref.current.nextSibling.firstChild, ref.current.nextSibling.firstChild.length)
            document.getSelection().addRange(range)
            break
          }
        }
        document.getSelection().addRange(range)
        iXCoordAfter = getCaretCoordinates().x
      }
    }
    if (e.key === 'ArrowUp') {
      if (posIdx === 0) {e.preventDefault(); return}

      // TODO: #1 много текста?
      e.preventDefault()

      let i = getCaretIndex(ref.current)
      let iXCoordBefore = getCaretCoordinates().x
      console.log({iXCoordBefore})
      document.getSelection().removeAllRanges()
      try {
        let range = new Range()
        range.setStart(ref.current.previousSibling.firstChild, i)
        range.setEnd(ref.current.previousSibling.firstChild, i)
        document.getSelection().addRange(range)
        // handle going from empty to full row [up] case
        if (i === 0) {
          ref.current.previousSibling.focus()
          return
        }
      } catch (e) {
        // TODO: exact err...
        // handle empty row case
        if (ref.current.previousSibling.firstChild === null) {
          ref.current.previousSibling.focus()
          return
        }

        let range = new Range()
        range.setStart(ref.current.previousSibling.firstChild, ref.current.previousSibling.firstChild.length)
        range.setEnd(ref.current.previousSibling.firstChild, ref.current.previousSibling.firstChild.length)
        document.getSelection().addRange(range)
        i = getCaretIndex(ref.current.previousSibling)
      }

      let iXCoordAfter = getCaretCoordinates().x
      console.log({iXCoordAfter})

      while (!isInDiapason(iXCoordBefore, iXCoordAfter, 6)) {
        console.log('not in d')
        document.getSelection().removeAllRanges()
        let range = new Range()
        if (iXCoordAfter > iXCoordBefore) {
          // go left
          range.setStart(ref.current.previousSibling.firstChild, --i)
          range.setEnd(ref.current.previousSibling.firstChild, i)
        } else if (iXCoordAfter < iXCoordBefore) {
          // go right
          // handle the case where going up with ooooooo[|] and ooooooooooo[|]
          try {
            range.setStart(ref.current.previousSibling.firstChild, ++i)
            range.setEnd(ref.current.previousSibling.firstChild, i)
          } catch (e) {
            // TODO: exact err...
            console.log({e})
            console.log('somewhere')
            // handle nextSibling case
            if (ref.current.previousSibling.firstChild.nextSibling.nodeType === 1) {
              /* probably i need to put here the whole logic..... */
              i = 0
              range.setStart(ref.current.previousSibling.firstChild.nextSibling.firstChild, ++i)
              range.setEnd(ref.current.previousSibling.firstChild.nextSibling.firstChild, i)
              document.getSelection().addRange(range)
              break
            }
            
            range.setStart(ref.current.previousSibling.firstChild, ref.current.previousSibling.firstChild.length)
            range.setEnd(ref.current.previousSibling.firstChild, ref.current.previousSibling.firstChild.length)
            document.getSelection().addRange(range)
            break
          }
        }
        document.getSelection().addRange(range)
        iXCoordAfter = getCaretCoordinates().x
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
      onClick={() => {
        unsetBackground()
        const iXCoordOnClick = getCaretCoordinates().x
        console.log({iXCoordOnClick})
      }}
      className="row"
      style={{ backgroundColor: isHovered ? '#f0f0f0' : 'initial' }}
    >
      {placeholder}
    </div>
  )
}

export default Editor