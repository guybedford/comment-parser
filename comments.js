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
      if (curChar === '/'  && (lastChar !== '\\' || doubleBackslash)) {
        regex = doubleBackslash = false;
        i++;
        lastToken = lastChar = curChar;
        curChar = str.charAt(i);
      }
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
      else if (lastToken !== '}' && lastToken !== ')' && lastToken !== ']' && !lastToken.match(/\w|\d|'|"|\-|\+/)) {
        // exceptions not currently handled:
        // if (x) /foo/.exec('bar')
        // a++ /foo/.abc
        regex = true;
      }
    }
  }
  return outString + str.substr(curOutIndex);
}
