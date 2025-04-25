/**
 * Utility functions for detecting hidden characters in text
 */

// Map of hidden character Unicode ranges and their descriptions
const HIDDEN_CHAR_MAP = {
  // Control characters (C0 Controls)
  '\u0000': { name: 'NULL', category: 'Control character' },
  '\u0001': { name: 'START OF HEADING', category: 'Control character' },
  '\u0002': { name: 'START OF TEXT', category: 'Control character' },
  '\u0003': { name: 'END OF TEXT', category: 'Control character' },
  '\u0004': { name: 'END OF TRANSMISSION', category: 'Control character' },
  '\u0005': { name: 'ENQUIRY', category: 'Control character' },
  '\u0006': { name: 'ACKNOWLEDGE', category: 'Control character' },
  '\u0007': { name: 'BELL', category: 'Control character' },
  '\u0008': { name: 'BACKSPACE', category: 'Control character' },
  '\u0009': { name: 'CHARACTER TABULATION', category: 'Control character' },
  '\u000A': { name: 'LINE FEED', category: 'Control character' },
  '\u000B': { name: 'LINE TABULATION', category: 'Control character' },
  '\u000C': { name: 'FORM FEED', category: 'Control character' },
  '\u000D': { name: 'CARRIAGE RETURN', category: 'Control character' },
  '\u000E': { name: 'SHIFT OUT', category: 'Control character' },
  '\u000F': { name: 'SHIFT IN', category: 'Control character' },
  '\u0010': { name: 'DATA LINK ESCAPE', category: 'Control character' },
  '\u0011': { name: 'DEVICE CONTROL ONE', category: 'Control character' },
  '\u0012': { name: 'DEVICE CONTROL TWO', category: 'Control character' },
  '\u0013': { name: 'DEVICE CONTROL THREE', category: 'Control character' },
  '\u0014': { name: 'DEVICE CONTROL FOUR', category: 'Control character' },
  '\u0015': { name: 'NEGATIVE ACKNOWLEDGE', category: 'Control character' },
  '\u0016': { name: 'SYNCHRONOUS IDLE', category: 'Control character' },
  '\u0017': { name: 'END OF TRANSMISSION BLOCK', category: 'Control character' },
  '\u0018': { name: 'CANCEL', category: 'Control character' },
  '\u0019': { name: 'END OF MEDIUM', category: 'Control character' },
  '\u001A': { name: 'SUBSTITUTE', category: 'Control character' },
  '\u001B': { name: 'ESCAPE', category: 'Control character' },
  
  // Information Separators (specifically requested)
  '\u001C': { name: 'INFORMATION SEPARATOR FOUR (File Separator)', category: 'Information separator' },
  '\u001D': { name: 'INFORMATION SEPARATOR THREE (Group Separator)', category: 'Information separator' },
  '\u001E': { name: 'INFORMATION SEPARATOR TWO (Record Separator)', category: 'Information separator' },
  '\u001F': { name: 'INFORMATION SEPARATOR ONE (Unit Separator)', category: 'Information separator' },
  
  // Control characters (C1 Controls)
  '\u0080': { name: 'PADDING CHARACTER', category: 'Control character' },
  '\u0081': { name: 'HIGH OCTET PRESET', category: 'Control character' },
  '\u0082': { name: 'BREAK PERMITTED HERE', category: 'Control character' },
  '\u0083': { name: 'NO BREAK HERE', category: 'Control character' },
  '\u0084': { name: 'INDEX', category: 'Control character' },
  '\u0085': { name: 'NEXT LINE', category: 'Control character' },
  '\u0086': { name: 'START OF SELECTED AREA', category: 'Control character' },
  '\u0087': { name: 'END OF SELECTED AREA', category: 'Control character' },
  '\u0088': { name: 'CHARACTER TABULATION SET', category: 'Control character' },
  '\u0089': { name: 'CHARACTER TABULATION WITH JUSTIFICATION', category: 'Control character' },
  '\u008A': { name: 'LINE TABULATION SET', category: 'Control character' },
  '\u008B': { name: 'PARTIAL LINE FORWARD', category: 'Control character' },
  '\u008C': { name: 'PARTIAL LINE BACKWARD', category: 'Control character' },
  '\u008D': { name: 'REVERSE LINE FEED', category: 'Control character' },
  '\u008E': { name: 'SINGLE SHIFT TWO', category: 'Control character' },
  '\u008F': { name: 'SINGLE SHIFT THREE', category: 'Control character' },
  '\u0090': { name: 'DEVICE CONTROL STRING', category: 'Control character' },
  '\u0091': { name: 'PRIVATE USE ONE', category: 'Control character' },
  '\u0092': { name: 'PRIVATE USE TWO', category: 'Control character' },
  '\u0093': { name: 'SET TRANSMIT STATE', category: 'Control character' },
  '\u0094': { name: 'CANCEL CHARACTER', category: 'Control character' },
  '\u0095': { name: 'MESSAGE WAITING', category: 'Control character' },
  '\u0096': { name: 'START OF GUARDED AREA', category: 'Control character' },
  '\u0097': { name: 'END OF GUARDED AREA', category: 'Control character' },
  '\u0098': { name: 'START OF STRING', category: 'Control character' },
  '\u0099': { name: 'SINGLE GRAPHIC CHARACTER INTRODUCER', category: 'Control character' },
  '\u009A': { name: 'SINGLE CHARACTER INTRODUCER', category: 'Control character' },
  '\u009B': { name: 'CONTROL SEQUENCE INTRODUCER', category: 'Control character' },
  '\u009C': { name: 'STRING TERMINATOR', category: 'Control character' },
  '\u009D': { name: 'OPERATING SYSTEM COMMAND', category: 'Control character' },
  '\u009E': { name: 'PRIVACY MESSAGE', category: 'Control character' },
  '\u009F': { name: 'APPLICATION PROGRAM COMMAND', category: 'Control character' },
  
  // Zero-width characters
  '\u200B': { name: 'Zero Width Space', category: 'Zero-width' },
  '\u200C': { name: 'Zero Width Non-Joiner', category: 'Zero-width' },
  '\u200D': { name: 'Zero Width Joiner', category: 'Zero-width' },
  '\uFEFF': { name: 'Zero Width No-Break Space (BOM)', category: 'Zero-width' },
  '\u2060': { name: 'Word Joiner', category: 'Zero-width' },
  
  // Bidirectional text control
  '\u200E': { name: 'Left-to-Right Mark', category: 'Direction control' },
  '\u200F': { name: 'Right-to-Left Mark', category: 'Direction control' },
  '\u061C': { name: 'Arabic Letter Mark', category: 'Direction control' },
  '\u2066': { name: 'Left-to-Right Isolate', category: 'Direction control' },
  '\u2067': { name: 'Right-to-Left Isolate', category: 'Direction control' },
  '\u2068': { name: 'First Strong Isolate', category: 'Direction control' },
  '\u2069': { name: 'Pop Directional Isolate', category: 'Direction control' },
  '\u202A': { name: 'Left-to-Right Embedding', category: 'Direction control' },
  '\u202B': { name: 'Right-to-Left Embedding', category: 'Direction control' },
  '\u202C': { name: 'Pop Directional Formatting', category: 'Direction control' },
  '\u202D': { name: 'Left-to-Right Override', category: 'Direction control' },
  '\u202E': { name: 'Right-to-Left Override', category: 'Direction control' },
  
  // Variation selectors (all 16)
  '\uFE00': { name: 'Variation Selector-1', category: 'Variation selector' },
  '\uFE01': { name: 'Variation Selector-2', category: 'Variation selector' },
  '\uFE02': { name: 'Variation Selector-3', category: 'Variation selector' },
  '\uFE03': { name: 'Variation Selector-4', category: 'Variation selector' },
  '\uFE04': { name: 'Variation Selector-5', category: 'Variation selector' },
  '\uFE05': { name: 'Variation Selector-6', category: 'Variation selector' },
  '\uFE06': { name: 'Variation Selector-7', category: 'Variation selector' },
  '\uFE07': { name: 'Variation Selector-8', category: 'Variation selector' },
  '\uFE08': { name: 'Variation Selector-9', category: 'Variation selector' },
  '\uFE09': { name: 'Variation Selector-10', category: 'Variation selector' },
  '\uFE0A': { name: 'Variation Selector-11', category: 'Variation selector' },
  '\uFE0B': { name: 'Variation Selector-12', category: 'Variation selector' },
  '\uFE0C': { name: 'Variation Selector-13', category: 'Variation selector' },
  '\uFE0D': { name: 'Variation Selector-14', category: 'Variation selector' },
  '\uFE0E': { name: 'Variation Selector-15', category: 'Variation selector' },
  '\uFE0F': { name: 'Variation Selector-16', category: 'Variation selector' },
  
  // Language-specific fillers and other invisible characters
  '\u00AD': { name: 'Soft Hyphen', category: 'Formatting' },
  '\u034F': { name: 'Combining Grapheme Joiner', category: 'Combining' },
  '\u115F': { name: 'Hangul Choseong Filler', category: 'Filler' },
  '\u1160': { name: 'Hangul Jungseong Filler', category: 'Filler' },
  '\u17B4': { name: 'Khmer Vowel Inherent AQ', category: 'Filler' },
  '\u17B5': { name: 'Khmer Vowel Inherent AA', category: 'Filler' },
  '\u180E': { name: 'Mongolian Vowel Separator', category: 'Formatting' },
  '\u2800': { name: 'Braille Pattern Blank', category: 'Braille' },
  '\u3164': { name: 'Hangul Filler', category: 'Filler' },
  '\uFFA0': { name: 'Halfwidth Hangul Filler', category: 'Filler' },
  
  // Additional formatting and invisible characters
  '\u2028': { name: 'Line Separator', category: 'Formatting' },
  '\u2029': { name: 'Paragraph Separator', category: 'Formatting' },
  '\u2061': { name: 'Function Application', category: 'Invisible math' },
  '\u2062': { name: 'Invisible Times', category: 'Invisible math' },
  '\u2063': { name: 'Invisible Separator', category: 'Invisible math' },
  '\u2064': { name: 'Invisible Plus', category: 'Invisible math' },
  '\u206A': { name: 'Inhibit Symmetric Swapping', category: 'Deprecated format' },
  '\u206B': { name: 'Activate Symmetric Swapping', category: 'Deprecated format' },
  '\u206C': { name: 'Inhibit Arabic Form Shaping', category: 'Deprecated format' },
  '\u206D': { name: 'Activate Arabic Form Shaping', category: 'Deprecated format' },
  '\u206E': { name: 'National Digit Shapes', category: 'Deprecated format' },
  '\u206F': { name: 'Nominal Digit Shapes', category: 'Deprecated format' },
};

