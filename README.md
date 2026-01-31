# Object Sort Alphabetical

**Automatically sorts objects, interfaces, types, imports, and destructuring patterns alphabetically on save - with perfect formatting preservation and smart prioritization for GraphQL.**

![Demo](assets/demo.gif)

> 🏆 **What makes this different?** We use the "apartment building" approach - we identify the structure (commas, newlines, spaces) and only swap the content, preserving your exact formatting. No opinionated formatting, no conflicts with your linter.

## ✨ Features

### 🎯 Smart Sorting
- **Priority sorting** - `__typename`, `id`, and `_id` always come first (perfect for GraphQL)
- **Nested objects** - Recursively sorts all nested objects, no matter how deep
- **Context-aware** - Knows the difference between object literals, destructuring, and function params

### 🔧 What Gets Sorted
- ✅ Object literals (`const obj = { ... }`)
- ✅ TypeScript interfaces and types (with semicolons!)
- ✅ Named imports (`import { ... }`)
- ✅ Object destructuring (`const { a, b } = obj`)
- ✅ Objects inside arrays (array order preserved!)
- ✅ Shorthand properties
- ✅ String keys with special characters

### 🎨 Perfect Formatting Preservation
- **Zero formatting changes** - Your spaces, newlines, commas, and semicolons stay exactly as you wrote them
- **Inline comments preserved** - Comments stay with their properties when sorted
- **No linter conflicts** - We don't reformat, we just reorder
- **Handles complex types** - `Record<string, string>`, `Array<Type>`, generics, arrow functions, multiline values

### 🛡️ Smart Protection
- **Arrays never sorted** - Order matters for execution and data structure
- **Array destructuring preserved** - `const [a, b] = arr` stays positional
- **Function params preserved** - Positional arguments stay in order
- **Class bodies untouched** - Structure and syntax preserved
- **Objects with inline comments skipped** - Preserves documentation (see below)
- **Ignore comments** - Skip sorting with `// auto-sort-ignore` or `// auto-sort-ignore-next-line`

## Installation

1. Install from the VS Code Marketplace (search for "Object Sort Alphabetical")
2. Or install via command line:
   ```bash
   code --install-extension object-sort-alphabetical
   ```
