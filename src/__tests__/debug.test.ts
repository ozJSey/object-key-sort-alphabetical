import { _isObjectLiteral, _sortBlock } from '../extension';

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
        
        console.log('=== TESTING OBJECT DETECTION ===');
        console.log('Content:', content.substring(0, 100));
        
        const result = _isObjectLiteral(content);
        console.log('Result:', result);
        
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
        
        console.log('=== TESTING BLOCK SORTING ===');
        const result = _sortBlock(input);
        console.log('Input has onSubmit at:', input.indexOf('onSubmit'));
        console.log('Result has onSubmit at:', result.indexOf('onSubmit'));
        console.log('Result has onChange at:', result.indexOf('onChange'));
        
        // Should be sorted: onChange, onClick, onLoad, onSubmit
        const changePos = result.indexOf('onChange');
        const clickPos = result.indexOf('onClick');
        const loadPos = result.indexOf('onLoad');
        const submitPos = result.indexOf('onSubmit');
        
        console.log('Positions - onChange:', changePos, 'onClick:', clickPos, 'onLoad:', loadPos, 'onSubmit:', submitPos);
        
        expect(changePos).toBeLessThan(clickPos);
        expect(clickPos).toBeLessThan(loadPos);
        expect(loadPos).toBeLessThan(submitPos);
    });
});

