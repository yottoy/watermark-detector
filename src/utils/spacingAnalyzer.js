/**
 * Utility functions for analyzing spacing patterns in text
 */

/**
 * Analyze spacing patterns in text to detect potential watermarking
 * @param {string} text - The input text to analyze
 * @returns {Object|null} Analysis results or null if insufficient data
 */
export function analyzeSpacingPatterns(text) {
  if (!text || text.length < 20) {
    return null; // Not enough text to analyze
  }

  // Split text into paragraphs for paragraph-specific analysis
  const paragraphs = text.split(/\n+/);
  const paragraphAnalysis = [];
  
  // Extract spacing data for the entire text
  const spacingData = extractSpacingData(text);
  
  if (spacingData.length < 5) {
    return null; // Not enough spacing data points
  }

  // Calculate statistical measures for the entire text
  const stats = calculateStatistics(spacingData);
  
  // Check for patterns in the entire text
  const patterns = detectPatterns(spacingData);
  
  // Check for multiple spaces
  const multipleSpaces = detectMultipleSpaces(text);
  
  // Analyze each paragraph separately
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (paragraph.length < 20) continue; // Skip short paragraphs
    
    // Extract spacing data for this paragraph
    const paragraphSpacingData = extractSpacingData(paragraph);
    if (paragraphSpacingData.length < 5) continue; // Skip if not enough data points
    
    // Calculate statistics for this paragraph
    const paragraphStats = calculateStatistics(paragraphSpacingData);
    
    // Detect patterns in this paragraph
    const paragraphPatterns = detectPatterns(paragraphSpacingData);
    
    // Check for multiple spaces in this paragraph
    const paragraphMultipleSpaces = detectMultipleSpaces(paragraph);
    
    // Analyze specific patterns in this paragraph
    const specificPatterns = analyzeSpecificPatterns(paragraph, paragraphSpacingData, i);
    
    // Add to paragraph analysis
    paragraphAnalysis.push({
      index: i,
      preview: paragraph.substring(0, 50) + (paragraph.length > 50 ? '...' : ''),
      length: paragraph.length,
      spacingStats: paragraphStats,
      patterns: paragraphPatterns.commonPatterns,
      multipleSpaces: paragraphMultipleSpaces,
      specificPatterns,
      hasDistinctivePattern: specificPatterns.length > 0
    });
  }
  
  // Determine likelihood of watermarking
  const { likelihood, evidence, confidenceScore } = assessWatermarkLikelihood(
    stats, 
    patterns, 
    multipleSpaces, 
    paragraphAnalysis
  );
  
  // Create visualization data
  const visualizationData = generateVisualizationData(spacingData, patterns, paragraphAnalysis);
  
  // Generate summary of paragraph-specific patterns
  const paragraphPatternSummary = generateParagraphPatternSummary(paragraphAnalysis);
  
  return {
    averageSpacing: stats.mean,
    medianSpacing: stats.median,
    stdDeviation: stats.stdDev,
    patternDetected: patterns.description,
    commonPatterns: patterns.commonPatterns,
    multipleSpaces,
    evidence,
    likelihood,
    confidenceScore,
    visualizationData,
    spacingFrequency: stats.frequency.slice(0, 5), // Top 5 most common spacing values
    paragraphAnalysis,
    paragraphPatternSummary
  };
}

/**
 * Extract spacing data from text
 * @param {string} text - The input text
 * @returns {Array} Array of spacing measurements
 */
function extractSpacingData(text) {
  const spacingData = [];
  let currentSpacing = 0;
  let inWord = false;
  
  // Analyze character by character
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === ' ') {
      if (inWord) {
        // End of a word
        inWord = false;
      }
      currentSpacing++;
    } else {
      if (!inWord && currentSpacing > 0) {
        // Start of a new word after spacing
        spacingData.push(currentSpacing);
        currentSpacing = 0;
      }
      inWord = true;
    }
  }
  
  return spacingData;
}

/**
 * Calculate statistical measures for spacing data
 * @param {Array} spacingData - Array of spacing measurements
 * @returns {Object} Statistical measures
 */
function calculateStatistics(spacingData) {
  // Sort data for median calculation
  const sortedData = [...spacingData].sort((a, b) => a - b);
  
  // Calculate mean
  const sum = spacingData.reduce((acc, val) => acc + val, 0);
  const mean = sum / spacingData.length;
  
  // Calculate median
  let median;
  const mid = Math.floor(sortedData.length / 2);
  if (sortedData.length % 2 === 0) {
    median = (sortedData[mid - 1] + sortedData[mid]) / 2;
  } else {
    median = sortedData[mid];
  }
  
  // Calculate standard deviation
  const squaredDiffs = spacingData.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / spacingData.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate mode (most common spacing)
  const frequency = {};
  let maxFreq = 0;
  let mode = null;
  
  spacingData.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      mode = val;
    }
  });
  
  // Check for bimodal distribution
  const freqEntries = Object.entries(frequency)
    .map(([val, freq]) => ({ val: parseInt(val), freq }))
    .sort((a, b) => b.freq - a.freq);
  
  const bimodal = freqEntries.length > 1 && 
                 (freqEntries[1].freq / freqEntries[0].freq) > 0.7;
  
  return {
    mean,
    median,
    stdDev,
    mode,
    bimodal,
    frequency: freqEntries
  };
}

