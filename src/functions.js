import { TEXT_NODE_TYPE, LEFT_EXTREME_EDGE_POINT, PERFECT_DIAPASON_FOR_CHARS } from './constants'

export function setCaretAccordingToPrevXCoord(element, prevXCoord) {
  if (hasElementBrAsFirstOrLastNode(element)) {
    putCaretAtStartOfElementWithBrAsFirstNode(element)
    return
  }

  putCaretAtStartOfElement(element)

  adjustCaret(element, prevXCoord)


  function adjustCaret(element, xBefore) {
    let xAfter = getCaretCoordinates().x
    const lastChild = element.lastChild
    let lastChildTextNode = lastChild
    while (lastChildTextNode.nodeType !== TEXT_NODE_TYPE) {
      lastChildTextNode = lastChildTextNode.lastChild
    }
    let currentIteratingNode = element.firstChild
    while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
      currentIteratingNode = currentIteratingNode.firstChild
    }

    let caretPos = 0    
    while (!isInDiapason(xBefore, xAfter)) {
      let adjustingRange = document.getSelection().getRangeAt(0)
      caretPos++
      // handle basic case - one node
      if (caretPos <= currentIteratingNode.length) {
        adjustingRange.setStart(currentIteratingNode, caretPos)
        adjustingRange.setEnd(currentIteratingNode, caretPos)
        document.getSelection().addRange(adjustingRange)
      // if there is more than one node
      } else {
        // exit out of logic if we reached the end of row
        if (currentIteratingNode === lastChildTextNode) return

        // if necessary to go up, go up until there is place to move
        while (!currentIteratingNode.nextSibling) {
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
  }
}

export function setCaretAccordingToPrevXCoordFromEnd(element, prevXCoord) {
  if (hasElementBrAsFirstOrLastNode(element)) {
    putCaretAtEndOfElementWithBrAsLastNode(element)
    return
  }

  putCaretAtEndOfElement(element)

  // EC when [up] 'oooooooo'| and 'oooo'|
  if (prevXCoord > getCaretCoordinates().x) return
  adjustCaretFromEnd(element, prevXCoord)


  function adjustCaretFromEnd(element, xBefore) {
    let xAfter = getCaretCoordinates().x
    const lastChild = element.lastChild
    let currentIteratingNode = lastChild

    while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
      currentIteratingNode = currentIteratingNode.lastChild
    }
    let caretPos = currentIteratingNode.length
    while (!isInDiapason(xBefore, xAfter)) {
      let adjustingRange = document.getSelection().getRangeAt(0)
      caretPos--
      // handle basic case - one node
      if (caretPos >= 0) {
        adjustingRange.setStart(currentIteratingNode, caretPos)
        adjustingRange.setEnd(currentIteratingNode, caretPos)
        document.getSelection().addRange(adjustingRange)
      // if there is more than one node (if we arrived at start of node)
      } else {
        while (!currentIteratingNode.previousSibling) {
          currentIteratingNode = currentIteratingNode.parentNode
        }

        // move
        currentIteratingNode = currentIteratingNode.previousSibling

        // drill
        while (currentIteratingNode.nodeType !== TEXT_NODE_TYPE) {
          currentIteratingNode = currentIteratingNode.lastChild
        }

        caretPos = currentIteratingNode.length
      }

      xAfter = getCaretCoordinates().x
    }
  }
}

export function putCaretAtStartOfElementWithBrAsFirstNode(element) {
  document.getSelection().removeAllRanges()
  let range = new Range()
  let firstNode = element.firstChild
  range.setStart(firstNode, 0)
  range.setEnd(firstNode, 0)
  document.getSelection().addRange(range)
}
export function putCaretAtEndOfElementWithBrAsLastNode(element) {
  document.getSelection().removeAllRanges()
  let range = new Range()
  let lastNode = element.lastChild
  // Ref 4
  while (lastNode.hasChildNodes()) {  // if needed, drilling until br is found
    lastNode = lastNode.lastChild
  }
  range.setStart(lastNode, lastNode.length)
  range.setEnd(lastNode, lastNode.length)
  document.getSelection().addRange(range)
}

export function hasElementBrAsFirstOrLastNode(element) {
  const firstNode = element.firstChild
  if (firstNode.nodeName === 'BR') return true

  const lastNode = element.lastChild
  if (lastNode.nodeName === 'BR') return true

  // check if br is present inside tag type nodes at start or end
  let iteratorNode = firstNode
  while (iteratorNode.hasChildNodes()) {
    iteratorNode = iteratorNode.firstChild
  }
  if (iteratorNode.nodeName === 'BR') return true

  iteratorNode = lastNode
  while (iteratorNode.hasChildNodes()) {
    iteratorNode = iteratorNode.lastChild
  }
  if (iteratorNode.nodeName === 'BR') return true
  
  return false
}

export function putCaretAtStartOfElement(el) {
  document.getSelection().removeAllRanges()
  let range = new Range()
  let firstNode = el.firstChild // might be textNode or regularNode. The goal is textNode
  while (firstNode.nodeType !== TEXT_NODE_TYPE) {
    firstNode = firstNode.firstChild
  }
  range.setStart(firstNode, 0)
  range.setEnd(firstNode, 0)
  document.getSelection().addRange(range)
}

export function putCaretAtEndOfElement(el) {
  document.getSelection().removeAllRanges()
  let range = new Range()
  let lastNode = el.lastChild // might be textNode or regularNode. The goal is textNode
  while (lastNode.nodeType !== TEXT_NODE_TYPE) {
    lastNode = lastNode.lastChild
  }
  range.setStart(lastNode, lastNode.length)
  range.setEnd(lastNode, lastNode.length)
  document.getSelection().addRange(range)
}

export function getCaretIndex(element) {
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      // Store the original range
      const range = window.getSelection().getRangeAt(0);
      // Clone the range
      const preCaretRange = range.cloneRange();
      // Select all textual contents from the contenteditable element
      preCaretRange.selectNodeContents(element);
      // And set the range end to the original clicked position
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      // Return the text length from contenteditable start to the range end
      position = preCaretRange.toString().length;
    }
  }
  return position;
}

