// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file is intentionally UNSORTED to test the extension

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { every, filter, find, forEach, map, reduce, some } from "lodash";
import { apple, banana, monkey, zebra } from "animals";

import {
  AlphaComponent,
  BetaComponent,
  DeltaComponent,
  GammaComponent,
  ZebraComponent
} from "my-ui-library";

// ============================================================================
// SECTION 2: INTERFACES & TYPES - Properties should be sorted
// ============================================================================

interface UserProfile {
  username: string;
  email: string;
  age: number;
  __typename: string;
  _id: string;
  id: string;
}

type ApiConfig = {
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  enabled: boolean;
  baseUrl: string;
};

// ============================================================================
// SECTION 3: PRIORITY SORTING - __typename, id, _id first, then alphabetical
// ============================================================================

const graphqlUser = {
  __typename: "User",
  id: "user-123",
  _id: "507f1f77bcf86cd799439011",
  age: 30,
  city: "New York",
  email: "john@example.com",
  isActive: true,
  name: "John Doe"
};

const anotherUser = {
  __typename: "User",
  id: "user-456",
  _id: "mongo-456",
  age: 25,
  name: "Jane",
  zipCode: "12345"
};

// ============================================================================
// SECTION 4: SHORTHAND PROPERTIES - Should be sorted
// ============================================================================

const id = "short-123";
const _id = "mongo-short-456";
const __typename = "ShorthandTest";
const firstName = "Alice";
const lastName = "Smith";
const age = 28;

const shorthandObject = {
  __typename,
  id,
  _id,
  age,
  firstName,
  lastName
};

// ============================================================================
// SECTION 5: NESTED OBJECTS - Should be sorted recursively
// ============================================================================