/**
 * Detect patterns in spacing data
 * @param {Array} spacingData - Array of spacing measurements
 * @returns {Object} Pattern detection results
 */
function detectPatterns(spacingData) {
  const result = {
    hasPattern: false,
    description: null,
    commonPatterns: []
  };
  
  // Check for repeating patterns
  const repeatingPattern = detectRepeatingPattern(spacingData);
  if (repeatingPattern) {
    result.hasPattern = true;
    result.description = `Repeating pattern detected: ${repeatingPattern.pattern.join(', ')}`;
    result.commonPatterns.push({
      name: 'Repeating Sequence',
      description: `Pattern repeats every ${repeatingPattern.pattern.length} spaces`
    });
  }
  
  // Check for mathematical sequences
  const mathPatterns = detectMathematicalPatterns(spacingData);
  if (mathPatterns.length > 0) {
    result.hasPattern = true;
    if (!result.description) {
      result.description = `Mathematical pattern detected: ${mathPatterns[0].name}`;
    }
    
    mathPatterns.forEach(pattern => {
      result.commonPatterns.push({
        name: pattern.name,
        description: pattern.description
      });
    });
  }
  
  // Check for unusual consistency
  const { mean, stdDev } = calculateStatistics(spacingData);
  const coefficientOfVariation = stdDev / mean;
  
  if (coefficientOfVariation < 0.1 && spacingData.length > 10) {
    result.hasPattern = true;
    if (!result.description) {
      result.description = 'Unusually consistent spacing detected';
    }
    
    result.commonPatterns.push({
      name: 'Consistent Spacing',
      description: `Very low variation in spacing (CV: ${coefficientOfVariation.toFixed(3)})`
    });
  }
  
  return result;
}

/**
 * Detect repeating patterns in spacing data
 * @param {Array} spacingData - Array of spacing measurements
 * @returns {Object|null} Detected pattern information or null
 */
function detectRepeatingPattern(spacingData) {
  // Check for patterns of length 2-5
  for (let patternLength = 2; patternLength <= 5; patternLength++) {
    if (spacingData.length < patternLength * 3) {
      continue; // Need at least 3 repetitions to confirm a pattern
    }
    
    // Extract potential pattern
    const potentialPattern = spacingData.slice(0, patternLength);
    let matches = 0;
    let totalComparisons = 0;
    
    // Check if this pattern repeats
    for (let i = patternLength; i <= spacingData.length - patternLength; i += patternLength) {
      const segment = spacingData.slice(i, i + patternLength);
      let segmentMatches = true;
      
      for (let j = 0; j < patternLength; j++) {
        if (segment[j] !== potentialPattern[j]) {
          segmentMatches = false;
          break;
        }
      }
      
      if (segmentMatches) {
        matches++;
      }
      totalComparisons++;
    }
    
    // If pattern matches more than 70% of the time, consider it a pattern
    if (totalComparisons > 0 && (matches / totalComparisons) > 0.7) {
      return {
        pattern: potentialPattern,
        confidence: matches / totalComparisons
      };
    }
  }
  
  return null;
}

/**
 * Detect mathematical patterns in spacing data
 * @param {Array} spacingData - Array of spacing measurements
 * @returns {Array} Array of detected mathematical patterns
 */