/**
 * Detect hidden characters in text
 * @param {string} text - The input text to analyze
 * @returns {Object} Object containing cleaned text and detected characters
 */
export function detectHiddenCharacters(text) {
  if (!text) {
    return { 
      cleanText: '', 
      detectedChars: [], 
      categories: [], 
      confidenceScore: 0,
      paragraphAnalysis: [],
      placementPatterns: [],
      watermarkSummary: null
    };
  }

  let cleanText = text;
  const detectedChars = [];
  const charMap = new Map();
  const categoryMap = new Map();
  const paragraphs = text.split(/\n+/);
  const paragraphAnalysis = [];
  const charPositionMap = new Map(); // For tracking character positions by type

  // Process each character in the text
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const codePoint = char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    
    // Check if this is a hidden character we're tracking
    if (HIDDEN_CHAR_MAP[char]) {
      const info = HIDDEN_CHAR_MAP[char];
      
      // Skip normal line feeds unless they form unusual patterns
      // We're now more strict about what counts as a normal line feed
      if (char === '\n' && isNormalLineFeed(text, i)) {
        continue;
      }
      
      // Check for common watermarking patterns around this character
      const isWatermarkPattern = checkForWatermarkPatterns(text, i, char);
      
      // Get context (10 characters before and after, if available)
      const contextStart = Math.max(0, i - 10);
      const contextEnd = Math.min(text.length, i + 11); // +11 because end is exclusive
      const beforeContext = text.substring(contextStart, i);
      const afterContext = text.substring(i + 1, contextEnd);
      
      // Determine which paragraph this character is in
      const paragraphIndex = getParagraphIndex(text, i, paragraphs);
      
      // Determine placement context (after punctuation, between words, etc.)
      const placementContext = getPlacementContext(beforeContext, afterContext);
      
      // Track character positions by type for pattern analysis
      if (!charPositionMap.has(info.category)) {
        charPositionMap.set(info.category, []);
      }
      charPositionMap.get(info.category).push({
        position: i,
        char,
        name: info.name,
        paragraph: paragraphIndex,
        placement: placementContext,
        likelihood: getCharacterLikelihood(char, info)
      });
      
      // Add to our tracking map
      if (!charMap.has(char)) {
        charMap.set(char, {
          id: `char-${codePoint}`,
          char,
          name: info.name,
          category: info.category,
          codePoint,
          count: 1,
          positions: [i],
          paragraphs: [paragraphIndex],
          placements: [placementContext],
          likelihood: getCharacterLikelihood(char, info),
          contexts: [{
            position: i,
            before: beforeContext,
            after: afterContext,
            fullContext: `${beforeContext}[${info.name}]${afterContext}`,
            paragraph: paragraphIndex,
            placement: placementContext
          }]
        });
        
        // Track categories
        if (!categoryMap.has(info.category)) {
          categoryMap.set(info.category, 1);
        } else {
          categoryMap.set(info.category, categoryMap.get(info.category) + 1);
        }
        
      } else {
        const charInfo = charMap.get(char);
        charInfo.count++;
        charInfo.positions.push(i);
        charInfo.paragraphs.push(paragraphIndex);
        charInfo.placements.push(placementContext);
        charInfo.contexts.push({
          position: i,
          before: beforeContext,
          after: afterContext,
          fullContext: `${beforeContext}[${info.name}]${afterContext}`,
          paragraph: paragraphIndex,
          placement: placementContext
        });
        
        // Update category count
        categoryMap.set(info.category, categoryMap.get(info.category) + 1);
      }
    }
  }

  // Convert map to array and sort by count (descending)
  if (charMap.size > 0) {
    charMap.forEach(charInfo => {
      detectedChars.push(charInfo);
    });
    
    // Sort by count (descending)
    detectedChars.sort((a, b) => b.count - a.count);
    
    // Create cleaned text by removing all detected hidden characters
    cleanText = text;
    for (const charInfo of detectedChars) {
      cleanText = cleanText.replaceAll(charInfo.char, '');
    }
  }
  
  // Convert categories to array and sort by count
  const categories = [];
  categoryMap.forEach((count, category) => {
    categories.push({ category, count });
  });
  categories.sort((a, b) => b.count - a.count);
  
  // Analyze character distribution by paragraph
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraphChars = new Map();
    
    // Count characters in this paragraph
    detectedChars.forEach(charInfo => {
      const count = charInfo.paragraphs.filter(p => p === i).length;
      if (count > 0) {
        paragraphChars.set(charInfo.char, {
          char: charInfo.char,
          name: charInfo.name,
          count,
          likelihood: charInfo.likelihood
        });
      }
    });
    
    // Add paragraph analysis if it contains hidden characters
    if (paragraphChars.size > 0) {
      paragraphAnalysis.push({
        index: i,
        text: paragraphs[i].substring(0, 50) + (paragraphs[i].length > 50 ? '...' : ''),
        charCount: paragraphs[i].length,
        hiddenChars: Array.from(paragraphChars.values()),
        totalHiddenChars: Array.from(paragraphChars.values()).reduce((sum, c) => sum + c.count, 0)
      });
    }
  }
  
  // Analyze character placement patterns
  const placementPatterns = analyzeCharacterPlacements(detectedChars);
  
  // Calculate confidence score (0-100)
  // Based on number of hidden chars, variety of categories, density, and likelihood
  const totalHiddenChars = detectedChars.reduce((sum, char) => sum + char.count, 0);
  const categoryVariety = categories.length;
  const textLength = text.length;
  const density = textLength > 0 ? (totalHiddenChars / textLength) : 0;
  
  // Calculate likelihood-weighted count (high likelihood chars count more)
  const weightedCount = detectedChars.reduce((sum, char) => {
    const weight = char.likelihood === 'High' ? 1.5 : 
                  char.likelihood === 'Medium' ? 1.0 : 0.5;
    return sum + (char.count * weight);
  }, 0);
  
  // Calculate confidence score components
  const countScore = Math.min(50, weightedCount); // Max 50 points for weighted count
  const categoryScore = Math.min(30, categoryVariety * 10); // Max 30 points for category variety
  const densityScore = Math.min(20, density * 1000); // Max 20 points for density
  
  const confidenceScore = Math.round(countScore + categoryScore + densityScore);
  
  // Create watermark summary
  const watermarkSummary = createWatermarkSummary(detectedChars, placementPatterns, confidenceScore);

  return { 
    cleanText, 
    detectedChars, 
    categories, 
    confidenceScore,
    totalHiddenChars,
    paragraphAnalysis,
    placementPatterns,
    watermarkSummary
  };
}

