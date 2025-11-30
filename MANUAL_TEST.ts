// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file is intentionally UNSORTED to test the extension

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

// Single-line imports (UNSORTED)
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { map, filter, reduce, forEach, some, every, find } from "lodash";
import { zebra, monkey, banana, apple } from "animals";

// Multi-line imports (UNSORTED)
import {
  ZebraComponent,
  GammaComponent,
  DeltaComponent,
  BetaComponent,
  AlphaComponent
} from "my-ui-library";

import {
  zulu,
  charlie,
  bravo,
  alpha
} from "phonetic";

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

interface NestedConfig {
  server: {
    ssl: boolean;
    port: number;
    host: string;
  };
  database: {
    name: string;
    host: string;
  };
}

// ============================================================================
// SECTION 3: PRIORITY SORTING - __typename, id, _id first
// ============================================================================

const graphqlUser = {
  name: "John Doe",
  isActive: true,
  email: "john@example.com",
  city: "New York",
  age: 30,
  _id: "507f1f77bcf86cd799439011",
  id: "user-123",
  __typename: "User"
};

const anotherUser = {
  zipCode: "12345",
  name: "Jane",
  age: 25,
  _id: "mongo-456",
  id: "user-456",
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
  id,
  __typename
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
    id: "user-789",
    __typename: "User"
  },
  metadata: {
    version: 1,
    created: "2024-01-01",
    __typename: "Metadata"
  }
};

const moreNested = {
  simple: "data",
  outer: {
    middle: "value",
    inner: {
      zebra: "z",
      alpha: "a",
      id: "inner-1"
    },
    id: "outer-1"
  }
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { zebra: 1, beta: 4, alpha: 2, id: 3, __typename: "Single" };
const anotherSingle = { z: 1, m: 3, b: 4, a: 2, id: 5 };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const config = {
  timeout: 5000,
  "max-retries": 3,
  enabled: true,
  "base-url": "https://api.example.com",
  "api-key": "secret-key-123",
  _id: "config-mongo-id",
  id: "config-1",
  __typename: "Config"
};

const settings = {
  "z-index": 100,
  "m-option": true,
  "a-value": "test",
  id: "settings-1"
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { zebra: z1, monkey: m1, alpha: a1 } = { zebra: 1, monkey: 3, alpha: 2 };
const { lastName: ln, firstName: fn, age: userAge } = graphqlUser;

function ComponentWithProps({ userId, theme, onClose, className }: any) {
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
  onLoad: async () => {
    const data = await fetch("/api/data");
    return data.json();
  },
  onClick: () => {
    console.log("Clicked");
  },
  onChange: (value: string) => {
    console.log("Value changed:", value);
  }
};

const componentProps = {
  type: "submit",
  onClick: (event) => {
    event.preventDefault();
    return { handled: true };
  },
  id: "complex-btn",
  disabled: false,
  "data-testid": "test-button",
  className: "btn btn-primary",
  children: ["Click", " ", "Me"],
  "aria-label": "Complex button"
};

// ============================================================================
// SECTION 10: OBJECTS WITH ARRAYS - Should sort, but not array contents
// ============================================================================

const dataWithArrays = {
  users: [
    { name: "Alice", id: "1" },
    { name: "Bob", id: "2" }
  ],
  total: 2,
  tags: ["javascript", "typescript"],
  id: "list-1",
  __typename: "UserList"
};

// ============================================================================
// SECTION 11: OBJECTS WITH FUNCTIONS - Should sort
// ============================================================================

const apiClient = {
  timeout: 5000,
  post: async (url: string, data: any) => {
    return fetch(url, { method: "POST", body: JSON.stringify(data) });
  },
  get: async (url: string) => {
    return fetch(url, { method: "GET" });
  },
  delete: async (url: string) => {
    return fetch(url, { method: "DELETE" });
  },
  baseUrl: "https://api.example.com",
  id: "api-client-1"
};

const withRegularFunction = {
  zebra: "last",
  process: function() {
    console.log("processing");
  },
  calculate: function(a: number, b: number) {
    return a + b;
  },
  alpha: "first"
};

// ============================================================================
// SECTION 12: TYPESCRIPT GENERICS - Should handle correctly
// ============================================================================

type ApiConfigWithGenerics = {
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  enabled: boolean;
  baseUrl: string;
};

const configWithGenerics: Record<string, any> = {
  zebra: "last",
  alpha: "first",
  id: "config-123"
};

// ============================================================================
// SECTION 13: COMPLEX REAL-WORLD API RESPONSE
// ============================================================================

const complexApiResponse = {
  timestamp: Date.now(),
  statusCode: 200,
  message: "Success",
  data: {
    users: [
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
    ],
    total: 2,
    __typename: "UserConnection"
  }
};

// ============================================================================
// SECTION 14: RETURN STATEMENTS - Should be sorted
// ============================================================================

function getUserData() {
  return {
    name: "John",
    email: "john@example.com",
    age: 30,
    id: "user-123",
    __typename: "User"
  };
}

const getConfig = () => {
  return {
    timeout: 5000,
    retries: 3,
    enabled: true,
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
  graphqlUser,
  eventHandlers,
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
const willBeSorted = { zebra: 9, monkey: 11, banana: 12, apple: 10 };

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
    "start": "node index.js",
    "build": "tsc"
  },
  "name": "my-package",
  "description": "A test package",
  "dependencies": {
    "react": "^18.0.0",
    "lodash": "^4.17.21"
  }
};

// ============================================================================
// SECTION 21: COMPUTED PROPERTY NAMES - Should handle correctly
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
// SECTION 22: OBJECTS WITH REGEX - Should sort, preserve regex
// ============================================================================

const patterns = {
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s-()]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  id: /^[a-f0-9]{24}$/
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
  retries: 3, // Number of retry attempts
  id: "config-456", // Unique identifier
  enabled: true, // Feature flag
  apiKey: "secret-key" // API authentication key
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
