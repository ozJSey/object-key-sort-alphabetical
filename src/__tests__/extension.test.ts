// Unit tests for extension functions
// Mock VSCode API
const mockTextEdit = {
  replace: jest.fn((range: any, text: string) => ({ range, newText: text }))
};

const mockRange = jest.fn((start: any, end: any) => ({ start, end }));
const mockPosition = jest.fn((line: number, char: number) => ({ line, character: char }));

jest.mock('vscode', () => ({
  TextEdit: mockTextEdit,
  Range: mockRange,
  Position: mockPosition
}), { virtual: true });

import { _findBlocksAndSort, _applyEdits } from '../extension';

const createMockDocument = (content: string) => {
  return {
    getText: () => content,
    positionAt: (offset: number) => {
      const lines = content.substring(0, offset).split('\n');
      return { line: lines.length - 1, character: lines[lines.length - 1].length };
    },
    offsetAt: (position: { line: number; character: number }) => {
      const lines = content.split('\n');
      let offset = 0;
      for (let i = 0; i < position.line; i++) {
        offset += lines[i].length + 1;
      }
      return offset + position.character;
    }
  } as any;
};

const createMockEditor = (content: string) => {
  let currentContent = content;
  return {
    document: createMockDocument(currentContent),
    edit: jest.fn(async (callback: any) => {
      const builder = {
        replace: (range: any, text: string) => {
          const doc = createMockDocument(currentContent);
          const startOffset = doc.offsetAt(range.start);
          const endOffset = doc.offsetAt(range.end);
          currentContent = currentContent.substring(0, startOffset) + text + currentContent.substring(endOffset);
        }
      };
      callback(builder);
      return true;
    }),
    getContent: () => currentContent
  } as any;
};

