module.exports = function removeComments(str) {
  // output
  var curOutIndex = 0,
    outString = '';
  
  // mode variables
  var singleQuote = false,
    doubleQuote = false,
    regex = false,
    blockComment = false,
    doubleBackslash = false,
    lineComment = false;
  
  // character buffer
  var lastChar;
  var curChar = '';
  
  for (var i = 0, l = str.length; i <= l; i++) {
    lastChar = curChar;
    curChar = str.charAt(i);
  
    if (curChar === '\n' || curChar === '\r' || curChar === '') {
      regex = doubleQuote = singleQuote = doubleBackslash = false;
      if (lineComment) {
        curOutIndex = i + 1;
        lineComment = false;
      }
      continue;
    }
  
    if (singleQuote || doubleQuote || regex) {
      if (curChar == '\\' && lastChar == '\\')
        doubleBackslash = !doubleBackslash;
    }
  
    if (singleQuote) {
      if (curChar === "'" && (lastChar !== '\\' || doubleBackslash))
        singleQuote = doubleBackslash = false;
    }
  
    else if (doubleQuote) {
      if (curChar === '"' && (lastChar !== '\\' || doubleBackslash))
        doubleQuote = doubleBackslash = false;
    }
  
    else if (regex) {
      if (curChar === '/'  && (lastChar !== '\\' || doubleBackslash))
        regex = doubleBackslash = false;
    }
  
    else if (blockComment) {
      if (curChar === '/' && lastChar === '*') {
        blockComment = false;
        curOutIndex = i + 1;
      }
    }
  
    else if (!lineComment) {
      doubleQuote = curChar === '"';
      singleQuote = curChar === "'";
  
      if (lastChar !== '/')
        continue;
      
      if (curChar === '*') {
        blockComment = true;
        outString += str.substring(curOutIndex, i - 1);
        i++;
        lastChar = curChar;
        curChar = str.charAt(i);
      }
      else if (curChar === '/') {
        lineComment = true;
        outString += str.substring(curOutIndex, i - 1);
      }
      else {
        regex = true;
      }
    }
  }
  return outString + str.substr(curOutIndex);
}