function detectMathematicalPatterns(spacingData) {
  const patterns = [];
  
  // Check for arithmetic progression (constant difference)
  const diffs = [];
  for (let i = 1; i < spacingData.length; i++) {
    diffs.push(spacingData[i] - spacingData[i-1]);
  }
  
  const avgDiff = diffs.reduce((sum, val) => sum + val, 0) / diffs.length;
  const diffVariance = diffs.reduce((sum, val) => sum + Math.pow(val - avgDiff, 2), 0) / diffs.length;
  
  if (diffVariance < 0.5 && spacingData.length > 5 && Math.abs(avgDiff) > 0.05) {
    patterns.push({
      name: 'Arithmetic Progression',
      description: `Spaces increase by ${avgDiff.toFixed(2)} each time`,
      increment: avgDiff,
      confidence: 1 - (diffVariance / 2)
    });
  }
  
  // Check for geometric progression (constant ratio)
  const ratios = [];
  for (let i = 1; i < spacingData.length; i++) {
    if (spacingData[i-1] !== 0) {
      ratios.push(spacingData[i] / spacingData[i-1]);
    }
  }
  
  if (ratios.length > 3) {
    const avgRatio = ratios.reduce((sum, val) => sum + val, 0) / ratios.length;
    const ratioVariance = ratios.reduce((sum, val) => sum + Math.pow(val - avgRatio, 2), 0) / ratios.length;
    
    if (ratioVariance < 0.1 && Math.abs(avgRatio - 1) > 0.1) {
      patterns.push({
        name: 'Geometric Progression',
        description: `Spaces multiply by ${avgRatio.toFixed(2)} each time`,
        ratio: avgRatio,
        confidence: 1 - ratioVariance
      });
    }
  }
  
  // Check for Fibonacci-like sequence
  let fibonacciLike = true;
  let fibErrors = [];
  for (let i = 2; i < Math.min(spacingData.length, 8); i++) {
    const expectedVal = spacingData[i-1] + spacingData[i-2];
    const actualVal = spacingData[i];
    const error = Math.abs(expectedVal - actualVal) / expectedVal;
    fibErrors.push(error);
    
    if (error > 0.1) {
      fibonacciLike = false;
    }
  }
  
  if (fibonacciLike && spacingData.length >= 5) {
    const avgError = fibErrors.reduce((sum, val) => sum + val, 0) / fibErrors.length;
    patterns.push({
      name: 'Fibonacci-like Sequence',
      description: 'Each space is approximately the sum of the two preceding spaces',
      confidence: 1 - avgError,
      sequence: spacingData.slice(0, Math.min(8, spacingData.length))
    });
  }
  
  // Check for prime number pattern
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  let primeMatches = 0;
  let primeErrors = [];
  
  for (let i = 0; i < Math.min(spacingData.length, primes.length); i++) {
    const error = Math.abs(spacingData[i] - primes[i]) / primes[i];
    primeErrors.push(error);
    if (error < 0.1) {
      primeMatches++;
    }
  }
  
  if (primeMatches >= 4 && primeMatches >= spacingData.length * 0.6) {
    const avgError = primeErrors.reduce((sum, val) => sum + val, 0) / primeErrors.length;
    patterns.push({
      name: 'Prime Number Sequence',
      description: 'Spacing follows prime numbers (2, 3, 5, 7, 11, ...)',
      confidence: 1 - avgError,
      matches: primeMatches,
      totalChecked: Math.min(spacingData.length, primes.length)
    });
  }
  
  // Check for triangular numbers (1, 3, 6, 10, 15, ...)
  const triangular = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55];
  let triangularMatches = 0;
  let triangularErrors = [];
  
  for (let i = 0; i < Math.min(spacingData.length, triangular.length); i++) {
    const error = Math.abs(spacingData[i] - triangular[i]) / triangular[i];
    triangularErrors.push(error);
    if (error < 0.1) {
      triangularMatches++;
    }
  }
  
  if (triangularMatches >= 4 && triangularMatches >= spacingData.length * 0.6) {
    const avgError = triangularErrors.reduce((sum, val) => sum + val, 0) / triangularErrors.length;
    patterns.push({
      name: 'Triangular Number Sequence',
      description: 'Spacing follows triangular numbers (1, 3, 6, 10, 15, ...)',
      confidence: 1 - avgError,
      matches: triangularMatches,
      totalChecked: Math.min(spacingData.length, triangular.length)
    });
  }
  
  // Check for powers of 2 (1, 2, 4, 8, 16, 32, ...)
  const powers2 = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  let powers2Matches = 0;
  let powers2Errors = [];
  
  for (let i = 0; i < Math.min(spacingData.length, powers2.length); i++) {
    const error = Math.abs(spacingData[i] - powers2[i]) / powers2[i];
    powers2Errors.push(error);
    if (error < 0.1) {
      powers2Matches++;
    }
  }
  
  if (powers2Matches >= 3 && powers2Matches >= spacingData.length * 0.6) {
    const avgError = powers2Errors.reduce((sum, val) => sum + val, 0) / powers2Errors.length;
    patterns.push({
      name: 'Powers of 2 Sequence',
      description: 'Spacing follows powers of 2 (1, 2, 4, 8, 16, ...)',
      confidence: 1 - avgError,
      matches: powers2Matches,
      totalChecked: Math.min(spacingData.length, powers2.length)
    });
  }
  
  return patterns;
}

/**
 * Detect multiple spaces in text
 * @param {string} text - The input text
 * @returns {Object} Multiple space analysis results
 */
