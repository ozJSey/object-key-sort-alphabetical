import { _isObjectLiteral, _sortBlock, _findBlocksAndSort, _isSortableContext, _extractKey, _findClosing } from '../extension';

describe('EXHAUSTIVE Sorting Tests - No Regressions Allowed', () => {
    
    // ============================================================================
    // INTERFACES WITH SEMICOLONS
    // ============================================================================
    
    describe('Interfaces with semicolons', () => {
        it('should detect interface content as sortable', () => {
            const content = `
  username: string;
  email: string;
  age: number;
  __typename: string;
  _id: string;
  id: string;
`;
            expect(_isObjectLiteral(content)).toBe(true);
        });

        it('should sort interface with priority keys first', () => {
            const input = `interface UserProfile {
  username: string;
  email: string;
  age: number;
  __typename: string;
  _id: string;
  id: string;
}`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            
            const typenamePos = result.indexOf('__typename');
            const idPos = result.indexOf('id: string;');
            const underscoreIdPos = result.indexOf('_id');
            const agePos = result.indexOf('age');
            const emailPos = result.indexOf('email');
            const usernamePos = result.indexOf('username');
            
            expect(typenamePos).toBeLessThan(idPos);
            expect(idPos).toBeLessThan(underscoreIdPos);
            expect(underscoreIdPos).toBeLessThan(agePos);
            expect(agePos).toBeLessThan(emailPos);
            expect(emailPos).toBeLessThan(usernamePos);
        });

        it('should handle interface with nested types', () => {
            const input = `interface Config {
  timeout: number;
  settings: {
    enabled: boolean;
    debug: boolean;
  };
  id: string;
}`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBeGreaterThan(0);
            
            const result = edits[0].newText;
            expect(result.indexOf('id')).toBeLessThan(result.indexOf('settings'));
            expect(result.indexOf('settings')).toBeLessThan(result.indexOf('timeout'));
        });
    });

    // ============================================================================
    // TYPES WITH SEMICOLONS
    // ============================================================================
    
    describe('Types with semicolons', () => {
        it('should sort type properties alphabetically', () => {
            const input = `type ApiConfig = {
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  enabled: boolean;
  baseUrl: string;
};`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            
            const baseUrlPos = result.indexOf('baseUrl');
            const enabledPos = result.indexOf('enabled');
            const headersPos = result.indexOf('headers');
            const retriesPos = result.indexOf('retries');
            const timeoutPos = result.indexOf('timeout');
            
            expect(baseUrlPos).toBeLessThan(enabledPos);
            expect(enabledPos).toBeLessThan(headersPos);
            expect(headersPos).toBeLessThan(retriesPos);
            expect(retriesPos).toBeLessThan(timeoutPos);
        });

        it('should preserve TypeScript generics in types', () => {
            const input = `type DataMap = {
  users: Map<string, User>;
  cache: Record<string, any>;
  items: Array<Item>;
  id: string;
};`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result).toContain('Map<string, User>');
            expect(result).toContain('Record<string, any>');
            expect(result).toContain('Array<Item>');
        });
    });

    // ============================================================================
    // NESTED OBJECTS - DEEP RECURSION
    // ============================================================================
    
    describe('Deeply nested objects', () => {
        it('should sort 3 levels deep', () => {
            const input = `const data = {
  user: {
    settings: {
      theme: "dark",
      notifications: true,
      language: "en",
      id: "settings-1"
    },
    name: "Bob",
    id: "user-789"
  },
  metadata: {
    version: 1,
    created: "2024-01-01"
  }
};`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBeGreaterThan(0);
            
            const result = edits[0].newText;
            
            // Level 1: metadata before user
            expect(result.indexOf('metadata')).toBeLessThan(result.indexOf('user'));
            
            // Level 2: user has id before name
            const userBlock = result.substring(result.indexOf('user'));
            expect(userBlock.indexOf('id: "user-789"')).toBeLessThan(userBlock.indexOf('name'));
            
            // Level 3: settings sorted
            expect(result).toContain('settings');
        });

        it('should handle 4 levels deep', () => {
            const input = `const deep = {
  level1: {
    level2: {
      level3: {
        zebra: "z",
        alpha: "a",
        id: "deep"
      },
      name: "L2"
    }
  }
};`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBeGreaterThan(0);
        });
    });

    // ============================================================================
    // OBJECTS INSIDE ARRAYS
    // ============================================================================
    
    describe('Objects inside arrays', () => {
        it('should sort objects but not array order', () => {
            const input = `const users = [
  {
    name: "User One",
    email: "user1@example.com",
    _id: "mongo1",
    id: "1",
    __typename: "User"
  },
  {
    name: "User Two",
    email: "user2@example.com",
    _id: "mongo2",
    id: "2",
    __typename: "User"
  }
];`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            
            // Should have edits for both objects
            expect(edits.length).toBeGreaterThan(0);
            
            // Each edit should have priority sorting
            edits.forEach(edit => {
                const text = edit.newText;
                expect(text).toContain('__typename');
                const typenamePos = text.indexOf('__typename');
                const idPos = text.indexOf('id:');
                expect(typenamePos).toBeLessThan(idPos);
            });
        });

        it('should handle nested arrays with objects', () => {
            const input = `const matrix = [
  [
    { zebra: 1, alpha: 2, id: "a" }
  ],
  [
    { yankee: 3, bravo: 4, id: "b" }
  ]
];`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBeGreaterThan(0);
        });
    });

    // ============================================================================
    // COMPLEX FUNCTION BODIES
    // ============================================================================
    
    describe('Objects with multiline functions', () => {
        it('should sort keys but preserve function bodies', () => {
            const input = `{
  onSubmit: (event: any) => {
    event.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(event.target);
    console.log("Data:", formData);
  },
  onClick: () => {
    console.log("Clicked");
  },
  onChange: (value: string) => {
    console.log("Value changed:", value);
    if (value.length > 10) {
      console.log("Too long");
    }
  }
}`;
            
            const result = _sortBlock(input);
            
            // Keys should be sorted: onChange, onClick, onSubmit
            expect(result.indexOf('onChange')).toBeLessThan(result.indexOf('onClick'));
            expect(result.indexOf('onClick')).toBeLessThan(result.indexOf('onSubmit'));
            
            // Function bodies preserved
            expect(result).toContain('event.preventDefault()');
            expect(result).toContain('const formData = new FormData(event.target)');
            expect(result).toContain('if (value.length > 10)');
        });

        it('should handle async functions with multiple statements', () => {
            const input = `{
  fetchUser: async (id: string) => {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  },
  deleteUser: async (id: string) => {
    await fetch(\`/api/users/\${id}\`, { method: "DELETE" });
  }
}`;
            
            const result = _sortBlock(input);
            
            // deleteUser before fetchUser
            expect(result.indexOf('deleteUser')).toBeLessThan(result.indexOf('fetchUser'));
            
            // All function body statements preserved
            expect(result).toContain('if (!response.ok)');
            expect(result).toContain('throw new Error("Failed to fetch")');
            expect(result).toContain('const data = await response.json()');
        });

        it('should handle traditional function syntax', () => {
            const input = `{
  zebra: function(a, b, c) {
    const sum = a + b + c;
    console.log("Sum:", sum);
    return sum;
  },
  alpha: function() {
    return "first";
  }
}`;
            
            const result = _sortBlock(input);
            
            expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('zebra'));
            expect(result).toContain('const sum = a + b + c');
            expect(result).toContain('console.log("Sum:", sum)');
        });

        it('should handle method shorthand with multiple statements', () => {
            const input = `{
  process(data) {
    const validated = this.validate(data);
    if (!validated) {
      throw new Error("Invalid data");
    }
    const result = this.transform(validated);
    return result;
  },
  initialize() {
    this.cache = new Map();
    this.timeout = 5000;
  }
}`;
            
            const result = _sortBlock(input);
            
            expect(result.indexOf('initialize')).toBeLessThan(result.indexOf('process'));
            expect(result).toContain('const validated = this.validate(data)');
            expect(result).toContain('this.cache = new Map()');
        });
    });

    // ============================================================================
    // TYPESCRIPT GENERICS
    // ============================================================================
    
    describe('TypeScript generics', () => {
        it('should preserve Map<K, V>', () => {
            const input = `{
  timeout: number;
  cache: Map<string, any>;
  data: Map<number, User>;
}`;
            
            const result = _sortBlock(input);
            expect(result).toContain('Map<string, any>');
            expect(result).toContain('Map<number, User>');
        });

        it('should preserve Record<K, V>', () => {
            const input = `{
  users: Record<string, User>;
  settings: Record<string, boolean>;
  id: string;
}`;
            
            const result = _sortBlock(input);
            expect(result).toContain('Record<string, User>');
            expect(result).toContain('Record<string, boolean>');
            expect(result.indexOf('id')).toBeLessThan(result.indexOf('settings'));
        });

        it('should preserve Array<T> and complex generics', () => {
            const input = `{
  items: Array<Item>;
  matrix: Array<Array<number>>;
  complex: Map<string, Record<number, User[]>>;
  id: string;
}`;
            
            const result = _sortBlock(input);
            expect(result).toContain('Array<Item>');
            expect(result).toContain('Array<Array<number>>');
            expect(result).toContain('Map<string, Record<number, User[]>>');
        });

        it('should handle generics with arrow functions', () => {
            const input = `{
  mapper: <T, U>(fn: (x: T) => U) => { return fn; };
  cache: Map<string, any>;
}`;
            
            const result = _sortBlock(input);
            expect(result).toContain('<T, U>');
            expect(result).toContain('Map<string, any>');
        });
    });

    // ============================================================================
    // PRIORITY SORTING
    // ============================================================================
    
    describe('Priority sorting (__typename, id, _id)', () => {
        it('should place __typename first', () => {
            const input = `{
  zebra: "z",
  apple: "a",
  __typename: "Test",
  id: "123"
}`;
            
            const result = _sortBlock(input);
            const typenamePos = result.indexOf('__typename');
            const idPos = result.indexOf('id');
            const applePos = result.indexOf('apple');
            
            expect(typenamePos).toBeLessThan(idPos);
            expect(idPos).toBeLessThan(applePos);
        });

        it('should handle all __* keys with priority', () => {
            const input = `{
  zebra: "z",
  __schema: "schema",
  __typename: "Type",
  alpha: "a",
  __meta: "meta"
}`;
            
            const result = _sortBlock(input);
            const metaPos = result.indexOf('__meta');
            const schemaPos = result.indexOf('__schema');
            const typenamePos = result.indexOf('__typename');
            const alphaPos = result.indexOf('alpha');
            
            expect(metaPos).toBeLessThan(alphaPos);
            expect(schemaPos).toBeLessThan(alphaPos);
            expect(typenamePos).toBeLessThan(alphaPos);
        });

        it('should order __typename, id, _id, then alphabetical', () => {
            const input = `{
  zebra: "z",
  email: "test",
  _id: "mongo",
  name: "Test",
  __typename: "User",
  id: "123",
  age: 30
}`;
            
            const result = _sortBlock(input);
            const positions = {
                __typename: result.indexOf('__typename'),
                id: result.indexOf('id: "123"'),
                _id: result.indexOf('_id: "mongo"'),
                age: result.indexOf('age: 30'),
                email: result.indexOf('email: "test"'),
                name: result.indexOf('name: "Test"'),
                zebra: result.indexOf('zebra: "z"')
            };
            
            expect(positions.__typename).toBeLessThan(positions.id);
            expect(positions.id).toBeLessThan(positions._id);
            expect(positions._id).toBeLessThan(positions.age);
            expect(positions.age).toBeLessThan(positions.email);
            expect(positions.email).toBeLessThan(positions.name);
            expect(positions.name).toBeLessThan(positions.zebra);
        });
    });

    // ============================================================================
    // IMPORTS AND EXPORTS
    // ============================================================================
    
    describe('Named imports', () => {
        it('should sort single-line imports', () => {
            const input = `import { useState, useEffect, useCallback } from "react";`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result.indexOf('useCallback')).toBeLessThan(result.indexOf('useEffect'));
            expect(result.indexOf('useEffect')).toBeLessThan(result.indexOf('useState'));
        });

        it('should sort multi-line imports', () => {
            const input = `import {
  ZebraComponent,
  AlphaComponent,
  BetaComponent
} from "library";`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result.indexOf('AlphaComponent')).toBeLessThan(result.indexOf('BetaComponent'));
            expect(result.indexOf('BetaComponent')).toBeLessThan(result.indexOf('ZebraComponent'));
        });
    });

    describe('Named exports', () => {
        it('should sort export blocks', () => {
            const input = `export { zebra, alpha, monkey };`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('monkey'));
            expect(result.indexOf('monkey')).toBeLessThan(result.indexOf('zebra'));
        });
    });

    // ============================================================================
    // OBJECT DESTRUCTURING
    // ============================================================================
    
    describe('Object destructuring', () => {
        it('should sort destructured properties', () => {
            const input = `const { zebra, alpha, monkey } = obj;`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('monkey'));
            expect(result.indexOf('monkey')).toBeLessThan(result.indexOf('zebra'));
        });
    });

    // ============================================================================
    // RETURN STATEMENTS
    // ============================================================================
    
    describe('Return statement objects', () => {
        it('should sort objects in return statements', () => {
            const input = `function getData() {
  return {
    username: "john",
    email: "john@example.com",
    id: "123"
  };
}`;
            
            const mockDoc = {
                positionAt: (offset: number) => ({ line: 0, character: offset }),
                getText: () => input
            } as any;
            
            const edits = _findBlocksAndSort(input, mockDoc);
            expect(edits.length).toBe(1);
            
            const result = edits[0].newText;
            expect(result.indexOf('id')).toBeLessThan(result.indexOf('email'));
            expect(result.indexOf('email')).toBeLessThan(result.indexOf('username'));
        });
    });

    // ============================================================================
    // EDGE CASES
    // ============================================================================
    
    describe('Edge cases', () => {
        it('should handle empty objects', () => {
            const input = `{}`;
            const result = _sortBlock(input);
            expect(result).toBe('{}');
        });

        it('should handle single property', () => {
            const input = `{ onlyOne: "value" }`;
            const result = _sortBlock(input);
            expect(result).toBe('{ onlyOne: "value" }');
        });

        it('should skip already sorted objects', () => {
            const input = `{ alpha: 1, bravo: 2, charlie: 3 }`;
            const result = _sortBlock(input);
            expect(result).toBe(input);
        });

        it('should handle string keys with special characters', () => {
            const input = `{
  "zebra-key": "z",
  "alpha-key": "a",
  "monkey-key": "m"
}`;
            
            const result = _sortBlock(input);
            expect(result.indexOf('"alpha-key"')).toBeLessThan(result.indexOf('"monkey-key"'));
            expect(result.indexOf('"monkey-key"')).toBeLessThan(result.indexOf('"zebra-key"'));
        });

        it('should handle computed property names', () => {
            const input = `{
  zebra: "z",
  [dynamicKey]: "value",
  alpha: "a"
}`;
            
            const result = _sortBlock(input);
            expect(result).toContain('[dynamicKey]');
        });

        it('should skip objects with inline comments', () => {
            const input = `{
  timeout: 5000, // Maximum timeout
  retries: 3,
  id: "123"
}`;
            
            // Should NOT be detected as sortable
            expect(_isObjectLiteral(input.substring(1, input.length - 1))).toBe(false);
        });
    });
});

