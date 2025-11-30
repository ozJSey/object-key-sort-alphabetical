// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file is intentionally UNSORTED to test the extension

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

// Single-line imports (UNSORTED)
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { reduce, map, some, filter, forEach, every, find } from "lodash";
import { monkey, zebra, apple, banana } from "animals";

// Multi-line imports (UNSORTED)
import {
  ZebraComponent,
  DeltaComponent,
  AlphaComponent,
  GammaComponent,
  BetaComponent
} from "my-ui-library";

import {
  charlie,
  zulu,
  bravo,
  alpha
} from "phonetic";

// ============================================================================
// SECTION 2: INTERFACES & TYPES - Properties should be sorted
// ============================================================================

interface UserProfile {
  username: string;
  age: number;
  email: string;
  id: string;
  _id: string;
  __typename: string;
}

type ApiConfig = {
  retries: number;
  timeout: number;
  enabled: boolean;
  baseUrl: string;
  headers: Record<string, string>;
};

interface NestedConfig {
  server: {
    ssl: boolean;
    port: number;
    host: string;
  };
  database: {
    host: string;
    name: string;
  };
}

// ============================================================================
// SECTION 3: PRIORITY SORTING - __typename, id, _id first
// ============================================================================

const graphqlUser = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  city: "New York",
  _id: "507f1f77bcf86cd799439011",
  isActive: true,
  id: "user-123",
  __typename: "User"
};

const anotherUser = {
  zipCode: "12345",
  age: 25,
  name: "Jane",
  id: "user-456",
  _id: "mongo-456",
  __typename: "User"
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
  _id,
  id,
  __typename
};

const zebra = "z";
const apple = "a";
const monkey = "m";

const anotherShorthand = {
  zebra,
  monkey,
  apple,
  __typename,
  id
};

// ============================================================================
// SECTION 5: NESTED OBJECTS - Should be sorted recursively
// ============================================================================

const nestedData = {
  user: {
    profile: {
      website: "example.com",
      avatar: "avatar.jpg",
      bio: "Developer",
      id: "profile-1"
    },
    settings: {
      theme: "dark",
      language: "en",
      notifications: true,
      id: "settings-1"
    },
    name: "Bob",
    __typename: "User",
    id: "user-789"
  },
  metadata: {
    version: 1,
    __typename: "Metadata",
    created: "2024-01-01"
  }
};