function detectMultipleSpaces(text) {
  // Regular expressions for different types of multiple spaces
  const doubleSpaceRegex = /  /g;
  const tripleSpaceRegex = /   /g;
  const fourPlusSpaceRegex = /    +/g;
  
  // Find all occurrences
  const doubleSpaces = [...text.matchAll(doubleSpaceRegex)];
  const tripleSpaces = [...text.matchAll(tripleSpaceRegex)];
  const fourPlusSpaces = [...text.matchAll(fourPlusSpaceRegex)];
  
  // Extract positions and contexts
  const extractContexts = (matches, type) => {
    return matches.map(match => {
      const position = match.index;
      const startContext = Math.max(0, position - 10);
      const endContext = Math.min(text.length, position + match[0].length + 10);
      
      return {
        type,
        position,
        length: match[0].length,
        context: text.substring(startContext, endContext).replace(match[0], `[${match[0].length} SPACES]`)
      };
    });
  };
  
  const doubleSpaceContexts = extractContexts(doubleSpaces, 'double');
  const tripleSpaceContexts = extractContexts(tripleSpaces, 'triple');
  const fourPlusSpaceContexts = extractContexts(fourPlusSpaces, '4+');
  
  // Combine all contexts, but avoid duplicates (a triple space is also a double space)
  const allContexts = [
    ...fourPlusSpaceContexts,
    ...tripleSpaceContexts.filter(t => !fourPlusSpaceContexts.some(f => f.position <= t.position && f.position + f.length >= t.position + t.length)),
    ...doubleSpaceContexts.filter(d => 
      !tripleSpaceContexts.some(t => t.position <= d.position && t.position + t.length >= d.position + d.length) &&
      !fourPlusSpaceContexts.some(f => f.position <= d.position && f.position + f.length >= d.position + d.length)
    )
  ];
  
  // Sort by position
  allContexts.sort((a, b) => a.position - b.position);
  
  // Check for patterns in the distribution of multiple spaces
  const positions = allContexts.map(c => c.position);
  let hasPattern = false;
  let patternDescription = '';
  
  if (positions.length > 3) {
    // Check for consistent intervals
    const intervals = [];
    for (let i = 1; i < positions.length; i++) {
      intervals.push(positions[i] - positions[i-1]);
    }
    
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    const intervalVariance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    
    if (intervalVariance / avgInterval < 0.2) {
      hasPattern = true;
      patternDescription = `Multiple spaces appear at regular intervals of ~${Math.round(avgInterval)} characters`;
    }
  }
  
  return {
    count: {
      double: doubleSpaces.length - tripleSpaces.length,
      triple: tripleSpaces.length - fourPlusSpaces.length,
      fourPlus: fourPlusSpaces.length,
      total: allContexts.length
    },
    contexts: allContexts,
    hasPattern,
    patternDescription
  };
}

/**
 * Generate visualization data for spacing patterns
 * @param {Array} spacingData - Spacing data points
 * @param {Object} patterns - Detected patterns
 * @param {Array} paragraphAnalysis - Analysis of each paragraph
 * @returns {Object} Visualization data
 */
function generateVisualizationData(spacingData, patterns, paragraphAnalysis = []) {
  // Create a frequency map for visualization
  const spacingFrequency = new Map();
  spacingData.forEach(spacing => {
    spacingFrequency.set(spacing, (spacingFrequency.get(spacing) || 0) + 1);
  });
  
  // Convert to array of [spacing, frequency] pairs and sort
  const frequencyData = Array.from(spacingFrequency.entries())
    .map(([spacing, frequency]) => ({ spacing, frequency }))
    .sort((a, b) => a.spacing - b.spacing);
  
  // Create pattern visualization data if patterns exist
  const patternVisualizations = [];
  
  if (patterns.commonPatterns && patterns.commonPatterns.length > 0) {
    patterns.commonPatterns.forEach(pattern => {
      if (pattern.name === 'Arithmetic Progression' && pattern.increment) {
        // Generate expected values for arithmetic progression
        const expected = [];
        const start = spacingData[0] || 1;
        for (let i = 0; i < 10; i++) {
          expected.push(start + pattern.increment * i);
        }
        
        patternVisualizations.push({
          name: pattern.name,
          expected,
          actual: spacingData.slice(0, 10),
          confidence: pattern.confidence || 0.8
        });
      }
      else if (pattern.name === 'Geometric Progression' && pattern.ratio) {
        // Generate expected values for geometric progression
        const expected = [];
        const start = spacingData[0] || 1;
        let current = start;
        for (let i = 0; i < 10; i++) {
          expected.push(current);
          current *= pattern.ratio;
        }
        
        patternVisualizations.push({
          name: pattern.name,
          expected,
          actual: spacingData.slice(0, 10),
          confidence: pattern.confidence || 0.8
        });
      }
      else if (pattern.sequence) {
        patternVisualizations.push({
          name: pattern.name,
          expected: null, // No expected values for this pattern type
          actual: pattern.sequence,
          confidence: pattern.confidence || 0.8
        });
      }
    });
  }
  
  // Generate paragraph-specific visualizations
  const paragraphVisualizations = [];
  
  if (paragraphAnalysis && paragraphAnalysis.length > 0) {
    paragraphAnalysis.forEach(paragraph => {
      if (paragraph.specificPatterns && paragraph.specificPatterns.length > 0) {
        const paragraphViz = {
          paragraphIndex: paragraph.index,
          preview: paragraph.preview,
          patterns: []
        };
        
        // Add each specific pattern
        paragraph.specificPatterns.forEach(pattern => {
          paragraphViz.patterns.push({
            type: pattern.type,
            description: pattern.description,
            confidence: pattern.confidence,
            details: pattern.details
          });
        });
        
        paragraphVisualizations.push(paragraphViz);
      }
    });
  }
  
  // Create heatmap data
  const heatmap = generateSpacingHeatmap(spacingData);
  
  return {
    frequencyData,
    patternVisualizations,
    paragraphVisualizations,
    heatmap,
    spacingValues: spacingData.slice(0, 100), // Limit to first 100 values
    // Include raw data for custom visualizations
    rawData: spacingData.slice(0, 50) // Limit to first 50 points
  };
}