3. Alternatively, clone from [GitHub](https://github.com/ozJSey/object-key-sort-alphabetical) and build locally:
   ```bash
   git clone https://github.com/ozJSey/object-key-sort-alphabetical.git
   cd object-key-sort-alphabetical
   npm install
   npm run compile
   ```

## Usage

Just save your file! The extension automatically sorts:

### 🧪 Full Test Suite

Want to see ALL features in action? Check out our comprehensive [MANUAL_TEST.ts](https://github.com/ozJSey/object-key-sort-alphabetical/blob/master/MANUAL_TEST.ts) on GitHub. It contains 24 test sections covering every sorting scenario - just save the file to see the magic happen!

### Objects

**Before:**
```javascript
const user = {
  name: "John",
  age: 30,
  _id: "mongo-id",
  id: "user-123",
  __typename: "User"
};
```

**After:**
```javascript
const user = {
  __typename: "User",
  id: "user-123",
  _id: "mongo-id",
  age: 30,
  name: "John"
};
```

### TypeScript Interfaces

**Before:**
```typescript
interface User {
  name: string;
  age: number;
  id: string;
  __typename: string;
}
```

**After:**
```typescript
interface User {
  __typename: string;
  id: string;
  age: number;
  name: string;
}
```

### Imports

**Before:**
```typescript
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
```

**After:**
```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
```

### Object Destructuring

**Before:**
```javascript
const { zebra, alpha, monkey } = { alpha: 2, monkey: 3, zebra: 1 };
```

**After:**
```javascript
const { alpha, monkey, zebra } = { alpha: 2, monkey: 3, zebra: 1 };
```

Both sides are sorted! Perfect for maintaining consistency.

### Objects with Functions (ANY function body length)

**Before:**
```javascript
const eventHandlers = {
  onSubmit: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    validateData(data);
    submitToApi(data);
    console.log("Form submitted");
  },
  onChange: function(value, index, array) {
    console.log("Value changed:", value);
    updateState(value);
    triggerValidation();
  },
  onClick: async (id) => {
    const data = await fetchData(id);
    processData(data);
    return data;
  },
  onLoad() {
    initialize();
    loadSettings();
  }
};
```

**After:**
```javascript
const eventHandlers = {
  onChange: function(value, index, array) {
    console.log("Value changed:", value);
    updateState(value);
    triggerValidation();
  },
  onClick: async (id) => {
    const data = await fetchData(id);
    processData(data);
    return data;
  },
  onLoad() {
    initialize();
    loadSettings();
  },
  onSubmit: (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    validateData(data);
    submitToApi(data);
    console.log("Form submitted");
  }
};
```

Function bodies are **never touched** - only the keys are sorted! Works with:
- Arrow functions: `(params) => { ... }`
- Regular functions: `function(params) { ... }`
- Method shorthand: `methodName() { ... }`
- Async functions: `async (params) => { ... }`
- Any number of statements inside!

### Complex TypeScript Types

**Before:**
```typescript
type ApiConfig = {
  timeout: number;
  retries: number;
  baseUrl: string;
  headers: Record<string, string>;
  enabled: boolean;
};
```

**After:**
```typescript
type ApiConfig = {
  baseUrl: string;
  enabled: boolean;
  headers: Record<string, string>;
  retries: number;
  timeout: number;
};
```

Handles generics, nested types, and complex type annotations perfectly!

### Nested Objects

**Before:**
```javascript
const data = {
  user: {
    name: "Bob",
    id: "123",
    profile: {
      bio: "Developer",
      avatar: "pic.jpg"
    }
  }
};
```

**After:**
```javascript
const data = {
  user: {
    id: "123",
    name: "Bob",
    profile: {
      avatar: "pic.jpg",
      bio: "Developer"
    }
  }
};
```

## Priority Sorting

Special keys are always sorted first in this order:

1. **`__*` keys** (like `__typename`) - Always first
2. **`id`** - Always second
3. **`_id`** - Always third
4. **Everything else** - Alphabetically

Perfect for GraphQL queries and MongoDB documents!

## Ignoring Sorting

Use comments to skip sorting for specific blocks:

```javascript
// auto-sort-ignore-next-line
const keepThisOrder = {
  zebra: 1,
  apple: 2,
  monkey: 3
};

// auto-sort-ignore
const alsoIgnored = { z: 1, a: 2 };

// This one WILL be sorted
const sortThis = { z: 1, a: 2 }; // becomes { a: 2, z: 1 }
```

### ⚠️ Important Limitations

- **Placement**: The ignore comment must be placed **outside** the object you want to ignore (before the opening `{`).
- **Scope**: It ignores the **entire object** and all its nested properties.
- **Nested Objects**: You cannot currently ignore a specific nested object if its parent is being sorted. The ignore comment must be on the **top-level** object to take effect.
- **Individual Properties**: You cannot ignore specific properties inside a sorted object. The "ignore" applies to the whole block.

```javascript

// Following will be how ignore will work

// auto-sort-ignore-next-line (whole object)
const nestedIgnore = {
    ignoredChild: {
        // auto-sort-ignore-next-line (in same depth)
        z: 1
        a: 2,
        c: 3
    },
    a: 1,
    b: 2,
};


```

## Configuration

Configure the extension in your VS Code settings:

```json
{
  "objectSortAlphabetical.enabled": true,
  "objectSortAlphabetical.sortOnSave": true,
  "objectSortAlphabetical.sortOrder": "asc",
  "objectSortAlphabetical.caseSensitive": false,
  "objectSortAlphabetical.enablePriorityKeys": true,
  "objectSortAlphabetical.priorityKeys": ["__typename", "type", "id", "_id"],
  "objectSortAlphabetical.supportedLanguages": ["javascript", "typescript", "javascriptreact", "typescriptreact", "vue", "json", "jsonc"],
  "objectSortAlphabetical.excludePatterns": [],
  "objectSortAlphabetical.sortImports": true
}
```

### Settings

- **`objectSortAlphabetical.enabled`** - Enable/disable the extension (default: `true`)
- **`objectSortAlphabetical.sortOnSave`** - Sort objects when file is saved (default: `true`)
- **`objectSortAlphabetical.sortOrder`** - Sort order: `"asc"` (A-Z) or `"desc"` (Z-A) (default: `"asc"`)
- **`objectSortAlphabetical.caseSensitive`** - Use case-sensitive sorting (default: `false`)
- **`objectSortAlphabetical.enablePriorityKeys`** - Enable priority sorting for special keys. Set to `false` for pure alphabetical sorting (default: `true`)
- **`objectSortAlphabetical.priorityKeys`** - Array of keys that should always appear first. Supports wildcards like `"__*"` for all keys starting with `__` (default: `["__typename", "type", "id", "_id"]`)
- **`objectSortAlphabetical.supportedLanguages`** - Array of language IDs where sorting should be applied (default: `["javascript", "typescript", "javascriptreact", "typescriptreact", "vue", "json", "jsonc"]`)
- **`objectSortAlphabetical.excludePatterns`** - Array of glob patterns for files to exclude from sorting (e.g., `["*.test.ts", "generated/*"]`) (default: `[]`)
- **`objectSortAlphabetical.sortImports`** - Sort named imports alphabetically (default: `true`)

### Commands

- **Object Sort Alphabetical: File: Save without Sorting** - Save the current file without triggering automatic sorting
  - Access via Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
  - Useful when you need to preserve specific ordering temporarily

## Supported Languages

- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- JSON (`.json`, `.jsonc`)

## 🎯 How It Works

We use **TypeScript's Compiler API** for AST-based parsing combined with the **"apartment building" approach**:

1. **Parse with AST** - TypeScript compiler understands your code structure natively
2. **Identify sortable nodes** - Objects, interfaces, types, imports detected accurately
3. **Extract property boundaries** - AST gives us exact positions
4. **Sort the content** - Reorder by key name with priority rules
5. **Swap in place** - Put sorted content back, keeping structure intact

This means:
- ✅ Your formatting stays **exactly** as you wrote it
- ✅ No conflicts with Prettier, ESLint, or other formatters
- ✅ Works with any coding style (spaces, tabs, newlines, semicolons)
- ✅ Handles multiline values, arrow functions, complex types
- ✅ Accurate detection - no regex guessing, the compiler knows what's an object

## 📋 What Gets Sorted vs. Protected

### ✅ Sorted

- Object literals (`const obj = { ... }`)
- TypeScript interfaces and types
- Named imports (`import { ... }`)
- Object destructuring (`const { a, b } = obj`)
- Nested objects (recursively)
- Objects inside arrays
- Shorthand properties
- String keys (`"api-key"`)

### 🛡️ Never Sorted (Order Matters!)

- **Arrays** - Element order is preserved (execution order, data structure)
- **Array destructuring** - Positional meaning preserved (`const [a, b] = arr`)
- **Function parameters** - Positional arguments preserved
- **Class bodies** - Structure and syntax preserved
- **Switch cases** - Execution order preserved
- Computed property names
- Blocks with `// auto-sort-ignore` comment

## Examples

### Shorthand Properties

```javascript
// Before
const obj = { lastName, age, id, firstName, __typename };

// After
const obj = { __typename, id, age, firstName, lastName };
```

### Mixed Keys

```javascript
// Before
const config = {
  timeout: 5000,
  "api-key": "secret",
  enabled: true,
  id: "config-1"
};

// After
const config = {
  id: "config-1",
  "api-key": "secret",
  enabled: true,
  timeout: 5000
};
```

### Complex Objects

```javascript
// Before
const props = {
  onClick: () => {},
  disabled: false,
  id: "btn",
  className: "button"
};

// After
const props = {
  id: "btn",
  className: "button",
  disabled: false,
  onClick: () => {}
};
```

### Objects with Inline Comments - NOT Sorted (Intentional)

```javascript
// This object will NOT be sorted - inline comments break the "apartment building" pattern
const config = {
  timeout: 5000, // Maximum timeout in milliseconds
  retries: 3, // Number of retry attempts
  id: "config-456", // Unique identifier
  enabled: true, // Feature flag
  apiKey: "secret-key" // API authentication key
};
// ☝️ Stays exactly as written - we don't sort objects with inline comments
```

**Why?** Inline comments are part of the "apartment structure" we preserve. Moving properties would separate comments from their values, breaking our core principle of only swapping content while keeping structure intact.

**Workaround:** If you want sorting, move inline comments to standalone lines above properties:

```javascript
// This WILL be sorted
const config = {
  timeout: 5000,
  retries: 3,
  // Unique identifier
  id: "config-456",
  enabled: true,
  apiKey: "secret-key"
};
```

## Why Use This Extension?

- **Consistency** - All team members have objects sorted the same way
- **Merge conflicts** - Fewer conflicts when properties are in a predictable order
- **GraphQL friendly** - `__typename`, `id`, and `_id` are prioritized
- **Zero configuration** - Works out of the box
- **Format preservation** - Your code style stays intact

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository: https://github.com/ozJSey/object-key-sort-alphabetical
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Submit a pull request

## License

MIT

## Changelog

### 2.0.1

**🎛️ Priority Keys Enhancement**

- ✅ **Added `type` to priority keys** - Now prioritizes `__typename`, `type`, `id`, `_id` by default
- ✅ **New `enablePriorityKeys` option** - Set to `false` for pure alphabetical sorting without priority keys
- 🐛 **Fixed nested object sorting** - Resolved "Overlapping ranges" error when sorting nested objects

**Configuration:**
```json
{
  "objectSortAlphabetical.enablePriorityKeys": false  // Pure alphabetical
}
```

### 2.0.0

**🚀 Major Architecture Overhaul - AST-Based Parsing**

This release completely rewrites the core parsing engine using TypeScript's Compiler API instead of regex-based detection.

**🏗️ Architecture Changes:**
- ✅ **AST-Based Parsing** - Now uses TypeScript Compiler API (`ts.createSourceFile`) for accurate syntax understanding
- ✅ **Modular Codebase** - Split from single 550-line file into 5 focused modules:
  - `types.ts` - Shared interfaces
  - `config.ts` - Configuration handling
  - `parser.ts` - AST parsing logic
  - `sorter.ts` - Sorting and edit creation
  - `extension.ts` - VSCode integration
- ✅ **Accurate Detection** - No more regex guessing; the TypeScript compiler knows exactly what's an object, interface, import, etc.
- ✅ **Same Format Preservation** - Still uses the "apartment building" swap technique, just with AST-identified boundaries

**🎯 Why AST?**
- More reliable detection of sortable constructs
- Proper handling of edge cases (strings, comments, nested structures)
- Accurate distinction between object literals, interfaces, imports, and class bodies
- Foundation for future enhancements

**📦 Package Size:**
- Optimized `.vscodeignore` to exclude test files and debug utilities
- Cleaner production bundle

### 1.5.0

**🎉 Major Configuration Overhaul**

**🎨 New Configuration Options:**
- ✅ **Sort Order** - Choose ascending (`asc`) or descending (`desc`) sorting
- ✅ **Case Sensitivity** - Control whether sorting is case-sensitive
- ✅ **Custom Priority Keys** - Define your own priority keys with wildcard support (e.g., `__*`, `$*`)
- ✅ **Language Support** - Configure which file types to process
- ✅ **File Exclusions** - Glob patterns to exclude specific files or directories
- ✅ **Dynamic Configuration** - All settings now read from user preferences

**📦 New Commands:**
- ✅ **Save without Sorting** - Added Command Palette command to save files without triggering sorting
  - Access via `Cmd+Shift+P` → "Object Sort Alphabetical: File: Save without Sorting"
  - Perfect for when you need to preserve specific ordering temporarily

**⚡ Performance Improvements:**
- ✅ **Smart Activation** - Extension now activates only when opening supported language files instead of on startup
- ✅ **Better Resource Usage** - Reduced memory footprint and activation time
- ✅ **Language-specific Loading** - Only loads for JS, TS, Vue, and JSON files

**🛠️ Architecture Improvements:**
- ✅ Centralized configuration management with `getConfig()`
- ✅ Flexible pattern matching for file exclusions
- ✅ More maintainable and extensible codebase
- ✅ Better separation of concerns

**📝 Examples:**
```json
// Descending sort with custom priorities
{
  "objectSortAlphabetical.sortOrder": "desc",
  "objectSortAlphabetical.priorityKeys": ["id", "name", "__*"],
  "objectSortAlphabetical.excludePatterns": ["*.test.ts", "generated/*"]
}

// Case-sensitive sorting for specific languages only
{
  "objectSortAlphabetical.caseSensitive": true,
  "objectSortAlphabetical.supportedLanguages": ["typescript", "typescriptreact"]
}
```

### 1.3.5

**🔄 Reverted: Inline Comment Sorting**
- ❌ Removed inline comment sorting feature (v1.3.0-1.3.1)
- ✅ Objects with inline comments are now SKIPPED (not sorted)
- 🏗️ Preserves "apartment building" principle - comments are part of structure
- 📝 Updated documentation with workaround for inline comments
- 🧪 Tests updated: 4/4 passing

**Why?** Inline comments (`value, // comment`) are part of the line structure, not the property value. Sorting them would violate our core principle of preserving exact formatting. If you need sorting with documentation, use standalone comments above properties instead.

### 1.4.7

**🛠️ Bug Fixes**

  - ✅ Fixed: Class bodies are no longer processed for sorting

### 1.4.6

**🛠️ Bug Fixes**

  - ✅ Fixed: What AI tried to fix...

### 1.4.5

**🛠️ Bug Fixes**

- ✅ Fixed: Minor edge case with trailing commas in nested objects
- ✅ Fixed: InString sorting and double curly braces are now going to be ignored 
- 🧪 Added more unit tests for complex scenarios

### 1.4.0 - 1.4.4

**🛠️ Bug Fixes & Improvements**
- ✅ Fixed: Edge cases with nested generics and complex types
- ✅ Improved performance for large files
- 🧪 Added more unit tests for complex scenarios

### 1.3.0 - 1.3.1

**⚠️ REVERTED - Do not use these versions**
- Attempted to preserve inline comments with properties
- Broke the apartment building pattern
- Caused comma placement issues

### 1.2.0

**🎯 Critical Fix: TypeScript Generics & Arrow Functions**
- ✅ Fixed: `Map<string, any>` and other generics now preserved correctly
- ✅ Fixed: Arrow functions `() => {}` no longer break depth tracking
- 🧠 Smart `>` detection: differentiates between `=>` and generic `>`
- 🧪 Added unit tests for generics to prevent regression
- 📦 All tests passing: 3/3 ✓

### 1.1.0

**🚀 Major Fix: Object Detection**
- ✅ Fixed: Objects with arrow function properties now sort correctly
- ✅ Example: `{ onChange: () => {}, onClick: () => {} }` now works
- 🧠 Structural content-based detection (inspired by Lodash)
- 🧪 Comprehensive unit testing added
- 📝 Improved manual test coverage

### 1.0.0

**🎉 Initial Release**
- ✅ Object property sorting (alphabetical + priority)
- ✅ Import/Export sorting
- ✅ Object destructuring sorting
- ✅ Nested object support (recursive)
- ✅ TypeScript interface/type support
- ✅ Ignore comments (`// auto-sort-ignore`)
- ✅ Priority: `__typename`, `id`, `_id` always first
- ✅ Format preservation (whitespace, newlines, comments)
- ✅ Return statement objects
- ✅ JSON file support

### 0.9.4

- Final polish and bug fixes
- README improvements with local asset paths
- Enhanced marketplace presentation

### 0.9.3

- Icon and asset optimization
- VSCode version compatibility improvements
- Package size optimization

### 0.9.2

- Documentation refinements
- Contact and feedback links
- Changelog updates

### 0.9.1

- Production-ready stability
- Full documentation and examples

### 0.9.0

- Release candidate
- Performance optimizations
- Enhanced error handling
- Improved formatting preservation

### 0.8.0

- Added ignore comment support (`// auto-sort-ignore`)
- Configuration options for imports and sorting
- Bug fixes for edge cases

### 0.7.0

- Nested object sorting (recursive)
- Flat array sorting for primitives
- TypeScript type definitions support

### 0.6.0

- Import statement sorting
- Shorthand property support
- String key handling improvements

### 0.5.0

- Priority sorting system (`__typename`, `id`, `_id`)
- GraphQL and MongoDB compatibility
- Configurable sorting rules

### 0.4.0

- TypeScript interface support with semicolons
- Multi-line object handling
- Format preservation enhancements

### 0.3.0

- Complex object value support (functions, nested objects)
- Improved parsing algorithm
- Better whitespace handling

### 0.2.0

- Basic object sorting functionality
- Single-line and multi-line support
- Configuration options

### 0.1.0

- Core sorting logic implementation
- VSCode integration
- Save event handling

### 0.0.1

- Initial proof of concept
- Basic alphabetical sorting

## Issues & Feedback

📧 [ozgur.seyidoglu.sw@gmail.com](mailto:ozgur.seyidoglu.sw@gmail.com)  
🐛 [GitHub Issues](https://github.com/ozJSey/object-key-sort-alphabetical/issues)  
⭐ [Star on GitHub](https://github.com/ozJSey/object-key-sort-alphabetical)