/**
 * Check if a line feed character is a normal paragraph break
 * @param {string} text - The full text
 * @param {number} position - Position of the line feed
 * @returns {boolean} True if it's a normal line feed
 */
function isNormalLineFeed(text, position) {
  // Check if this is a single line feed (normal paragraph break)
  // or if it's part of a pattern of multiple consecutive line feeds
  if (position > 0 && text[position-1] === '\n') {
    return false; // Multiple consecutive line feeds are suspicious
  }
  
  if (position < text.length - 1 && text[position+1] === '\n') {
    return false; // Multiple consecutive line feeds are suspicious
  }
  
  // Check if there are normal sentences before and after (ending with period, etc.)
  const prevText = text.substring(Math.max(0, position - 50), position);
  const nextText = text.substring(position + 1, Math.min(text.length, position + 50));
  
  // If previous text ends with a sentence-ending punctuation and next text starts with a capital letter,
  // it's likely a normal paragraph break
  const endsWithPunctuation = /[.!?]\s*$/.test(prevText);
  const startsWithCapital = /^\s*[A-Z]/.test(nextText);
  
  // Check for patterns that might indicate watermarking
  // Even if it looks like a normal paragraph break, check for suspicious patterns
  if (checkForWatermarkPatterns(text, position, '\n')) {
    return false;
  }
  
  return endsWithPunctuation && startsWithCapital;
}

