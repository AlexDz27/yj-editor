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

/**
 * Check if the caret is on the last line of an element
 * Returns `false` when the caret is part of a selection
 *
 * @param {Element} element
 * @return {boolean}
 */
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

export function setCaretAtStartEnd( node, atEnd ) {
  const sel = document.getSelection();
  node = node.firstChild;

  if( sel.rangeCount ){
    ['Start', 'End'].forEach(pos =>
      sel.getRangeAt(0)["set" + pos](node, atEnd ? node.length : 0)
    )
  }
}