describe('_findBlocksAndSort', () => {
  describe('Priority Sorting', () => {
    it('should prioritize __typename first', () => {
      const input = `const obj = { name: "test", id: "123", __typename: "User" };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('__typename: "User"');
      expect(edits[0].newText.indexOf('__typename')).toBeLessThan(edits[0].newText.indexOf('id'));
    });

    it('should prioritize id second', () => {
      const input = `const obj = { name: "test", age: 30, id: "123" };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('id: "123"');
      expect(edits[0].newText.indexOf('id')).toBeLessThan(edits[0].newText.indexOf('age'));
    });

    it('should prioritize _id third', () => {
      const input = `const obj = { name: "test", _id: "mongo", age: 30 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('_id: "mongo"');
      expect(edits[0].newText.indexOf('_id')).toBeLessThan(edits[0].newText.indexOf('age'));
    });

    it('should handle all three priorities together', () => {
      const input = `const obj = { name: "test", _id: "mongo", id: "123", __typename: "User", age: 30 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      const sorted = edits[0].newText;
      const typenamePos = sorted.indexOf('__typename');
      const idPos = sorted.indexOf('id:');
      const _idPos = sorted.indexOf('_id:');
      const agePos = sorted.indexOf('age:');
      
      expect(typenamePos).toBeLessThan(idPos);
      expect(idPos).toBeLessThan(_idPos);
      expect(_idPos).toBeLessThan(agePos);
    });
  });

  describe('Object Sorting', () => {
    it('should sort object properties alphabetically', () => {
      const input = `const obj = { zebra: 1, alpha: 2, monkey: 3 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText.indexOf('alpha')).toBeLessThan(edits[0].newText.indexOf('monkey'));
      expect(edits[0].newText.indexOf('monkey')).toBeLessThan(edits[0].newText.indexOf('zebra'));
    });

    it('should sort nested objects recursively', () => {
      const input = `const obj = {
  user: {
    name: "John",
    id: "123",
    email: "john@example.com"
  },
  version: "1.0"
};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits.some(edit => edit.newText.includes('id: "123"'))).toBe(true);
    });

    it('should handle deeply nested objects', () => {
      const input = `const obj = {
  level1: {
    level2: {
      zebra: 1,
      alpha: 2,
      id: "123"
    },
    beta: "test"
  }
};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits.some(edit => edit.newText.includes('id:') && edit.newText.includes('alpha:'))).toBe(true);
    });
  });

  describe('Array Sorting', () => {
    it('should sort flat primitive arrays', () => {
      const input = `const arr = ["zebra", "apple", "monkey", "banana"];`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('"apple"');
      expect(edits[0].newText.indexOf('"apple"')).toBeLessThan(edits[0].newText.indexOf('"banana"'));
    });

    it('should sort arrays with variable names', () => {
      const input = `const arr = [lastName, firstName, age, id];`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('age');
      expect(edits[0].newText.indexOf('age')).toBeLessThan(edits[0].newText.indexOf('firstName'));
    });

    it('should NOT sort arrays with objects', () => {
      const input = `const arr = [{ name: "B" }, { name: "A" }];`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      const arrayEdits = edits.filter(edit => edit.newText.includes('['));
      expect(arrayEdits.length).toBe(0);
    });

    it('should sort number arrays', () => {
      const input = `const nums = [5, 2, 8, 1, 3];`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('[1, 2, 3, 5, 8]');
    });
  });

  describe('Import Sorting', () => {
    it('should sort named imports alphabetically', () => {
      const input = `import { useState, useEffect, useMemo, useCallback } from "react";`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('useCallback');
      expect(edits[0].newText.indexOf('useCallback')).toBeLessThan(edits[0].newText.indexOf('useState'));
    });

    it('should preserve import formatting with newlines', () => {
      const input = `import {
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('\n');
      expect(edits[0].newText).toContain('useCallback');
    });
  });

  describe('TypeScript Support', () => {
    it('should sort interface properties with semicolons', () => {
      const input = `interface User {
  name: string;
  age: number;
  id: string;
}`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('id: string;');
      expect(edits[0].newText.indexOf('id:')).toBeLessThan(edits[0].newText.indexOf('name:'));
    });

    it('should sort type properties', () => {
      const input = `type User = {
  name: string;
  id: string;
  age: number;
};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain('id: string;');
    });
  });

  describe('Ignore Comments', () => {
    it('should skip sorting with auto-sort-ignore-next-line', () => {
      const input = `// auto-sort-ignore-next-line
const obj = { zebra: 1, apple: 2 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(0);
    });

    it('should skip sorting with auto-sort-ignore', () => {
      const input = `// auto-sort-ignore
const obj = { zebra: 1, apple: 2 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(0);
    });

    it('should sort other blocks when one is ignored', () => {
      const input = `// auto-sort-ignore
const obj1 = { zebra: 1, apple: 2 };
const obj2 = { zebra: 3, apple: 4 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(1);
    });
  });

  describe('Format Preservation', () => {
    it('should preserve trailing commas', () => {
      const input = `const obj = {
  zebra: 1,
  alpha: 2,
};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      // Verify trailing comma is preserved on last property
      expect(edits[0].newText).toMatch(/zebra: 1,/);
      expect(edits[0].newText).toMatch(/alpha: 2,/);
      // Both properties should have trailing commas
      const commaCount = (edits[0].newText.match(/,/g) || []).length;
      expect(commaCount).toBe(2);
    });

    it('should preserve spacing around properties', () => {
      const input = `const obj = { zebra: 1 , alpha: 2 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText).toContain(' ,');
    });

    it('should preserve semicolons in interfaces', () => {
      const input = `interface Test { zebra: string; alpha: number; }`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText.match(/;/g)?.length).toBe(2);
    });

    it('should preserve newlines in multi-line objects', () => {
      const input = `const obj = {
  zebra: 1,
  alpha: 2
};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText.match(/\n/g)?.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty objects', () => {
      const input = `const obj = {};`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(0);
    });

    it('should handle single property objects', () => {
      const input = `const obj = { only: true };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(0);
    });

    it('should handle already sorted objects', () => {
      const input = `const obj = { alpha: 1, beta: 2, gamma: 3 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBe(0);
    });

    it('should handle objects with string keys', () => {
      const input = `const obj = { "z-index": 1, "a-value": 2, id: "3" };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText.indexOf('id:')).toBeLessThan(edits[0].newText.indexOf('"a-value"'));
    });

    it('should handle shorthand properties', () => {
      const input = `const obj = { lastName, firstName, age, id };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(0);
      expect(edits[0].newText.indexOf('id')).toBeLessThan(edits[0].newText.indexOf('age'));
    });
  });

  describe('Edit Ordering', () => {
    it('should return edits sorted from end to start', () => {
      const input = `const obj1 = { z: 1, a: 2 };
const obj2 = { z: 3, a: 4 };
const obj3 = { z: 5, a: 6 };`;
      const doc = createMockDocument(input);
      const edits = _findBlocksAndSort(input, doc);
      
      expect(edits.length).toBeGreaterThan(1);
      for (let i = 1; i < edits.length; i++) {
        expect(edits[i - 1].range.start.line).toBeGreaterThanOrEqual(edits[i].range.start.line);
      }
    });
  });
});

describe('_applyEdits', () => {
  it('should apply single edit correctly', async () => {
    const input = `const obj = { zebra: 1, alpha: 2 };`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toContain('alpha: 2');
    expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('zebra'));
  });

  it('should apply multiple edits in correct order', async () => {
    const input = `const obj1 = { z: 1, a: 2 };
const obj2 = { z: 3, a: 4 };`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toContain('a: 2');
    expect(result).toContain('a: 4');
  });

  it('should apply nested object edits correctly', async () => {
    const input = `const obj = {
  outer: { z: 1, a: 2 },
  inner: { z: 3, a: 4 }
};`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toContain('a: 2');
    expect(result).toContain('a: 4');
  });

  it('should handle edits with no changes gracefully', async () => {
    const input = `const obj = { alpha: 1, beta: 2 };`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toBe(input);
  });

  it('should apply edits without creating overlaps', async () => {
    const input = `const a = { z: 1, b: 2 };
const b = { z: 3, b: 4 };
const c = { z: 5, b: 6 };`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toContain('b: 2');
    expect(result).toContain('b: 4');
    expect(result).toContain('b: 6');
  });

  it('should preserve formatting when applying edits', async () => {
    const input = `const obj = {
  zebra: 1,
  alpha: 2
};`;
    const editor = createMockEditor(input);
    const doc = createMockDocument(input);
    const edits = _findBlocksAndSort(input, doc);
    
    await _applyEdits(editor, edits);
    
    const result = editor.getContent();
    expect(result).toContain('\n');
    expect(result.match(/\n/g)?.length).toBe(input.match(/\n/g)?.length);
  });
});

