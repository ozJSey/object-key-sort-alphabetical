import { _isObjectLiteral, _extractKey, _sortBlock, _findClosing } from '../extension';

describe('_isObjectLiteral', () => {
    it('should detect simple object with key-value pairs', () => {
        expect(_isObjectLiteral('name: "John", age: 30')).toBe(true);
    });

    it('should detect object with functions', () => {
        expect(_isObjectLiteral('onClick: () => {}, onChange: () => {}')).toBe(true);
    });

    it('should detect object with await in value', () => {
        expect(_isObjectLiteral('data: await fetch("/api"), message: "Success"')).toBe(true);
    });

    it('should detect shorthand properties', () => {
        expect(_isObjectLiteral('name, age, id')).toBe(true);
    });

    it('should NOT detect function body', () => {
        expect(_isObjectLiteral('const x = 1; return x;')).toBe(false);
    });

    it('should NOT detect if statement', () => {
        expect(_isObjectLiteral('if (condition) { doSomething(); }')).toBe(false);
    });

    it('should NOT detect empty content', () => {
        expect(_isObjectLiteral('')).toBe(false);
        expect(_isObjectLiteral('   ')).toBe(false);
    });

    it('should detect TypeScript interface properties', () => {
        expect(_isObjectLiteral('name: string; age: number; id: string;')).toBe(true);
    });

    it('should handle nested objects correctly', () => {
        expect(_isObjectLiteral('user: { name: "John", age: 30 }, active: true')).toBe(true);
    });

    it('should handle arrays in values', () => {
        expect(_isObjectLiteral('tags: ["a", "b"], count: 2')).toBe(true);
    });
});

describe('_extractKey', () => {
    it('should extract key from key:value pair', () => {
        expect(_extractKey('name: "John"')).toBe('name');
    });

    it('should extract key from string key', () => {
        expect(_extractKey('"api-key": "secret"')).toBe('api-key');
    });

    it('should extract key from single quote string', () => {
        expect(_extractKey("'data-id': 123")).toBe('data-id');
    });

    it('should extract shorthand property', () => {
        expect(_extractKey('name')).toBe('name');
        expect(_extractKey('id')).toBe('id');
    });

    it('should extract key with whitespace', () => {
        expect(_extractKey('  name: "John"  ')).toBe('name');
    });

    it('should extract __typename', () => {
        expect(_extractKey('__typename: "User"')).toBe('__typename');
    });

    it('should extract _id', () => {
        expect(_extractKey('_id: "mongo123"')).toBe('_id');
    });

    it('should return null for invalid property', () => {
        expect(_extractKey('')).toBe(null);
        expect(_extractKey('   ')).toBe(null);
    });
});

describe('_sortBlock', () => {
    it('should sort simple object alphabetically', () => {
        const input = '{ zebra: 1, alpha: 2, monkey: 3 }';
        const result = _sortBlock(input);
        expect(result).toBe('{ alpha: 2, monkey: 3, zebra: 1 }');
    });

    it('should prioritize __typename, id, _id', () => {
        const input = '{ name: "John", id: "123", __typename: "User", _id: "mongo" }';
        const result = _sortBlock(input);
        expect(result).toContain('__typename');
        expect(result.indexOf('__typename')).toBeLessThan(result.indexOf('id'));
        expect(result.indexOf('id')).toBeLessThan(result.indexOf('_id'));
        expect(result.indexOf('_id')).toBeLessThan(result.indexOf('name'));
    });

    it('should preserve formatting with newlines', () => {
        const input = `{
  zebra: 1,
  alpha: 2
}`;
        const result = _sortBlock(input);
        expect(result).toContain('\n');
        expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('zebra'));
    });

    it('should preserve function values', () => {
        const input = '{ onClick: () => {}, onChange: () => {} }';
        const result = _sortBlock(input);
        expect(result).toContain('onChange: () => {}');
        expect(result).toContain('onClick: () => {}');
        expect(result.indexOf('onChange')).toBeLessThan(result.indexOf('onClick'));
    });

    it('should not modify already sorted object', () => {
        const input = '{ alpha: 1, beta: 2, gamma: 3 }';
        const result = _sortBlock(input);
        expect(result).toBe(input);
    });

    it('should handle single property', () => {
        const input = '{ onlyOne: true }';
        const result = _sortBlock(input);
        expect(result).toBe(input);
    });

    it('should handle empty object', () => {
        const input = '{}';
        const result = _sortBlock(input);
        expect(result).toBe(input);
    });

    it('should preserve string keys', () => {
        const input = '{ "z-index": 100, "a-value": "test" }';
        const result = _sortBlock(input);
        expect(result.indexOf('"a-value"')).toBeLessThan(result.indexOf('"z-index"'));
    });

    it('should preserve complex nested values', () => {
        const input = '{ zebra: { nested: true }, alpha: [1, 2, 3] }';
        const result = _sortBlock(input);
        expect(result).toContain('{ nested: true }');
        expect(result).toContain('[1, 2, 3]');
        expect(result.indexOf('alpha')).toBeLessThan(result.indexOf('zebra'));
    });
});

describe('_findClosing', () => {
    it('should find closing brace for simple object', () => {
        const text = '{ name: "John" }';
        const result = _findClosing(text, 0);
        expect(result).toBe(15);
    });

    it('should find closing brace for nested objects', () => {
        const text = '{ outer: { inner: true } }';
        const result = _findClosing(text, 0);
        expect(result).toBe(25);
    });

    it('should handle strings with braces', () => {
        const text = '{ text: "has { and } in it" }';
        const result = _findClosing(text, 0);
        expect(result).toBe(28);
    });

    it('should return -1 if no closing brace found', () => {
        const text = '{ unclosed: true';
        const result = _findClosing(text, 0);
        expect(result).toBe(-1);
    });

    it('should handle escaped quotes', () => {
        const text = '{ text: "escaped \\"quote\\"" }';
        const result = _findClosing(text, 0);
        expect(result).toBe(29);
    });

    it('should handle template literals', () => {
        const text = '{ text: `template ${var} here` }';
        const result = _findClosing(text, 0);
        expect(result).toBe(32);
    });
});

describe('Integration Tests', () => {
    it('should handle objects with function properties correctly', () => {
        const input = `{
  onSubmit: (event: any) => {
    event.preventDefault();
  },
  onChange: () => {},
  onClick: () => {}
}`;
        const result = _sortBlock(input);
        expect(result.indexOf('onChange')).toBeLessThan(result.indexOf('onClick'));
        expect(result.indexOf('onClick')).toBeLessThan(result.indexOf('onSubmit'));
    });

    it('should handle TypeScript interfaces', () => {
        const content = 'name: string; age: number; id: string;';
        expect(_isObjectLiteral(content)).toBe(true);
    });

    it('should handle return statement objects', () => {
        const content = 'message: "Success", data: await response.json(), statusCode: 200';
        expect(_isObjectLiteral(content)).toBe(true);
    });

    it('should NOT sort function bodies', () => {
        const content = 'const x = 1; console.log(x); return x;';
        expect(_isObjectLiteral(content)).toBe(false);
    });
});
