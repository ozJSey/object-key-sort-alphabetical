// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file is intentionally UNSORTED to test the extension

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

// Single-line imports (UNSORTED)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { every, filter, find, forEach, map, reduce, some } from "lodash";
import { apple, banana, monkey, zebra } from "animals";

// Multi-line imports (UNSORTED)
import {
  AlphaComponent,
  BetaComponent,
  DeltaComponent,
  GammaComponent,
  ZebraComponent
} from "my-ui-library";

import {
  alpha,
  bravo,
  charlie,
  zulu
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

const zebra = "z";
const apple = "a";
const monkey = "m";

const anotherShorthand = {
  __typename,
  id,
  apple,
  monkey,
  zebra
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

const moreNested = {
  outer: {
    id: "outer-1",
    inner: {
      id: "inner-1",
      alpha: "a",
      zebra: "z"
    },
    middle: "value"
  },
  simple: "data"
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { __typename: "Single", id: 3, alpha: 2, beta: 4, zebra: 1 };
const anotherSingle = { id: 5, a: 2, b: 4, m: 3, z: 1 };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const config = {
  __typename: "Config",
  id: "config-1",
  _id: "config-mongo-id",
  "api-key": "secret-key-123",
  "base-url": "https://api.example.com",
  enabled: true,
  "max-retries": 3,
  timeout: 5000
};

const settings = {
  id: "settings-1",
  "a-value": "test",
  "m-option": true,
  "z-index": 100
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { alpha: a1, monkey: m1, zebra: z1 } = { alpha: 2, monkey: 3, zebra: 1 };
const { age: userAge, firstName: fn, lastName: ln } = graphqlUser;

function ComponentWithProps({ className, onClose, theme, userId }: any) {
  return null;
}

// ============================================================================
// SECTION 9: OBJECTS WITH COMPLEX VALUES - Should sort keys, preserve values
// ============================================================================

const eventHandlers = {
  
  onChange: (value: string) => {
    event.preventDefault();
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
  },
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
  __typename: "UserList",
  id: "list-1",
  tags: ["javascript", "typescript"],
  total: 2,
  users: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ]
};

// ============================================================================
// SECTION 11: OBJECTS WITH FUNCTIONS - Should sort
// ============================================================================

const apiClient = {
  id: "api-client-1",
  baseUrl: "https://api.example.com",
  delete: async (url: string) => {
    return fetch(url, { method: "DELETE" });
  },
  get: async (url: string) => {
    return fetch(url, { method: "GET" });
  },
  post: async (url: string, data: any) => {
    return fetch(url, { body: JSON.stringify(data), method: "POST" });
  },
  timeout: 5000
};

const withRegularFunction = {
  alpha: "first",
  calculate: function(a: number, b: number) {
    return a + b;
  },
  process: function() {
    console.log("processing");
  },
  zebra: "last"
};

// ============================================================================
// SECTION 12: TYPESCRIPT GENERICS - Should handle correctly
// ============================================================================

type ApiConfigWithGenerics = {
  string>;
  enabled: boolean;, timeout: number;
  baseUrl: string;
  retries: number;
  headers: Record<string
};

const configWithGenerics: Record<string, any> = {
  id: "config-123",
  alpha: "first",
  zebra: "last"
};

// ============================================================================
// SECTION 13: COMPLEX REAL-WORLD API RESPONSE
// ============================================================================

const complexApiResponse = {
  data: {
    __typename: "UserConnection",
    total: 2,
    users: [
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
    ]
  },
  message: "Success",
  statusCode: 200,
  timestamp: Date.now()
};

// ============================================================================
// SECTION 14: RETURN STATEMENTS - Should be sorted
// ============================================================================

function getUserData() {
  return {
    __typename: "User",
    id: "user-123",
    age: 30,
    email: "john@example.com",
    name: "John"
  };
}

const getConfig = () => {
  return {
    apiKey: "secret",
    enabled: true,
    retries: 3,
    timeout: 5000
  };
};

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
  apiClient,
  applicationConfig,
  complexApiResponse,
  eventHandlers,
  graphqlUser,
  userSettings
};

// ============================================================================
// SECTION 16: IGNORE COMMENTS - Should NOT be sorted
// ============================================================================

// auto-sort-ignore-next-line
const manualOrder1 = { zebra: 1, apple: 2, monkey: 3, banana: 4 };

// auto-sort-ignore
const manualOrder2 = { z: 5, a: 6, m: 7, b: 8 };

// This one WILL be sorted (no ignore comment)
const willBeSorted = { apple: 10, banana: 12, monkey: 11, zebra: 9 };

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
  any>;
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
  }, private cache: Map<string
}

// ============================================================================
// SECTION 20: JSON-LIKE OBJECTS (like package.json)
// ============================================================================

const packageConfig = {
  "dependencies": {
    "lodash": "^4.17.21",
    "react": "^18.0.0"
  },
  "description": "A test package",
  "name": "my-package",
  "scripts": {
    "build": "tsc",
    "start": "node index.js",
    "test": "jest"
  },
  "version": "1.0.0"
};

// ============================================================================
// SECTION 21: COMPUTED PROPERTY NAMES - Should handle correctly
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
// SECTION 22: OBJECTS WITH REGEX - Should sort, preserve regex
// ============================================================================

const patterns = {
  id: /^[a-f0-9]{24}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/
};

// ============================================================================
// SECTION 23: MULTI-LINE FUNCTION BODIES - Should sort keys, preserve bodies
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
