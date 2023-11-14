export default function formatText(text) {
  if (!text) return text;
  
  const replacements = {
    '&#196;': 'Ä',
    '&#197;': 'Å',
    '&#214;': 'Ö',
    '&#228;': 'ä',
    '&#229;': 'å',
    '&#246;': 'ö',
    '&#38;': '&',
    '&#39;': "'",
  };

  // probably need more replacements for all edge cases or beter regex solution

  return text.replace(/&#(?:\d+|x[a-fA-F]+);/g, (match) => {
    return replacements[match] || match;
  });
}
