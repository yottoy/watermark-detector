/**
 * Watermark options that can be toggled by the user
 */

export const watermarkOptions = [
  // Zero-width characters
  {
    id: 'zero-width',
    name: 'Hidden Unicode Characters',
    category: 'Unicode Characters',
    description: 'Invisible characters like zero-width spaces, joiners, and direction markers inserted between visible characters.',
    severity: 'High',
    severityDescription: 'Very difficult to detect without tools',
    defaultSelected: true
  },
  {
    id: 'control-chars',
    name: 'Control Characters',
    category: 'Unicode Characters',
    description: 'Special control characters that can be used to manipulate text display or serve as hidden markers.',
    severity: 'High',
    severityDescription: 'Completely invisible to humans',
    defaultSelected: true
  },
  {
    id: 'direction-control',
    name: 'Direction Control Characters',
    category: 'Unicode Characters',
    description: 'Characters that control text direction (RTL/LTR) which can be used to hide watermarks.',
    severity: 'Medium',
    severityDescription: 'May cause subtle text rendering issues',
    defaultSelected: true
  },
  {
    id: 'variation-selectors',
    name: 'Variation Selectors',
    category: 'Unicode Characters',
    description: 'Characters that specify a specific visual variant of the preceding character.',
    severity: 'Medium',
    severityDescription: 'May affect text appearance subtly',
    defaultSelected: true
  },
  {
    id: 'formatting-chars',
    name: 'Formatting Characters',
    category: 'Unicode Characters',
    description: 'Special characters used for text formatting that can be used as watermarks.',
    severity: 'Medium',
    severityDescription: 'May affect text formatting',
    defaultSelected: true
  },
  
  // Spacing patterns
  {
    id: 'double-spaces',
    name: 'Double Spaces',
    category: 'Spacing Patterns',
    description: 'Multiple consecutive spaces between words that follow specific patterns.',
    severity: 'Medium',
    severityDescription: 'May be noticeable with careful reading',
    defaultSelected: true
  },
  {
    id: 'line-breaks',
    name: 'Line Breaks',
    category: 'Spacing Patterns',
    description: 'Extra line breaks or specific line break patterns used as watermarks.',
    severity: 'Low',
    severityDescription: 'May affect document formatting',
    defaultSelected: true
  },
  {
    id: 'mathematical-patterns',
    name: 'Mathematical Sequences',
    category: 'Spacing Patterns',
    description: 'Spacing patterns that follow mathematical progressions like Fibonacci sequences or prime numbers.',
    severity: 'High',
    severityDescription: 'Sophisticated and difficult to detect',
    defaultSelected: true
  },
  {
    id: 'tab-chars',
    name: 'Tab Characters',
    category: 'Spacing Patterns',
    description: 'Tab characters used in specific patterns as watermarks.',
    severity: 'Medium',
    severityDescription: 'May affect text alignment',
    defaultSelected: true
  },
  
  // Other watermarking techniques
  {
    id: 'invisible-math',
    name: 'Invisible Math Operators',
    category: 'Other Techniques',
    description: 'Special Unicode characters for mathematical notation that are invisible in normal text.',
    severity: 'High',
    severityDescription: 'Completely invisible to humans',
    defaultSelected: true
  },
  {
    id: 'fillers',
    name: 'Language-specific Fillers',
    category: 'Other Techniques',
    description: 'Special characters used as fillers in various languages that can be used as watermarks.',
    severity: 'Medium',
    severityDescription: 'May affect text rendering in specific languages',
    defaultSelected: true
  }
];

/**
 * Get the default selected watermark options
 */
export function getDefaultSelectedWatermarks() {
  return watermarkOptions
    .filter(option => option.defaultSelected)
    .map(option => option.id);
}

/**
 * Get watermark options by category
 */
export function getWatermarkOptionsByCategory(categoryName) {
  return watermarkOptions.filter(option => option.category === categoryName);
}

/**
 * Get a watermark option by ID
 */
export function getWatermarkOptionById(id) {
  return watermarkOptions.find(option => option.id === id);
}

/**
 * Map watermark option IDs to character categories
 */
export const watermarkOptionToCharacterCategories = {
  'zero-width': ['Zero-width'],
  'control-chars': ['Control character', 'Information separator'],
  'direction-control': ['Direction control'],
  'variation-selectors': ['Variation selector'],
  'formatting-chars': ['Formatting'],
  'invisible-math': ['Invisible math'],
  'fillers': ['Filler', 'Braille']
};

/**
 * Map watermark option IDs to spacing analysis features
 */
export const watermarkOptionToSpacingFeatures = {
  'double-spaces': ['multipleSpaces'],
  'line-breaks': ['lineBreaks'],
  'mathematical-patterns': ['mathematicalPatterns'],
  'tab-chars': ['tabCharacters']
};