export function isCaretOnFirstLine(element) {
  if (element.ownerDocument.activeElement !== element) return false

  // Get the client rect of the current selection
  let window = element.ownerDocument.defaultView
  let selection = window.getSelection()
  if (selection.rangeCount === 0) return false

  let originalCaretRange = selection.getRangeAt(0)

  // Ref #1
  if (originalCaretRange.startContainer.nodeName === 'BR' && originalCaretRange.startContainer === element.firstChild) {
    return true
  }
  if (originalCaretRange.startContainer.nodeName === 'BR' && element.lastChild.nodeName === 'BR') {
    return false
  }
  if (originalCaretRange.startContainer === element && originalCaretRange.startOffset > 0) {
    return false
  }

  // Bail if there is text selected
  if (originalCaretRange.toString().length > 0) return false

  let originalCaretRect = originalCaretRange.getBoundingClientRect()

  // Create a range at the end of the last text node
  let startOfElementRange = element.ownerDocument.createRange()
  startOfElementRange.selectNodeContents(element)

  // The endContainer might not be an actual text node,
  // try to find the last text node inside
  let startContainer = startOfElementRange.endContainer
  let startOffset = 0
  while (startContainer.hasChildNodes() && !(startContainer instanceof Text)) {
    startContainer = startContainer.firstChild
  }

  startOfElementRange.setStart(startContainer, startOffset)
  startOfElementRange.setEnd(startContainer, startOffset)
  let endOfElementRect = startOfElementRange.getBoundingClientRect()

  return originalCaretRect.top === endOfElementRect.top
}

export function isCaretOnLastLine(element) {
  if (element.ownerDocument.activeElement !== element) return false

  // Get the client rect of the current selection
  let window = element.ownerDocument.defaultView
  let selection = window.getSelection()
  if (selection.rangeCount === 0) return false

  let originalCaretRange = selection.getRangeAt(0)

  // Ref #1
  // ???????? ???????????? ?? ?????????? br 
  if (originalCaretRange.startContainer.nodeName === 'BR') {
    // ?? br ???? ?????????????????? ???????????? ??????????-???? ??????
    if (originalCaretRange.startContainer === element.lastChild) return true

    // ???????? br ?????????????????? ???????????? ??????????-???? ??????
    let drilledLastChild = element
    while (drilledLastChild.hasChildNodes()) {
      drilledLastChild = drilledLastChild.lastChild
    }
    if (originalCaretRange.startContainer === drilledLastChild) return true

    return false
  }
  
  if (originalCaretRange.startContainer === element && originalCaretRange.startOffset < element.children.length) {
    // Ref #1.1
    const regex = new RegExp('^(<br>)*$')
    if (regex.test(element.innerHTML) && originalCaretRange.startOffset <= (element.children.length - 1)) {
      return true
    }

    return false
  }

  // Bail if there is a selection
  if (originalCaretRange.toString().length > 0) return false

  let originalCaretRect = originalCaretRange.getBoundingClientRect()

  // Create a range at the end of the last text node
  let endOfElementRange = document.createRange()
  endOfElementRange.selectNodeContents(element)

  // The endContainer might not be an actual text node,
  // try to find the last text node inside
  let endContainer = endOfElementRange.endContainer
  let endOffset = 0
  while (endContainer.hasChildNodes() && !(endContainer instanceof Text)) {
    endContainer = endContainer.lastChild
    endOffset = endContainer.length ?? 0
  }

  endOfElementRange.setEnd(endContainer, endOffset)
  endOfElementRange.setStart(endContainer, endOffset)
  let endOfElementRect = endOfElementRange.getBoundingClientRect()

  return originalCaretRect.bottom === endOfElementRect.bottom
}

export function getCaretCoordinates() {
  let x = 0,
    y = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
        // probably i should write else bc bug w/ ceditable - if no content, rect is undefined
      } else {
        x = LEFT_EXTREME_EDGE_POINT
      }
    }
  }
  return { x, y };
}

export function isInDiapason(value1, value2, diapason = PERFECT_DIAPASON_FOR_CHARS) {
  let delta = value1 - value2
  if (Math.abs(delta) < diapason) return true
  return false
}