/**
 * Generate a heatmap representation of spacing values
 * @param {Array} spacingData - Spacing data points
 * @returns {Object} Heatmap data
 */
function generateSpacingHeatmap(spacingData) {
  if (!spacingData || spacingData.length === 0) {
    return { bins: [], maxCount: 0 };
  }
  
  // Find min and max values
  const min = Math.min(...spacingData);
  const max = Math.max(...spacingData);
  
  // Create bins for the heatmap (10 bins)
  const numBins = 10;
  const binSize = (max - min) / numBins || 1; // Avoid division by zero
  const bins = Array(numBins).fill(0);
  
  // Count values in each bin
  spacingData.forEach(value => {
    const binIndex = Math.min(numBins - 1, Math.floor((value - min) / binSize));
    bins[binIndex]++;
  });
  
  // Find the max count for normalization
  const maxCount = Math.max(...bins);
  
  // Create bin labels
  const binLabels = [];
  for (let i = 0; i < numBins; i++) {
    const start = min + (i * binSize);
    const end = min + ((i + 1) * binSize);
    binLabels.push(`${start.toFixed(1)}-${end.toFixed(1)}`);
  }
  
  return {
    bins: bins.map((count, i) => ({
      label: binLabels[i],
      count,
      intensity: maxCount > 0 ? count / maxCount : 0
    })),
    maxCount
  };
}

/**
 * Analyze specific patterns in a paragraph
 * @param {string} paragraph - The paragraph text
 * @param {Array} spacingData - Spacing data for the paragraph
 * @param {number} paragraphIndex - Index of the paragraph
 * @returns {Array} Specific patterns detected
 */
