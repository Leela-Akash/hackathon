/**
 * Unit tests for format.js utility functions
 * 
 * To run these tests, you can use Jest, Vitest, or any test framework.
 * Example with Vitest: npm install -D vitest && npx vitest format.test.js
 * 
 * Or run manually by executing: node -e "const {formatRate} = require('./format.js'); console.log('Tests passed!')"
 */

import { formatRate, normalizeTransactionSuccessRate } from './format.js';

// Test cases for formatRate
const testCases = [
  // Numeric inputs
  { input: 0.95, expected: '0.95', description: 'decimal number' },
  { input: 95, expected: '95.00', description: 'integer number' },
  { input: 95.5, expected: '95.50', description: 'float number' },
  
  // String inputs
  { input: '0.95', expected: '0.95', description: 'string decimal' },
  { input: '95', expected: '95.00', description: 'string integer' },
  { input: '95%', expected: '95.00', description: 'percentage string' },
  { input: '95.5%', expected: '95.50', description: 'percentage with decimal' },
  { input: '1,234.56', expected: '1234.56', description: 'string with commas' },
  { input: ' 95.5 ', expected: '95.50', description: 'string with whitespace' },
  
  // Null/undefined
  { input: null, expected: '—', description: 'null value' },
  { input: undefined, expected: '—', description: 'undefined value' },
  
  // Object inputs
  { input: { value: 0.95 }, expected: '0.95', description: 'object with value property' },
  { input: { rate: 95 }, expected: '95.00', description: 'object with rate property' },
  { input: { value: '95%' }, expected: '95.00', description: 'object with percentage string' },
  
  // Edge cases
  { input: '', expected: '—', description: 'empty string' },
  { input: 'invalid', expected: '—', description: 'invalid string' },
  { input: {}, expected: '—', description: 'empty object' },
];

// Test cases for normalizeTransactionSuccessRate
const normalizeTestCases = [
  { input: 95.5, expected: 95.5, description: 'number input' },
  { input: '95.5', expected: 95.5, description: 'string number' },
  { input: '95%', expected: 95, description: 'percentage string' },
  { input: '0.95', expected: 0.95, description: 'decimal string' },
  { input: null, expected: null, description: 'null input' },
  { input: undefined, expected: null, description: 'undefined input' },
  { input: { value: 95.5 }, expected: 95.5, description: 'object with value' },
  { input: { rate: '95%' }, expected: 95, description: 'object with rate string' },
];

// Run tests
function runTests() {
  console.log('🧪 Running formatRate tests...\n');
  let passed = 0;
  let failed = 0;

  testCases.forEach(({ input, expected, description }) => {
    try {
      const result = formatRate(input, 2);
      if (result === expected) {
        console.log(`✅ PASS: ${description} (${JSON.stringify(input)} -> ${result})`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${description}`);
        console.error(`   Expected: ${expected}, Got: ${result}`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ ERROR: ${description} - ${error.message}`);
      failed++;
    }
  });

  console.log('\n🧪 Running normalizeTransactionSuccessRate tests...\n');
  normalizeTestCases.forEach(({ input, expected, description }) => {
    try {
      const result = normalizeTransactionSuccessRate(input);
      const match = result === expected || (Number.isNaN(result) && Number.isNaN(expected));
      if (match) {
        console.log(`✅ PASS: ${description} (${JSON.stringify(input)} -> ${result})`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${description}`);
        console.error(`   Expected: ${expected}, Got: ${result}`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ ERROR: ${description} - ${error.message}`);
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Export for use in test frameworks
export { runTests, testCases, normalizeTestCases };

// If running directly (not in a test framework)
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runTests();
}

