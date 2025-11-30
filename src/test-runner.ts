// Simple test runner for our extension
// Run with: node out/test-runner.js

// Mock VSCode API BEFORE importing extension
class MockTextEdit {
  constructor(public range: any, public newText: string) {}
  
  static replace(range: any, text: string) {
    return new MockTextEdit(range, text);
  }
}

class MockRange {
  constructor(public start: any, public end: any) {}
}

class MockPosition {
  constructor(public line: number, public character: number) {}
}

// Set up vscode mock in require cache BEFORE requiring extension
require.cache['vscode'] = {
  exports: {
    TextEdit: MockTextEdit,
    Range: MockRange,
    Position: MockPosition
  }
} as any;

const createMockDocument = (content: string) => {
  return {
    getText: () => content,
    positionAt: (offset: number) => {
      const lines = content.substring(0, offset).split('\n');
      return new MockPosition(lines.length - 1, lines[lines.length - 1].length);
    },
    offsetAt: (position: MockPosition) => {
      const lines = content.split('\n');
      let offset = 0;
      for (let i = 0; i < position.line; i++) {
        offset += lines[i].length + 1;
      }
      return offset + position.character;
    }
  };
};

// Test suite
const tests = [
  {
    name: "Priority Sorting - __typename first",
    input: `const obj = { name: "test", id: "123", __typename: "User" };`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits but got none");
      const sorted = edits[0].newText;
      const typenamePos = sorted.indexOf('__typename');
      const idPos = sorted.indexOf('id:');
      const namePos = sorted.indexOf('name:');
      if (typenamePos >= idPos || idPos >= namePos) {
        throw new Error(`Wrong order: __typename at ${typenamePos}, id at ${idPos}, name at ${namePos}`);
      }
      return true;
    }
  },
  {
    name: "Priority Sorting - id second",
    input: `const obj = { name: "test", age: 30, id: "123" };`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits but got none");
      const sorted = edits[0].newText;
      const idPos = sorted.indexOf('id:');
      const agePos = sorted.indexOf('age:');
      const namePos = sorted.indexOf('name:');
      if (idPos >= agePos || agePos >= namePos) {
        throw new Error(`Wrong order: id at ${idPos}, age at ${agePos}, name at ${namePos}`);
      }
      return true;
    }
  },
  {
    name: "Priority Sorting - _id third",
    input: `const obj = { name: "test", _id: "mongo", age: 30 };`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits but got none");
      const sorted = edits[0].newText;
      if (!sorted.includes('_id:')) throw new Error("_id not found in sorted output");
      return true;
    }
  },
  {
    name: "Nested Objects",
    input: `const obj = { user: { name: "John", id: "123" }, version: "1.0" };`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits for nested objects");
      return true;
    }
  },
  {
    name: "Primitive Arrays",
    input: `const arr = ["zebra", "apple", "monkey"];`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits for array");
      const sorted = edits[0].newText;
      if (sorted.indexOf('"apple"') >= sorted.indexOf('"monkey"')) {
        throw new Error("Array not sorted correctly");
      }
      return true;
    }
  },
  {
    name: "Imports Sorting",
    input: `import { useState, useEffect, useMemo, useCallback } from "react";`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits for imports");
      const sorted = edits[0].newText;
      if (sorted.indexOf('useCallback') >= sorted.indexOf('useState')) {
        throw new Error("Imports not sorted correctly");
      }
      return true;
    }
  },
  {
    name: "Interface Sorting",
    input: `interface User { name: string; age: number; id: string; }`,
    verify: (edits: any[]) => {
      if (edits.length === 0) throw new Error("Expected edits for interface");
      const sorted = edits[0].newText;
      if (!sorted.includes('id:')) throw new Error("id not found in sorted interface");
      return true;
    }
  },
  {
    name: "Ignore Comment - next line",
    input: `// auto-sort-ignore-next-line\nconst obj = { zebra: 1, apple: 2 };`,
    verify: (edits: any[]) => {
      if (edits.length !== 0) throw new Error("Should not sort ignored block");
      return true;
    }
  },
  {
    name: "Ignore Comment - same line",
    input: `// auto-sort-ignore\nconst obj = { zebra: 1, apple: 2 };`,
    verify: (edits: any[]) => {
      if (edits.length !== 0) throw new Error("Should not sort ignored block");
      return true;
    }
  },
  {
    name: "Already Sorted",
    input: `const obj = { alpha: 1, beta: 2, gamma: 3 };`,
    verify: (edits: any[]) => {
      if (edits.length !== 0) throw new Error("Should not edit already sorted object");
      return true;
    }
  },
  {
    name: "Empty Object",
    input: `const obj = {};`,
    verify: (edits: any[]) => {
      if (edits.length !== 0) throw new Error("Should not edit empty object");
      return true;
    }
  },
  {
    name: "Single Property",
    input: `const obj = { only: true };`,
    verify: (edits: any[]) => {
      if (edits.length !== 0) throw new Error("Should not edit single property object");
      return true;
    }
  }
];

console.log("🧪 Running Extension Tests...\n");

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  try {
    console.log(`Test ${index + 1}/${tests.length}: ${test.name}`);
    
    const doc = createMockDocument(test.input);
    
    // Import extension (vscode is already mocked)
    const ext = require('./extension');
    const _findBlocksAndSort = ext._findBlocksAndSort || ext.default?._findBlocksAndSort;
    
    if (!_findBlocksAndSort) {
      throw new Error("Could not find _findBlocksAndSort function in extension");
    }
    
    const edits = _findBlocksAndSort(test.input, doc);
    
    test.verify(edits);
    
    console.log(`  ✅ PASSED\n`);
    passed++;
  } catch (error: any) {
    console.log(`  ❌ FAILED: ${error.message}\n`);
    failed++;
  }
});

console.log("=".repeat(60));
console.log(`\nTest Results: ${passed} passed, ${failed} failed out of ${tests.length} total`);
console.log(`Success Rate: ${Math.round((passed / tests.length) * 100)}%\n`);

if (failed > 0) {
  process.exit(1);
}

