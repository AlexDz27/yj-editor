import { NAV_BEHAVIOR, TEXT_NODE_TYPE, LEFT_EXTREME_EDGE_POINT, PERFECT_DIAPASON_FOR_CHARS } from './constants'

export function setCaretAccordingToPrevXCoord(element, prevXCoord) {
  putCaretAtStartOfElement(element)

  // Arrow navigation logic start
  let behavior
  if (isCaretOnFirstLine(element) && isCaretOnLastLine(element)) {
    behavior = NAV_BEHAVIOR.SINGLE_LINE
  } else if (element.querySelector('br')) {
    behavior = NAV_BEHAVIOR.MULTILINE_WITH_BR
  } else {
    behavior = NAV_BEHAVIOR.MULTILINE
  }

  switch (behavior) {
    // TODO: ( rewrite into MULTILINE_OR_SINGLE_LINE
    case NAV_BEHAVIOR.MULTILINE:
    case NAV_BEHAVIOR.SINGLE_LINE:
      adjustCaret(element, prevXCoord)
      break;
    
    case NAV_BEHAVIOR.MULTILINE_WITH_BR:
      console.log('multiline with br')
      console.log('TODO: implement multiline with br')
      break;

    default:
      console.error('Unknown behavior')
  }


  function adjustCaret(element, xBefore) {
    let xAfter = getCaretCoordinates().x
    const lastChild = element.lastChild
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
        // EC when 'oooooooo'| and 'oooo'| or 'oooooo'| and B'oooo'B|
        if (currentIteratingNode === lastChild || currentIteratingNode.parentNode === lastChild) return
        
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



export function putCaretAtStartOfElement(el) {
  document.getSelection().removeAllRanges()
  let range = new Range()
  let firstNode = el.firstChild // might be textNode or regularNode. The goal is textNode
  while (firstNode.nodeType !== 3) {
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
  while (lastNode.nodeType !== 3) {
    lastNode = lastNode.firstChild
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