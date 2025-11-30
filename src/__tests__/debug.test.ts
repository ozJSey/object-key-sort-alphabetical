import { _isObjectLiteral, _sortBlock, _findBlocksAndSort } from '../extension';

describe('Debug eventHandlers', () => {
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

    it('should recursively sort nested objects inside arrays', () => {
        const code = `const data = {
  users: [
    {
      name: "User One",
      email: "user1@example.com",
      _id: "mongo1",
      id: "1",
      __typename: "User"
    }
  ]
};`;
        
        // Mock document
        const mockDoc = {
            positionAt: (offset: number) => ({ line: 0, character: offset }),
            getText: () => code
        } as any;
        
        const edits = _findBlocksAndSort(code, mockDoc);
        
        // Should have 1 edit (outer block with recursive sorting applied)
        expect(edits.length).toBe(1);
        
        // The edit should contain the sorted nested object
        const editText = edits[0].newText;
        
        // Should contain all the properties
        expect(editText).toContain('__typename');
        expect(editText).toContain('id:');
        expect(editText).toContain('_id');
        expect(editText).toContain('email');
        expect(editText).toContain('name');
        
        // Priority order: __typename appears before id, id before _id
        const typenameIndex = editText.indexOf('__typename');
        const idIndex = editText.indexOf('id: "1"');
        const underscoreIdIndex = editText.indexOf('_id:');
        
        expect(typenameIndex).toBeLessThan(idIndex);
        expect(idIndex).toBeLessThan(underscoreIdIndex);
    });

    it('should preserve inline comments with their properties', () => {
        const input = `{
  timeout: 5000, // Maximum timeout in milliseconds
  retries: 3, // Number of retry attempts
  id: "config-456", // Unique identifier
  enabled: true, // Feature flag
  apiKey: "secret-key" // API authentication key
}`;
        
        const result = _sortBlock(input);
        
        // Each property should keep its comment
        expect(result).toContain('apiKey: "secret-key" // API authentication key');
        expect(result).toContain('enabled: true, // Feature flag');
        expect(result).toContain('id: "config-456", // Unique identifier');
        expect(result).toContain('retries: 3, // Number of retry attempts');
        expect(result).toContain('timeout: 5000, // Maximum timeout in milliseconds');
        
        // Check order: id (priority), then apiKey, enabled, retries, timeout (alphabetical)
        const idPos = result.indexOf('id:');
        const apiKeyPos = result.indexOf('apiKey');
        const enabledPos = result.indexOf('enabled');
        const retriesPos = result.indexOf('retries');
        const timeoutPos = result.indexOf('timeout');
        
        // id has priority, so it comes first
        expect(idPos).toBeLessThan(apiKeyPos);
        // Then alphabetical
        expect(apiKeyPos).toBeLessThan(enabledPos);
        expect(enabledPos).toBeLessThan(retriesPos);
        expect(retriesPos).toBeLessThan(timeoutPos);
    });
});

