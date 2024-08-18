const utf8ToUTF16 = (x) => decodeURIComponent(escape(x));
const utf16ToUTF8 = (x) => unescape(encodeURIComponent(x));

export function getHash(code, map) {
  const btoaLength = (n) => 4 * (((n + 2) / 3) | 0);
  const kMaxURLDisplayChars = 32 * 1024; // Chrome limits URLs to 32kb in size
  const url = new URL('http://127.0.0.1/');
  url.hash = "#"; // Clear the data in the hash but leave the hash prefix
  const urlLength = url.href.length;

  // Do a cheap check to see if the URL will be too long
  let codeLength = `${code.length}\0`;
  let mapLength = `${map.length}\0`;
  let finalLength =
    urlLength +
    btoaLength(codeLength.length + code.length + mapLength.length + map.length);
  if (finalLength >= kMaxURLDisplayChars) throw "URL estimate too long";

  // Do the expensive check to see if the URL will be too long
  code = utf16ToUTF8(code);
  map = utf16ToUTF8(map);
  codeLength = `${code.length}\0`;
  mapLength = `${map.length}\0`;
  finalLength =
    urlLength +
    btoaLength(codeLength.length + code.length + mapLength.length + map.length);
  if (finalLength >= kMaxURLDisplayChars) throw "URL too long";

  // Only pay the cost of building the string now that we know it'll work
  const hash = "#" + btoa(`${codeLength}${code}${mapLength}${map}`);
  return hash;
}