const moreNested = {
  simple: "data",
  outer: {
    middle: "value",
    inner: {
      zebra: "z",
      id: "inner-1",
      alpha: "a"
    },
    id: "outer-1"
  }
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { zebra: 1, beta: 4, alpha: 2, __typename: "Single", id: 3 };
const anotherSingle = { z: 1, m: 3, a: 2, id: 5, b: 4 };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const config = {
  timeout: 5000,
  enabled: true,
  "api-key": "secret-key-123",
  __typename: "Config",
  id: "config-1",
  "base-url": "https://api.example.com",
  "max-retries": 3,
  _id: "config-mongo-id"
};

const settings = {
  "z-index": 100,
  id: "settings-1",
  "a-value": "test",
  "m-option": true
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { zebra: z1, monkey: m1, alpha: a1 } = { alpha: 2, monkey: 3, zebra: 1 };
const { lastName: ln, age: userAge, firstName: fn } = graphqlUser;

function ComponentWithProps({ userId, onClose, theme, className }: any) {
  return null;
}

// ============================================================================
// SECTION 9: OBJECTS WITH COMPLEX VALUES - Should sort keys, preserve values
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

const componentProps = {
  onClick: (event) => {
    event.preventDefault();
    return { handled: true };
  },
  disabled: false,
  className: "btn btn-primary",
  children: ["Click", " ", "Me"],
  id: "complex-btn",
  type: "submit",
  "aria-label": "Complex button",
  "data-testid": "test-button"
};

// ============================================================================
// SECTION 10: OBJECTS WITH ARRAYS - Should sort, but not array contents
// ============================================================================

const dataWithArrays = {
  users: [
    { name: "Alice", id: "1" },
    { name: "Bob", id: "2" }
  ],
  tags: ["javascript", "typescript"],
  total: 2,
  __typename: "UserList",
  id: "list-1"
};

// ============================================================================
// SECTION 11: OBJECTS WITH FUNCTIONS - Should sort
// ============================================================================

const apiClient = {
  post: async (url: string, data: any) => {
    return fetch(url, { body: JSON.stringify(data), method: "POST" });
  },
  delete: async (url: string) => {
    return fetch(url, { method: "DELETE" });
  },
  get: async (url: string) => {
    return fetch(url, { method: "GET" });
  },
  timeout: 5000,
  baseUrl: "https://api.example.com",
  id: "api-client-1"
};

const withRegularFunction = {
  zebra: "last",
  calculate: function(a: number, b: number) {
    return a + b;
  },
  alpha: "first",
  process: function() {
    console.log("processing");
  }
};

// ============================================================================
// SECTION 12: TYPESCRIPT GENERICS - Should handle correctly
// ============================================================================

type ApiConfigWithGenerics = {
  timeout: number;
  baseUrl: string;
  retries: number;
  headers: Record<string, string>;
  enabled: boolean;
};

const configWithGenerics: Record<string, any> = {
  zebra: "last",
  id: "config-123",
  alpha: "first"
};

// ============================================================================
// SECTION 13: COMPLEX REAL-WORLD API RESPONSE
// ============================================================================

const complexApiResponse = {
  statusCode: 200,
  message: "Success",
  data: {
    users: [
      {
        email: "user1@example.com",
        __typename: "User",
        name: "User One",
        id: "1",
        _id: "mongo1"
      },
      {
        email: "user2@example.com",
        _id: "mongo2",
        name: "User Two",
        __typename: "User",
        id: "2"
      }
    ],
    __typename: "UserConnection",
    total: 2
  },
  timestamp: Date.now()
};

// ============================================================================
// SECTION 14: RETURN STATEMENTS - Should be sorted
// ============================================================================

function getUserData() {
  return {
    name: "John",
    email: "john@example.com",
    age: 30,
    __typename: "User",
    id: "user-123"
  };
}

const getConfig = () => {
  return {
    timeout: 5000,
    enabled: true,
    retries: 3,
    apiKey: "secret"
  };
};

async function fetchData() {
  const response = await fetch("/api/data");
  return {
    statusCode: 200,
    message: "Success",
    data: await response.json()
  };
}

// ============================================================================
// SECTION 15: NAMED EXPORTS - Should be sorted
// ============================================================================

export {
  userSettings,
  eventHandlers,
  graphqlUser,
  complexApiResponse,
  applicationConfig,
  apiClient
};

// ============================================================================
// SECTION 16: IGNORE COMMENTS - Should NOT be sorted
// ============================================================================

// auto-sort-ignore-next-line
const manualOrder1 = { zebra: 1, apple: 2, monkey: 3, banana: 4 };

// auto-sort-ignore
const manualOrder2 = { z: 5, a: 6, m: 7, b: 8 };

// This one WILL be sorted (no ignore comment)
const willBeSorted = { zebra: 9, monkey: 11, apple: 10, banana: 12 };

// ============================================================================
// SECTION 17: EMPTY & SINGLE PROPERTY - Should NOT be modified
// ============================================================================

const emptyObject = {};
const singleProp = { onlyOne: true };

// ============================================================================
// SECTION 18: ALREADY SORTED - Should NOT create edits
// ============================================================================

const alreadySorted = {
  __typename: "Sorted",
  id: "sorted-1",
  _id: "mongo-sorted",
  alpha: 1,
  beta: 2,
  gamma: 3,
  zeta: 4
};

// ============================================================================
// SECTION 19: THINGS THAT SHOULD NOT BE SORTED
// ============================================================================

// Function definitions - parameter order should NOT change
function calculatePrice(basePrice: number, tax: number, discount: number): number {
  return basePrice + tax - discount;
}

// Function calls - argument order should NOT change
const totalPrice = calculatePrice(100, 15, 10);

// Switch statements - case order should NOT change
function handleUserAction(action: string): string {
  switch (action) {
    case "create":
      return "Creating user";
    case "delete":
      return "Deleting user";
    case "update":
      return "Updating user";
    case "read":
      return "Reading user";
    default:
      return "Unknown action";
  }
}

// If-else chains - order should NOT change
function validateUserAge(userAge: number): boolean {
  if (userAge < 0) {
    return false;
  } else if (userAge < 18) {
    return false;
  } else if (userAge > 120) {
    return false;
  } else {
    return true;
  }
}

// Arrays - order should NOT change (order matters!)
const executionQueue = [
  "initialize_database",
  "validate_config",
  "start_server",
  "register_routes",
  "listen_for_connections"
];

// Array destructuring - order should NOT change (positional)
const [first, second, third] = [1, 2, 3];

// Template literals - should NOT be modified
const userTemplate = `
  User Profile:
  Name: ${firstName} ${lastName}
  Age: ${age}
  Status: Active
`;

// Class definitions - structure should NOT change
class UserService {
  private cache: Map<string, any>;
  private timeout: number;

  constructor(timeout = 5000) {
    this.timeout = timeout;
    this.cache = new Map();
  }

  async fetchUser(userId: string) {
    return this.cache.get(userId);
  }

  clear() {
    this.cache.clear();
  }
}

// ============================================================================
// SECTION 20: JSON-LIKE OBJECTS (like package.json)
// ============================================================================

const packageConfig = {
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "build": "tsc",
    "start": "node index.js"
  },
  "name": "my-package",
  "dependencies": {
    "react": "^18.0.0",
    "lodash": "^4.17.21"
  },
  "description": "A test package"
};

// ============================================================================
// SECTION 21: COMPUTED PROPERTY NAMES - Should handle correctly
// ============================================================================

const dynamicKey = "username";
const computedProps = {
  zebra: "last",
  id: "user-456",
  [dynamicKey]: "john_doe",
  alpha: "first",
  email: "john@example.com"
};

// ============================================================================
// SECTION 22: OBJECTS WITH REGEX - Should sort, preserve regex
// ============================================================================

const patterns = {
  url: /^https?:\/\/.+/,
  id: /^[a-f0-9]{24}$/,
  phone: /^\+?[\d\s-()]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

// ============================================================================
// SECTION 23: MULTI-LINE FUNCTION BODIES - Should sort keys, preserve bodies
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
// SECTION 24: OBJECTS WITH COMMENTS - Should preserve comments
// ============================================================================

const documentedConfig = {
  timeout: 5000, // Maximum timeout in milliseconds
  enabled: true, // Feature flag
  retries: 3, // Number of retry attempts
  apiKey: "secret-key", // API authentication key
  id: "config-456" // Unique identifier
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
//    - Function parameters
//    - Function arguments
//    - Switch cases
//    - If-else chains
//    - Array destructuring (positional)
//    - Template literals
//    - Class structure
//    - Empty/single property objects
//    - Objects with ignore comments
//    - Already sorted objects (no unnecessary edits)
//
// 🎯 FORMAT PRESERVATION:
//    - All whitespace preserved
//    - All newlines preserved
//    - All commas/semicolons preserved
//    - All comments preserved with their properties
//    - No reformatting or prettifying
// ============================================================================