/**
 * Determine which paragraph a character is in
 * @param {string} text - The full text
 * @param {number} position - Character position
 * @param {Array} paragraphs - Array of paragraphs
 * @returns {number} Paragraph index
 */
function getParagraphIndex(text, position, paragraphs) {
  let currentPos = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraphLength = paragraphs[i].length;
    if (position >= currentPos && position < currentPos + paragraphLength + 1) { // +1 for the newline
      return i;
    }
    currentPos += paragraphLength + 1; // +1 for the newline
  }
  return 0; // Default to first paragraph if not found
}

/**
 * Determine the placement context of a hidden character
 * @param {string} before - Text before the character
 * @param {string} after - Text after the character
 * @returns {string} Placement context description
 */
function getPlacementContext(before, after) {
  // Check if it's between words
  if (/\w$/.test(before) && /^\w/.test(after)) {
    return 'between-words';
  }
  
  // Check if it's after punctuation
  if (/[.!?,;:]$/.test(before)) {
    return 'after-punctuation';
  }
  
  // Check if it's before punctuation
  if (/^[.!?,;:]/.test(after)) {
    return 'before-punctuation';
  }
  
  // Check if it's at the start of a line/paragraph
  if (before.trim() === '' || /\n$/.test(before)) {
    return 'start-of-line';
  }
  
  // Check if it's at the end of a line/paragraph
  if (after.trim() === '' || /^\n/.test(after)) {
    return 'end-of-line';
  }
  
  // Check if it's within a word
  if (/\w$/.test(before) && /^\w/.test(after)) {
    return 'within-word';
  }
  
  // Default
  return 'other';
}

