module.exports = function removeComments(str) {
  // output
  var curOutIndex = 0,
    outString = '';

  // mode variables
  var singleQuote = false,
    doubleQuote = false,
    regex = false,
    blockComment = false,
    lineComment = false;

  // character buffer
  var lastChar, curChar, 
    nextChar = str.charAt(0);

  for (var i = 0, l = str.length; i < l; i++) {
    lastChar = curChar;
    curChar = nextChar;
    nextChar = str.charAt(i + 1);

    if (singleQuote) {
      if (curChar === "'" && lastChar !== '\\')
        singleQuote = false;
    }

    else if (doubleQuote) {
      if (curChar === '"' && lastChar !== '\\')
        doubleQuote = false;
    }

    else if (regex) {
      if (curChar === '/'  && lastChar !== '\\')
        regex = false;
    }

    else if (blockComment) {
      if (curChar === '/' && lastChar === '*') {
        blockComment = false;
        curOutIndex = i + 1;
      }
    }
    
    else if (lineComment) {
      if (nextChar === '\n' || nextChar === '\r' || nextChar == '') {
        lineComment = false;
        curOutIndex = i + 1;
      }
    }

    else {
      doubleQuote = curChar === '"';
      singleQuote = curChar === "'";

      if (curChar !== '/')
        continue;
      
      if (nextChar === '*') {
        blockComment = true;
        outString += str.substring(curOutIndex, i);
      }
      else if (nextChar === '/') {
        lineComment = true;
        outString += str.substring(curOutIndex, i);
      }
      else {
        regex = true;
      }
    }
  }
  return outString + str.substr(curOutIndex);
}