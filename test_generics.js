
const checkGenerics = (content) => {
    let depth = 0;
    let inString = false;
    let stringChar = '';
    
    console.log(`Testing: "${content}"`);
    
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        const prev = i > 0 ? content[i - 1] : '';
        const next = i < content.length - 1 ? content[i + 1] : '';
        
        if (!inString && (c === '"' || c === "'" || c === '`')) {
            inString = true;
            stringChar = c;
        } else if (inString && c === stringChar && prev !== '\\') {
            inString = false;
        } else if (!inString) {
            if (c === '{' || c === '[' || c === '(') depth++;
            if (c === '}' || c === ']' || c === ')') depth--;
            
            // Handle generics: <Type>
            if (c === '<') {
                // The logic from extension.ts
                // const next = i < trimmed.length - 1 ? trimmed[i + 1] : ''; // Note: extension uses 'trimmed' or 'content' depending on context. In _findPropertyRanges it uses 'content'.
                // Let's assume 'content' here.
                if (/^[a-zA-Z0-9_]/.test(next)) {
                    depth++;
                    console.log(`Depth++ at ${i} (<)`);
                } else {
                    console.log(`Ignored < at ${i} because next char '${next}' didn't match regex`);
                }
            }
            if (c === '>') {
                if (prev !== '=' && /^[a-zA-Z0-9_>]/.test(prev)) {
                    depth--;
                    console.log(`Depth-- at ${i} (>)`);
                } else {
                    console.log(`Ignored > at ${i}`);
                }
            }
            
            if (depth === 0 && c === ',') {
                console.log(`SPLIT at ${i}`);
            }
        }
    }
};

checkGenerics("type T = Map<string, any>;");
checkGenerics("type T = Map< string, any > ;");