/**
 * Determine the likelihood of a character being a watermark
 * @param {string} char - The character
 * @param {Object} info - Character information
 * @returns {string} Likelihood (High, Medium, Low)
 */
function getCharacterLikelihood(char, info) {
  // High likelihood: Zero-width characters
  if (info.category === 'Zero-width') {
    return 'High';
  }
  
  // Medium likelihood: Direction controls, variation selectors
  if (info.category === 'Direction control' || 
      info.category === 'Variation selector' ||
      info.category === 'Information separator') {
    return 'Medium';
  }
  
  // Low likelihood: Standard formatting characters, control characters in normal contexts
  return 'Low';
}

/**
 * Analyze character placement patterns
 * @param {Array} detectedChars - Array of detected characters
 * @returns {Array} Placement pattern analysis
 */
function analyzeCharacterPlacements(detectedChars) {
  const patterns = [];
  
  // Group characters by category
  const categorizedChars = {};
  detectedChars.forEach(charInfo => {
    if (!categorizedChars[charInfo.category]) {
      categorizedChars[charInfo.category] = [];
    }
    categorizedChars[charInfo.category].push(charInfo);
  });
  
  // Analyze each category
  Object.entries(categorizedChars).forEach(([category, chars]) => {
    // Collect all placements for this category
    const allPlacements = [];
    chars.forEach(charInfo => {
      allPlacements.push(...charInfo.placements);
    });
    
    // Count occurrences of each placement type
    const placementCounts = {};
    allPlacements.forEach(placement => {
      placementCounts[placement] = (placementCounts[placement] || 0) + 1;
    });
    
    // Calculate total and percentages
    const total = allPlacements.length;
    const placementStats = Object.entries(placementCounts).map(([placement, count]) => ({
      placement,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
    
    // Add pattern if we have enough data
    if (total >= 3) {
      patterns.push({
        category,
        totalChars: total,
        dominantPlacement: placementStats[0].placement,
        dominantPercentage: placementStats[0].percentage,
        placements: placementStats
      });
    }
  });
  
  return patterns;
}

/**
 * Create a summary of the watermarking strategy
 * @param {Array} detectedChars - Detected characters
 * @param {Array} placementPatterns - Placement pattern analysis
 * @param {number} confidenceScore - Overall confidence score
 * @returns {Object} Watermark summary
 */
function createWatermarkSummary(detectedChars, placementPatterns, confidenceScore) {
  // Count characters by likelihood
  const likelihoodCounts = { High: 0, Medium: 0, Low: 0 };
  detectedChars.forEach(char => {
    likelihoodCounts[char.likelihood] += char.count;
  });
  
  // Determine primary watermarking strategy
  let primaryStrategy = 'None';
  let strategyEvidence = [];
  
  if (likelihoodCounts.High > 0) {
    primaryStrategy = 'Character Insertion';
    strategyEvidence.push(`${likelihoodCounts.High} high-likelihood hidden characters detected`);
    
    // Add details about dominant placement patterns
    if (placementPatterns.length > 0) {
      const zeroWidthPattern = placementPatterns.find(p => p.category === 'Zero-width');
      if (zeroWidthPattern) {
        strategyEvidence.push(
          `${zeroWidthPattern.dominantPercentage}% of zero-width characters appear ${formatPlacement(zeroWidthPattern.dominantPlacement)}`
        );
      }
    }
  }
  
  // Determine if there's evidence of a hybrid strategy
  const hasHybridStrategy = primaryStrategy !== 'None' && 
                          (likelihoodCounts.Medium > 0 || likelihoodCounts.Low > 0);
  
  return {
    confidenceScore,
    primaryStrategy,
    hasHybridStrategy,
    evidence: strategyEvidence,
    characterCounts: {
      highLikelihood: likelihoodCounts.High,
      mediumLikelihood: likelihoodCounts.Medium,
      lowLikelihood: likelihoodCounts.Low,
      total: likelihoodCounts.High + likelihoodCounts.Medium + likelihoodCounts.Low
    }
  };
}

/**
 * Format placement context for human-readable output
 * @param {string} placement - Placement context
 * @returns {string} Formatted placement description
 */
function formatPlacement(placement) {
  switch (placement) {
    case 'between-words': return 'between words';
    case 'after-punctuation': return 'after punctuation';
    case 'before-punctuation': return 'before punctuation';
    case 'start-of-line': return 'at the start of lines';
    case 'end-of-line': return 'at the end of lines';
    case 'within-word': return 'within words';
    default: return 'in other contexts';
  }
}

/**
 * Get a human-readable description of a Unicode code point
 * @param {string} codePoint - The Unicode code point in hex format
 * @returns {string} Human-readable description
 */
export function getCodePointDescription(codePoint) {
  const num = parseInt(codePoint, 16);
  return `U+${codePoint.toUpperCase()} (decimal: ${num})`;
}

/**
 * Check if a character is a hidden/invisible character
 * @param {string} char - The character to check
 * @returns {boolean} True if the character is hidden
 */
export function isHiddenCharacter(char) {
  return HIDDEN_CHAR_MAP[char] !== undefined;
}

/**
 * Check for common watermarking patterns around a character
 * @param {string} text - The full text
 * @param {number} position - Position of the character
 * @param {string} char - The character being checked
 * @returns {boolean} True if a watermarking pattern is detected
 */
function checkForWatermarkPatterns(text, position, char) {
  // Check for common watermarking techniques
  
  // 1. Check for patterns of line breaks at regular intervals
  if (char === '\n') {
    // Look for line breaks that occur at suspiciously regular intervals
    const lineBreakPositions = [];
    let pos = 0;
    while (pos < text.length) {
      pos = text.indexOf('\n', pos);
      if (pos === -1) break;
      lineBreakPositions.push(pos);
      pos++;
    }
    
    // Check for regular intervals between line breaks
    if (lineBreakPositions.length >= 3) {
      const intervals = [];
      for (let i = 1; i < lineBreakPositions.length; i++) {
        intervals.push(lineBreakPositions[i] - lineBreakPositions[i-1]);
      }
      
      // Check if there's a pattern of regular intervals
      const hasRegularPattern = intervals.some((interval, i, arr) => {
        if (i < 2) return false;
        // Check if three consecutive intervals are similar (within 1-2 characters)
        return Math.abs(interval - arr[i-1]) <= 2 && Math.abs(arr[i-1] - arr[i-2]) <= 2;
      });
      
      if (hasRegularPattern) {
        return true;
      }
    }
  }
  
  // 2. Check for invisible characters in specific patterns
  // Look for invisible characters that appear at regular intervals
  if (isHiddenCharacter(char) && char !== '\n') {
    // Check surrounding text for patterns
    const surroundingText = text.substring(
      Math.max(0, position - 100),
      Math.min(text.length, position + 100)
    );
    
    // Count occurrences of this character in surrounding text
    let count = 0;
    for (let i = 0; i < surroundingText.length; i++) {
      if (surroundingText[i] === char) count++;
    }
    
    // If this character appears multiple times in close proximity, it's suspicious
    if (count >= 3) {
      return true;
    }
    
    // Check if this character appears at the beginning of multiple paragraphs
    const paragraphs = text.split('\n');
    let paragraphStartCount = 0;
    for (const paragraph of paragraphs) {
      if (paragraph.length > 0 && paragraph[0] === char) {
        paragraphStartCount++;
      }
    }
    
    if (paragraphStartCount >= 2) {
      return true;
    }
  }
  
  // 3. Check for specific patterns of invisible characters between words
  // This is a common watermarking technique
  if (isHiddenCharacter(char) && char !== '\n') {
    // Check if this character appears between words consistently
    const beforeChar = position > 0 ? text[position - 1] : '';
    const afterChar = position < text.length - 1 ? text[position + 1] : '';
    
    // If it's between two word characters or spaces, it might be watermarking
    if (/[\w\s]/.test(beforeChar) && /[\w\s]/.test(afterChar)) {
      // Look for similar patterns elsewhere in the text
      const pattern = beforeChar + char + afterChar;
      const patternCount = (text.match(new RegExp(pattern, 'g')) || []).length;
      
      if (patternCount >= 2) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get information about a hidden character
 * @param {string} char - The character to get info for
 * @returns {Object|null} Character information or null if not a hidden character
 */
export function getHiddenCharacterInfo(char) {
  return HIDDEN_CHAR_MAP[char] || null;
}
