module.exports = function removeComments(str) {
  // output
  // block comments replaced with equivalent whitespace
  // this is to ensure source maps remain valid
  var curOutIndex = 0,
    outString = '',
    blockCommentWhitespace = '';
  
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
  var lastToken;
  
  for (var i = 0, l = str.length; i <= l; i++) {
    lastChar = curChar;
    curChar = str.charAt(i);
  
    if (curChar === '\n' || curChar === '\r' || curChar === '') {
      regex = doubleQuote = singleQuote = doubleBackslash = false;
      if (lineComment) {
        curOutIndex = i;
        lineComment = false;
      }
      if (blockComment)
        blockCommentWhitespace += curChar;
      lastToken = '';
      continue;
    }
  
    if (lastChar !== ' ' && lastChar !== '\t')
      lastToken = lastChar;
  
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
      if (curChar === '/') {
        // a comment inside a regex immediately means we've misread the regex
        // so switch back to block mode to detect the comment
        if (str.charAt(i + 1) == '/') {
          regex = doubleBackslash = false;
        }
        else if (lastChar !== '\\' || doubleBackslash) {
          regex = doubleBackslash = false;
          i++;
          lastToken = lastChar = curChar;
          curChar = str.charAt(i);
        }
      }
    }
  
    else if (blockComment) {
      blockCommentWhitespace += ' ';
      if (curChar === '/' && lastChar === '*' && blockCommentWhitespace.length > 3) {
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
        outString += blockCommentWhitespace + str.substring(curOutIndex, i - 1);
        blockCommentWhitespace = '  ';
      }
      else if (curChar === '/') {
        lineComment = true;
        outString += blockCommentWhitespace + str.substring(curOutIndex, i - 1);
        blockCommentWhitespace = '';
      }
      else if (lastToken !== '}' && lastToken !== ')' && lastToken !== ']' && !lastToken.match(/\w|\d|'|"|\-|\+/)) {
        // detection not perfect - careful comment detection within regex is used to compensate
        // without sacrificing global comment removal accuracy
        regex = true;
      }
    }
  }
  return outString + blockCommentWhitespace + str.substr(curOutIndex);
}
        
