// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file is intentionally UNSORTED to test the extension

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { reduce, map, forEach, filter, find, some, every } from "lodash";
import { zebra, monkey, banana, apple } from "animals";

import {
  ZebraComponent,
  GammaComponent,
  DeltaComponent,
  BetaComponent,
  AlphaComponent
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
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  city: "New York",
  isActive: true,
  __typename: "User",
  id: "user-123",
  _id: "507f1f77bcf86cd799439011"
};

const anotherUser = {
  zipCode: "12345",
  name: "Jane",
  age: 25,
  __typename: "User",
  id: "user-456",
  _id: "mongo-456"
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
  lastName,
  firstName,
  age,
  __typename,
  id,
  _id
};

// ============================================================================
// SECTION 5: NESTED OBJECTS - Should be sorted recursively
// ============================================================================

const nestedData = {
  user: {
    settings: {
      theme: "dark",
      notifications: true,
      language: "en",
      id: "settings-1"
    },
    profile: {
      website: "example.com",
      bio: "Developer",
      avatar: "avatar.jpg",
      id: "profile-1"
    },
    name: "Bob",
    __typename: "User",
    id: "user-789"
  },
  metadata: {
    version: 1,
    created: "2024-01-01",
    __typename: "Metadata"
  }
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { zebra: "z", apple: "a", monkey: "m", banana: "b" };
const withPriority = { name: "Test", age: 30, id: "123", email: "test@example.com" };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const stringKeys = {
  "zebra-key": "z",
  "apple-key": "a",
  "monkey-key": "m",
  "banana-key": "b"
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { zebra, monkey, banana, apple } = { zebra: 1, monkey: 2, banana: 3, apple: 4 };
const { username, email, age, id } = graphqlUser;

// ============================================================================
// SECTION 9: OBJECTS WITH ARRAYS - Arrays should NOT be sorted
// ============================================================================

const dataWithArray = {
  users: ["User3", "User1", "User2"],
  tags: ["zebra", "apple", "monkey"],
  id: "array-test"
};

// ============================================================================
// SECTION 10: OBJECTS INSIDE ARRAYS - Objects should be sorted
// ============================================================================

const arrayOfObjects = [
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
];

// ============================================================================
// SECTION 11: OBJECTS WITH FUNCTIONS - Should sort keys, preserve bodies
// ============================================================================

const eventHandlers = {
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
};

// ============================================================================
// SECTION 12: COMPLEX FUNCTION BODIES - Should sort keys, preserve bodies
// ============================================================================

const complexHandlers = {
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
    username: "john_doe",
    email: "john@example.com",
    age: 30,
    id: "user-123"
  };
}

async function fetchData() {
  const response = await fetch("/api/data");
  return {
    message: "Success",
    statusCode: 200,
    data: await response.json()
  };
}

// ============================================================================
// SECTION 15: NAMED EXPORTS - Should be sorted
// ============================================================================

export {
  eventHandlers,
  graphqlUser,
  complexHandlers,
  arrayOfObjects,
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
  version: "1.0.0",
  scripts: {
    test: "jest",
    start: "node index.js",
    build: "tsc"
  },
  name: "my-package",
  description: "A test package",
  dependencies: {
    react: "^18.0.0",
    lodash: "^4.17.21"
  }
};

// ============================================================================
// SECTION 21: COMPUTED PROPERTY NAMES
// ============================================================================

const dynamicKey = "username";
const computedProps = {
  zebra: "last",
  email: "john@example.com",
  alpha: "first",
  [dynamicKey]: "john_doe",
  id: "user-456"
};

// ============================================================================
// SECTION 22: OBJECTS WITH REGEX
// ============================================================================

const patterns = {
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  id: /^[a-f0-9]{24}$/
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
  string: "value",
  number: 42,
  boolean: true,
  null: null,
  undefined: undefined,
  array: [1, 2, 3],
  object: { nested: "value" },
  function: () => console.log("test"),
  id: "mixed-123"
};

// ============================================================================
// SECTION 25: ARROW FUNCTIONS WITH DIFFERENT SYNTAXES
// ============================================================================

const functionVariants = {
  traditionalFunction: function() {
    return "traditional";
  },
  arrowFunction: () => "arrow",
  asyncArrow: async () => "async arrow",
  arrowWithBody: () => {
    return "arrow with body";
  },
  methodShorthand() {
    return "method";
  },
  asyncMethod: async () => {
    const result = await fetch("/api");
    return result;
  }
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