const nestedData = {
  metadata: {
    __typename: "Metadata",
    created: "2024-01-01",
    version: 1
  },
  user: {
    __typename: "User",
    id: "user-789",
    name: "Bob",
    profile: {
      id: "profile-1",
      avatar: "avatar.jpg",
      bio: "Developer",
      website: "example.com"
    },
    settings: {
      id: "settings-1",
      language: "en",
      notifications: true,
      theme: "dark"
    }
  }
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { apple: "a", banana: "b", monkey: "m", zebra: "z" };
const withPriority = { id: "123", age: 30, email: "test@example.com", name: "Test" };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const stringKeys = {
  "apple-key": "a",
  "banana-key": "b",
  "monkey-key": "m",
  "zebra-key": "z"
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { apple, banana, monkey, zebra } = { apple: 4, banana: 3, monkey: 2, zebra: 1 };
const { id, age, email, username } = graphqlUser;

// ============================================================================
// SECTION 9: OBJECTS WITH ARRAYS - Arrays should NOT be sorted
// ============================================================================

const dataWithArray = {
  id: "array-test",
  tags: ["zebra", "apple", "monkey"],
  users: ["User3", "User1", "User2"]
};

// ============================================================================
// SECTION 10: OBJECTS INSIDE ARRAYS - Objects should be sorted
// ============================================================================

const arrayOfObjects = [
  {
    __typename: "User",
    id: "1",
    _id: "mongo1",
    email: "user1@example.com",
    name: "User One"
  },
  {
    __typename: "User",
    id: "2",
    _id: "mongo2",
    email: "user2@example.com",
    name: "User Two"
  }
];

// ============================================================================
// SECTION 11: OBJECTS WITH FUNCTIONS - Should sort keys, preserve bodies
// ============================================================================

const eventHandlers = {
  onChange: (value: string) => {
    console.log("Value changed:", value);
  },
  onClick: () => {
    console.log("Clicked");
  },
  onLoad: async () => {
    const data = await fetch("/api/data");
    return data.json();
  },
  onSubmit: (event: any) => {
    event.preventDefault();
    console.log("Form submitted");
  }
};

// ============================================================================
// SECTION 12: COMPLEX FUNCTION BODIES - Should sort keys, preserve bodies
// ============================================================================

const complexHandlers = {
  onChange: (value: string) => {
    console.log("Value changed:", value);
    if (value.length > 10) {
      console.log("Too long");
    }
  },
  onClick: () => {
    console.log("Clicked");
  },
  onSubmit: (event: any) => {
    event.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(event.target);
    console.log("Data:", formData);
  }
};

// ============================================================================
// SECTION 13: TYPESCRIPT GENERICS - Should handle without breaking
// ============================================================================

type GenericConfig = {
  timeout: number;
  cache: Map<string, any>;
  data: Record<string, string>;
  items: Array<number>;
  id: string;
};

class UserService {
  private timeout: number;
  private cache: Map<string, any>;
  
  constructor(timeout = 5000) {
    this.timeout = timeout;
    this.cache = new Map();
  }
}

// ============================================================================
// SECTION 14: RETURN STATEMENTS - Should sort objects in returns
// ============================================================================

function getUserData() {
  return {
    id: "user-123",
    age: 30,
    email: "john@example.com",
    username: "john_doe"
  };
}

async function fetchData() {
  const response = await fetch("/api/data");
  return {
    data: await response.json(),
    message: "Success",
    statusCode: 200
  };
}

// ============================================================================
// SECTION 15: NAMED EXPORTS - Should be sorted
// ============================================================================

export {
  arrayOfObjects,
  complexHandlers,
  eventHandlers,
  graphqlUser,
  nestedData
};

// ============================================================================
// SECTION 16: IGNORE COMMENTS - Should NOT be sorted
// ============================================================================

// auto-sort-ignore-next-line
const keepThisOrder = {
  zebra: 1,
  apple: 2,
  monkey: 3
};

// auto-sort-ignore
const alsoIgnored = { z: 1, a: 2 };

// ============================================================================
// SECTION 17: EMPTY AND SINGLE PROPERTIES - Should handle gracefully
// ============================================================================

const emptyObject = {};
const singleProperty = { onlyOne: "value" };

// ============================================================================
// SECTION 18: ALREADY SORTED - Should detect and skip
// ============================================================================

const alreadySorted = {
  __typename: "Test",
  id: "123",
  _id: "mongo",
  apple: "a",
  banana: "b",
  zebra: "z"
};

// ============================================================================
// SECTION 19: CONTROL FLOW - Should NOT be sorted
// ============================================================================

function processAction(action: string) {
  switch (action) {
    case "create":
      return "Creating user";
    case "update":
      return "Updating user";
    case "delete":
      return "Deleting user";
    default:
      return "Unknown action";
  }
}

if (age > 18) {
  console.log("Adult");
} else if (age > 13) {
  console.log("Teen");
} else {
  console.log("Child");
}

// ============================================================================
// SECTION 20: JSON-LIKE OBJECTS
// ============================================================================

const packageConfig = {
  dependencies: {
    lodash: "^4.17.21",
    react: "^18.0.0"
  },
  description: "A test package",
  name: "my-package",
  scripts: {
    build: "tsc",
    start: "node index.js",
    test: "jest"
  },
  version: "1.0.0"
};

// ============================================================================
// SECTION 21: COMPUTED PROPERTY NAMES
// ============================================================================

const dynamicKey = "username";
const computedProps = {
  id: "user-456",
  [dynamicKey]: "john_doe",
  alpha: "first",
  email: "john@example.com",
  zebra: "last"
};

// ============================================================================
// SECTION 22: OBJECTS WITH REGEX
// ============================================================================

const patterns = {
  id: /^[a-f0-9]{24}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/
};

// ============================================================================
// SECTION 23: OBJECTS WITH INLINE COMMENTS - Should NOT be sorted
// ============================================================================

const documentedConfig = {
  timeout: 5000, // Maximum timeout in milliseconds
  retries: 3, // Number of retry attempts
  enabled: true, // Feature flag
  apiKey: "secret-key", // API authentication key
  id: "config-456" // Unique identifier
};

// ============================================================================
// SECTION 24: MIXED PROPERTY TYPES
// ============================================================================

const mixedTypes = {
  id: "mixed-123",
  array: [1, 2, 3],
  boolean: true,
  function: () => console.log("test"),
  null: null,
  number: 42,
  object: { nested: "value" },
  string: "value",
  undefined: undefined
};

// ============================================================================
// SECTION 25: ARROW FUNCTIONS WITH DIFFERENT SYNTAXES
// ============================================================================

const functionVariants = {
  traditionalFunction: function() {
    return "traditional";
  },
  methodShorthand() {
    return "method";
  },
  asyncMethod: async () => {
    const result = await fetch("/api");
    return result;
  },
  asyncArrow: async () => ({
    to: "test",
    name: "async arrow",
    id: 1
  }),
  arrowWithBody: () => {
    return "arrow with body";
  },
  arrowFunction: () => "arrow"
};

// ============================================================================
// EXPECTED BEHAVIOR AFTER SAVE (Cmd/Ctrl + S):
// ============================================================================
// ✅ SHOULD BE SORTED:
//    - Object properties (with __typename, id, _id priority)
//    - Interface/Type properties
//    - Import specifiers
//    - Export specifiers
//    - Return statement objects
//    - Object destructuring
//    - Nested objects (recursively)
//
// ❌ SHOULD NOT BE SORTED:
//    - Arrays (order matters!)
//    - Array destructuring (positional)
//    - Function parameters (positional)
//    - Class bodies
//    - Switch cases (execution order)
//    - If-else chains (execution order)
//    - Blocks with ignore comments
//    - Objects with inline comments (// after values)
//
// 🎯 PRIORITY SORTING ORDER:
//    1. __typename (and any __* keys)
//    2. id
//    3. _id
//    4. Everything else alphabetically

// ============================================================================
// SECTION 26: EXHAUSTIVE MULTILINE FUNCTIONS - Keys sorted, bodies preserved
// ============================================================================

const exhaustiveFunctions = {
  submitForm: async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = Object.fromEntries(formData);
    
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  },
  
  processData: function(items: any[]) {
    const results = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.isValid) {
        const processed = {
          value: item.value * 2,
          timestamp: Date.now(),
          id: item.id
        };
        results.push(processed);
      }
    }
    
    return results;
  },
  
  initialize() {
    this.cache = new Map();
    this.timeout = 5000;
    this.retries = 3;
    
    console.log("Initialized with:");
    console.log("- Cache:", this.cache);
    console.log("- Timeout:", this.timeout);
    console.log("- Retries:", this.retries);
  },
  
  handleError: (error: Error) => {
    console.error("Error occurred:", error.message);
    console.error("Stack trace:", error.stack);
    
    const errorData = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message
    };
    
    fetch("/api/errors", {
      method: "POST",
      body: JSON.stringify(errorData)
    }).catch(err => {
      console.error("Failed to report error:", err);
    });
    
    return errorData;
  },
  
  fetchWithRetry: async (url: string, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt + 1} of ${maxRetries}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  },
  
  complexValidator: (data: any) => {
    const errors: string[] = [];
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }
    
    if (!data.password) {
      errors.push("Password is required");
    } else if (data.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    
    return {
      errors: errors,
      isValid: errors.length === 0
    };
  },
  
  arrayOperations: (numbers: number[]) => {
    const squared = numbers.map(n => n * n);
    const filtered = squared.filter(n => n > 10);
    const sum = filtered.reduce((acc, n) => acc + n, 0);
    
    return {
      sum: sum,
      count: filtered.length,
      average: sum / filtered.length
    };
  }
};