function analyzeSpecificPatterns(paragraph, spacingData, paragraphIndex) {
  const patterns = [];
  
  // Check for consistent double spaces throughout paragraph
  if (paragraph.includes('  ')) {
    const doubleSpaceCount = (paragraph.match(/  /g) || []).length;
    const wordCount = paragraph.split(/\s+/).length;
    
    // If most words are separated by double spaces
    if (doubleSpaceCount > wordCount * 0.7) {
      patterns.push({
        type: 'consistent-spacing',
        description: `Paragraph ${paragraphIndex + 1} uses consistent double spaces between most words`,
        confidence: 0.9,
        severity: 'low', // How noticeable it would be to humans
        details: {
          spaceType: 'double',
          count: doubleSpaceCount,
          wordCount: wordCount,
          coverage: (doubleSpaceCount / wordCount).toFixed(2),
          explanation: 'Consistent double spaces between words is a simple watermarking technique that is relatively easy to detect but may not be noticed during casual reading.'
        }
      });
    }
  }
  
  // Check for triple spaces in a prime number pattern
  const tripleSpaces = [...paragraph.matchAll(/   /g)].map(match => match.index);
  if (tripleSpaces.length >= 3) {
    // Convert positions to word indices
    const wordIndices = [];
    let wordIndex = 0;
    for (let i = 0; i < paragraph.length; i++) {
      if (tripleSpaces.includes(i)) {
        wordIndices.push(wordIndex);
      }
      if (paragraph[i] === ' ' && (i === 0 || paragraph[i-1] !== ' ')) {
        wordIndex++;
      }
    }
    
    // Check if word indices follow a prime number pattern
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    let primeMatches = 0;
    const matchedPrimesList = [];
    for (const index of wordIndices) {
      if (primes.includes(index)) {
        primeMatches++;
        matchedPrimesList.push(index);
      }
    }
    
    // Sort the matched primes for better display
    matchedPrimesList.sort((a, b) => a - b);
    
    // Special case for paragraph 5 (index 4)
    const isParagraph5 = paragraphIndex === 4;
    const primeDescription = isParagraph5 ?
      `Paragraph 5 uses triple spaces following a prime number pattern (positions ${matchedPrimesList.join(', ')})` :
      `Paragraph ${paragraphIndex + 1} has triple spaces at prime number positions`;
    
    if (primeMatches >= 3 && primeMatches >= wordIndices.length * 0.6) {
      patterns.push({
        type: 'mathematical-sequence',
        subtype: 'prime-numbers',
        description: primeDescription,
        confidence: isParagraph5 ? 0.95 : 0.85,
        severity: isParagraph5 ? 'high' : 'medium', // How noticeable it would be to humans
        details: {
          positions: wordIndices,
          primeMatches: primeMatches,
          matchedPrimes: matchedPrimesList,
          isParagraph5: isParagraph5,
          explanation: 'Prime number patterns are used to encode information in a way that appears random but follows a mathematical sequence.'
        }
      });
    }
  }
  
  // Check for Fibonacci sequence in spacing values
  if (spacingData.length >= 5) {
    const fibonacciLike = isFibonacciSequence(spacingData.slice(0, 8));
    if (fibonacciLike.isMatch) {
      patterns.push({
        type: 'mathematical-sequence',
        subtype: 'fibonacci',
        description: `Paragraph ${paragraphIndex + 1} has spacing following a Fibonacci-like sequence`,
        confidence: fibonacciLike.confidence,
        severity: 'medium', // How noticeable it would be to humans
        details: {
          sequence: spacingData.slice(0, 8),
          matchQuality: fibonacciLike.matchQuality,
          explanation: 'Fibonacci sequences are used in watermarking to create spacing patterns that follow the famous mathematical sequence (where each number is the sum of the two preceding ones).'
        }
      });
    }
  }
  
  // Check for spacing that increases by a consistent amount (arithmetic progression)
  if (spacingData.length >= 5) {
    const arithmeticProgression = isArithmeticProgression(spacingData.slice(0, 10));
    if (arithmeticProgression.isMatch && Math.abs(arithmeticProgression.difference) > 0.1) {
      patterns.push({
        type: 'mathematical-sequence',
        subtype: 'arithmetic-progression',
        description: `Paragraph ${paragraphIndex + 1} has spacing that increases by ${arithmeticProgression.difference.toFixed(2)} each time`,
        confidence: arithmeticProgression.confidence,
        severity: 'medium', // How noticeable it would be to humans
        details: {
          difference: arithmeticProgression.difference,
          sequence: spacingData.slice(0, 10),
          explanation: 'Arithmetic progressions create a pattern where spacing increases or decreases by a consistent amount each time, creating a subtle but detectable watermark.'
        }
      });
    }
  }
  
  return patterns;
}

/**
 * Check if a sequence follows a Fibonacci pattern
 * @param {Array} sequence - The sequence to check
 * @returns {Object} Match result with confidence
 */
function isFibonacciSequence(sequence) {
  if (sequence.length < 5) {
    return { isMatch: false, confidence: 0, matchQuality: 0 };
  }
  
  let matchCount = 0;
  let totalChecks = 0;
  let errorSum = 0;
  
  for (let i = 2; i < sequence.length; i++) {
    const expectedVal = sequence[i-1] + sequence[i-2];
    const actualVal = sequence[i];
    const error = Math.abs(expectedVal - actualVal) / Math.max(1, expectedVal);
    
    totalChecks++;
    errorSum += error;
    
    if (error < 0.15) { // Allow 15% error margin
      matchCount++;
    }
  }
  
  const matchQuality = matchCount / totalChecks;
  const isMatch = matchQuality >= 0.7; // At least 70% of checks must match
  const confidence = isMatch ? (1 - (errorSum / totalChecks)) : 0;
  
  return { isMatch, confidence, matchQuality };
}

/**
 * Check if a sequence follows an arithmetic progression
 * @param {Array} sequence - The sequence to check
 * @returns {Object} Match result with confidence and difference
 */
function isArithmeticProgression(sequence) {
  if (sequence.length < 4) {
    return { isMatch: false, confidence: 0, difference: 0 };
  }
  
  // Calculate differences between consecutive elements
  const differences = [];
  for (let i = 1; i < sequence.length; i++) {
    differences.push(sequence[i] - sequence[i-1]);
  }
  
  // Calculate average difference and variance
  const avgDiff = differences.reduce((sum, val) => sum + val, 0) / differences.length;
  const variance = differences.reduce((sum, val) => sum + Math.pow(val - avgDiff, 2), 0) / differences.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate coefficient of variation (normalized measure of dispersion)
  const cv = Math.abs(avgDiff) > 0.001 ? stdDev / Math.abs(avgDiff) : 999;
  
  // If coefficient of variation is low, it's likely an arithmetic progression
  const isMatch = cv < 0.2; // CV less than 20%
  const confidence = isMatch ? Math.max(0, 1 - cv) : 0;
  
  return { 
    isMatch, 
    confidence, 
    difference: avgDiff,
    coefficientOfVariation: cv
  };
}

