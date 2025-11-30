import { _isObjectLiteral, _sortBlock, _findBlocksAndSort, _isSortableContext } from '../extension';

describe('Comprehensive Sorting Tests', () => {
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
            const result = _isObjectLiteral(content);
            expect(result).toBe(true);
        });

        it('should sort interface properties', () => {
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
            
            // Check priority order: __typename, id, _id, then alphabetical
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
    });

    describe('Types with semicolons', () => {
        it('should sort type properties', () => {
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
            
            // Alphabetical order
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
    });

    describe('Nested objects', () => {
        it('should sort deeply nested objects recursively', () => {
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
            
            // Check outer level: metadata before user
            const metadataPos = result.indexOf('metadata');
            const userPos = result.indexOf('user');
            expect(metadataPos).toBeLessThan(userPos);
            
            // Check user level: id before name
            const userIdMatch = result.match(/user:\s*{[^}]*id:\s*"user-789"/);
            expect(userIdMatch).toBeTruthy();
            
            // Check settings level: id, language, notifications, theme
            const settingsMatch = result.match(/settings:\s*{[^}]*id:[^}]*language:[^}]*notifications:[^}]*theme/);
            expect(settingsMatch).toBeTruthy();
        });
    });

    describe('Objects inside arrays', () => {
        it('should sort objects inside arrays without sorting the array', () => {
            const input = `const data = [
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
            
            // Should have edits for both objects in the array
            expect(edits.length).toBeGreaterThan(0);
            
            const result = input;
            // Apply edits manually (simplified)
            let sortedResult = result;
            edits.forEach(edit => {
                // Check that priority sorting is applied
                expect(edit.newText).toContain('__typename');
                expect(edit.newText.indexOf('__typename')).toBeLessThan(edit.newText.indexOf('id:'));
            });
        });
    });

    describe('eventHandlers', () => {
        it('should detect and sort eventHandlers', () => {
            const content = `
  onSubmit: (event: any) => {
    event.preventDefault();
    console.log("Form submitted");
  },
  onClick: () => {
    console.log("Clicked");
  },
  onChange: (value: string) => {
    console.log("Value changed:", value);
  },
  onLoad: async () => {
    const data = await fetch("/api/data");
    return data.json();
  }
`;
            
            const result = _isObjectLiteral(content);
            expect(result).toBe(true);
        });

        it('should sort eventHandlers block', () => {
            const input = `{
  onSubmit: (event: any) => {
    event.preventDefault();
    console.log("Form submitted");
  },
  onClick: () => {
    console.log("Clicked");
  },
  onChange: (value: string) => {
    console.log("Value changed:", value);
  },
  onLoad: async () => {
    const data = await fetch("/api/data");
    return data.json();
  }
}`;
            
            const result = _sortBlock(input);
            
            // Should be sorted: onChange, onClick, onLoad, onSubmit
            const changePos = result.indexOf('onChange');
            const clickPos = result.indexOf('onClick');
            const loadPos = result.indexOf('onLoad');
            const submitPos = result.indexOf('onSubmit');
            
            expect(changePos).toBeLessThan(clickPos);
            expect(clickPos).toBeLessThan(loadPos);
            expect(loadPos).toBeLessThan(submitPos);
        });
    });

    describe('TypeScript generics', () => {
        it('should handle TypeScript generics without breaking', () => {
            const input = `{
  private cache: Map<string, any>;
  private timeout: number;
}`;
            
            const result = _sortBlock(input);
            
            // Should preserve Map<string, any> exactly
            expect(result).toContain('Map<string, any>');
            expect(result).toContain('cache');
            expect(result).toContain('timeout');
            
            // cache should come before timeout
            expect(result.indexOf('cache')).toBeLessThan(result.indexOf('timeout'));
        });
    });
});