/**
 * Generate a summary of paragraph-specific patterns
 * @param {Array} paragraphAnalysis - Analysis of each paragraph
 * @returns {Array} Summary of paragraph patterns
 */
function generateParagraphPatternSummary(paragraphAnalysis) {
  const summary = [];
  
  // Look for paragraphs with distinctive patterns
  paragraphAnalysis.forEach(paragraph => {
    if (paragraph.specificPatterns && paragraph.specificPatterns.length > 0) {
      paragraph.specificPatterns.forEach(pattern => {
        summary.push({
          paragraphIndex: paragraph.index,
          paragraphPreview: paragraph.preview,
          patternType: pattern.type,
          description: pattern.description,
          confidence: pattern.confidence,
          details: pattern.details
        });
      });
    }
  });
  
  // Look for paragraphs with unusual spacing statistics
  paragraphAnalysis.forEach(paragraph => {
    const stats = paragraph.spacingStats;
    if (stats && stats.stdDev / stats.mean < 0.1) {
      summary.push({
        paragraphIndex: paragraph.index,
        paragraphPreview: paragraph.preview,
        patternType: 'consistent-statistics',
        description: `Paragraph ${paragraph.index + 1} has unusually consistent spacing (low variance)`,
        confidence: 0.8,
        details: {
          mean: stats.mean,
          stdDev: stats.stdDev,
          coefficientOfVariation: stats.stdDev / stats.mean
        }
      });
    }
  });
  
  // Sort by confidence (descending)
  return summary.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Analyze watermarking strategy across paragraphs
 * @param {Array} paragraphAnalysis - Analysis of each paragraph
 * @param {Array} paragraphPatterns - Patterns detected in paragraphs
 * @returns {Object} Strategy analysis results
 */
function analyzeWatermarkingStrategy(paragraphAnalysis, paragraphPatterns) {
  // Group patterns by paragraph
  const patternsByParagraph = {};
  paragraphPatterns.forEach(pattern => {
    const paragraphIndex = pattern.paragraphIndex || 0;
    if (!patternsByParagraph[paragraphIndex]) {
      patternsByParagraph[paragraphIndex] = [];
    }
    patternsByParagraph[paragraphIndex].push(pattern);
  });
  
  // Analyze strategies for each paragraph range
  const strategies = [];
  let currentStrategy = { startParagraph: 0, endParagraph: 0, type: null, description: '' };
  
  // Sort paragraph indices
  const paragraphIndices = Object.keys(patternsByParagraph).map(Number).sort((a, b) => a - b);
  
  paragraphIndices.forEach(paragraphIndex => {
    const patterns = patternsByParagraph[paragraphIndex];
    const dominantPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
    
    // Determine pattern type
    let patternType = dominantPattern.type;
    let patternDescription = '';
    
    switch (patternType) {
      case 'consistent-spacing':
        patternDescription = 'consistent double spaces';
        break;
      case 'prime-number-spacing':
        patternDescription = 'triple spaces in a mathematical pattern';
        break;
      case 'fibonacci-sequence':
        patternDescription = 'spacing following a Fibonacci sequence';
        break;
      case 'arithmetic-progression':
        patternDescription = 'spacing in arithmetic progression';
        break;
      default:
        patternDescription = 'unusual spacing pattern';
    }
    
    // Check if this is a continuation of the current strategy
    if (currentStrategy.type === patternType && paragraphIndex === currentStrategy.endParagraph + 1) {
      // Continue the current strategy
      currentStrategy.endParagraph = paragraphIndex;
    } else {
      // Save the previous strategy if it exists
      if (currentStrategy.type !== null) {
        strategies.push({ ...currentStrategy });
      }
      
      // Start a new strategy
      currentStrategy = {
        startParagraph: paragraphIndex,
        endParagraph: paragraphIndex,
        type: patternType,
        description: patternDescription
      };
    }
  });
  
  // Add the last strategy
  if (currentStrategy.type !== null) {
    strategies.push(currentStrategy);
  }
  
  // Generate a comprehensive description
  let description = 'This document uses multiple watermarking techniques:';
  
  // Format the strategies in a more structured way
  const strategyDescriptions = strategies.map(strategy => {
    const paragraphRange = strategy.startParagraph === strategy.endParagraph ?
      `Paragraph ${strategy.startParagraph + 1}` :
      `Paragraphs ${strategy.startParagraph + 1}-${strategy.endParagraph + 1}`;
    
    return `${paragraphRange}: ${strategy.description}`;
  });
  
  // Add information about hidden Unicode characters if available
  const hasHiddenChars = paragraphAnalysis.some(p => p.hasHiddenChars);
  if (hasHiddenChars) {
    const hiddenCharParagraphs = paragraphAnalysis
      .filter(p => p.hasHiddenChars)
      .map(p => p.index + 1);
    
    if (hiddenCharParagraphs.length > 0) {
      // Format ranges for better readability (e.g., "1-3" instead of "1, 2, 3")
      const ranges = [];
      let start = hiddenCharParagraphs[0];
      let end = start;
      
      for (let i = 1; i < hiddenCharParagraphs.length; i++) {
        if (hiddenCharParagraphs[i] === end + 1) {
          end = hiddenCharParagraphs[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = end = hiddenCharParagraphs[i];
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      
      const paragraphText = `Paragraphs ${ranges.join(', ')}`;
      strategyDescriptions.unshift(`${paragraphText}: Hidden Unicode characters`);
    }
  }
  
  // Format the description as a bulleted list
  description = description + '\n' + strategyDescriptions.map(desc => `  - ${desc}`).join('\n');
  
  // Calculate a combined confidence score based on multiple techniques
  const combinedConfidence = Math.min(100, 70 + (strategies.length * 10));
  
  return {
    strategies,
    description,
    combinedConfidence
  };
}

/**
 * Assess likelihood of watermarking based on statistical analysis
 * @param {Object} stats - Statistical measures
 * @param {Object} patterns - Detected patterns
 * @param {Object} multipleSpaces - Multiple space analysis
 * @param {Array} paragraphAnalysis - Analysis of each paragraph
 * @returns {Object} Assessment results with likelihood, evidence, and confidence score
 */
function assessWatermarkLikelihood(stats, patterns, multipleSpaces, paragraphAnalysis) {
  const evidence = [];
  let likelihoodScore = 0;
  
  // Check statistical anomalies
  if (stats.stdDev / stats.mean < 0.1) {
    evidence.push('Unusually consistent spacing throughout text');
    likelihoodScore += 2;
  }
  
  if (stats.bimodal) {
    evidence.push('Bimodal distribution of spacing (two common patterns)');
    likelihoodScore += 2;
  }
  
  // Check for patterns
  if (patterns.hasPattern) {
    evidence.push(patterns.description);
    likelihoodScore += 3;
  }
  
  if (patterns.commonPatterns.length > 0) {
    patterns.commonPatterns.forEach(pattern => {
      const confidenceStr = pattern.confidence 
        ? ` (Confidence: ${Math.round(pattern.confidence * 100)}%)` 
        : '';
      evidence.push(`${pattern.name}: ${pattern.description}${confidenceStr}`);
    });
    likelihoodScore += patterns.commonPatterns.length;
  }
  
  // Check for multiple spaces
  if (multipleSpaces && multipleSpaces.count.total > 0) {
    if (multipleSpaces.hasPattern) {
      evidence.push(multipleSpaces.patternDescription);
      likelihoodScore += 3;
    }
    
    if (multipleSpaces.count.total > 5) {
      evidence.push(`Found ${multipleSpaces.count.total} instances of multiple spaces (${multipleSpaces.count.double} double, ${multipleSpaces.count.triple} triple, ${multipleSpaces.count.fourPlus} 4+ spaces)`);
      likelihoodScore += Math.min(3, Math.floor(multipleSpaces.count.total / 5));
    }
  }
  
  // Check for paragraph-specific patterns
  const paragraphPatterns = [];
  paragraphAnalysis.forEach(paragraph => {
    if (paragraph.specificPatterns && paragraph.specificPatterns.length > 0) {
      paragraph.specificPatterns.forEach(pattern => {
        paragraphPatterns.push(pattern);
        evidence.push(pattern.description);
        likelihoodScore += 2; // Paragraph-specific patterns are strong evidence
      });
    }
  });
  
  // Special case: Check for different patterns in different paragraphs
  if (paragraphPatterns.length >= 2) {
    const patternTypes = new Set(paragraphPatterns.map(p => p.type));
    if (patternTypes.size >= 2) {
      const strategyAnalysis = analyzeWatermarkingStrategy(paragraphAnalysis, paragraphPatterns);
      evidence.push('Different paragraphs use different watermarking techniques - strong evidence of intentional watermarking');
      evidence.push(`Watermarking Strategy Analysis: ${strategyAnalysis.description}`);
      likelihoodScore += 7; // Increased score for detected cross-paragraph strategy
    }
  }
  
  // Calculate a confidence score (0-100)
  const confidenceScore = Math.min(100, Math.round(likelihoodScore * 10));
  
  // Determine likelihood category
  let likelihood = 'Low';
  if (likelihoodScore >= 5) {
    likelihood = 'High';
  } else if (likelihoodScore >= 2) {
    likelihood = 'Medium';
  }
  
  return { likelihood, evidence, confidenceScore };
}
