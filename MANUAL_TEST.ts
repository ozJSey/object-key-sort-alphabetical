// 🧪 COMPREHENSIVE MANUAL TEST FILE
// Save this file (Cmd/Ctrl + S) to verify ALL extension features!
// This file covers EVERYTHING the extension should handle

// ============================================================================
// SECTION 1: IMPORTS - Should be sorted alphabetically
// ============================================================================

// Single-line imports
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { map, filter, reduce, forEach, find, some, every } from "lodash";
import { zebra, apple, monkey, banana } from "animals";

// Multi-line imports
import {
  ZebraComponent,
  AlphaComponent,
  BetaComponent,
  GammaComponent,
  DeltaComponent
} from "my-ui-library";

import {
  zulu,
  alpha,
  charlie,
  bravo
} from "phonetic";

// ============================================================================
// SECTION 2: INTERFACES & TYPES - Properties should be sorted
// ============================================================================

interface UserProfile {
  username: string;
  email: string;
  age: number;
  _id: string;
  id: string;
  __typename: string;
}

type ApiConfig = {
  timeout: number;
  retries: number;
  baseUrl: string;
  headers: Record<string, string>;
  enabled: boolean;
};

interface NestedConfig {
  server: {
    port: number;
    host: string;
    ssl: boolean;
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
  age: 30,
  email: "john@example.com",
  _id: "507f1f77bcf86cd799439011",
  city: "New York",
  id: "user-123",
  __typename: "User",
  isActive: true
};

const anotherUser = {
  zipCode: "12345",
  name: "Jane",
  _id: "mongo-456",
  age: 25,
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
  age,
  id,
  firstName,
  __typename,
  _id
};

const zebra = "z";
const apple = "a";
const monkey = "m";

const anotherShorthand = {
  zebra,
  apple,
  monkey,
  id,
  __typename
};

// ============================================================================
// SECTION 5: NESTED OBJECTS - Should be sorted recursively
// ============================================================================

const nestedData = {
  user: {
    profile: {
      website: "example.com",
      bio: "Developer",
      id: "profile-1",
      avatar: "avatar.jpg"
    },
    settings: {
      theme: "dark",
      notifications: true,
      language: "en",
      id: "settings-1"
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
  outer: {
    inner: {
      zebra: "z",
      alpha: "a",
      id: "inner-1"
    },
    middle: "value",
    id: "outer-1"
  },
  simple: "data"
};

// ============================================================================
// SECTION 6: SINGLE-LINE OBJECTS - Should be sorted
// ============================================================================

const singleLine = { zebra: 1, alpha: 2, id: 3, beta: 4, __typename: "Single" };
const anotherSingle = { z: 1, a: 2, m: 3, b: 4, id: 5 };

// ============================================================================
// SECTION 7: STRING KEYS - Should be sorted
// ============================================================================

const config = {
  timeout: 5000,
  "api-key": "secret-key-123",
  enabled: true,
  id: "config-1",
  "max-retries": 3,
  __typename: "Config",
  "base-url": "https://api.example.com",
  _id: "config-mongo-id"
};

const settings = {
  "z-index": 100,
  "a-value": "test",
  "m-option": true,
  id: "settings-1"
};

// ============================================================================
// SECTION 8: OBJECT DESTRUCTURING - Should be sorted
// ============================================================================

const { zebra: z1, alpha: a1, monkey: m1 } = { alpha: 2, monkey: 3, zebra: 1 };
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
  onChange: (value: string) => {
    console.log("Value changed:", value);
  },
  onClick: () => {
    console.log("Clicked");
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
  className: "btn btn-primary",
  disabled: false,
  id: "complex-btn",
  children: ["Click", " ", "Me"],
  "aria-label": "Complex button",
  "data-testid": "test-button",
  type: "submit"
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
  id: "list-1",
  tags: ["javascript", "typescript"],
  __typename: "UserList"
};

// ============================================================================
// SECTION 11: OBJECTS WITH REGULAR FUNCTIONS - Should sort
// ============================================================================

const apiClient = {
  post: async (url: string, data: any) => {
    return fetch(url, { body: JSON.stringify(data), method: "POST" });
  },
  get: async (url: string) => {
    return fetch(url, { method: "GET" });
  },
  delete: async (url: string) => {
    return fetch(url, { method: "DELETE" });
  },
  baseUrl: "https://api.example.com",
  timeout: 5000,
  id: "api-client-1"
};

// ============================================================================
// SECTION 12: TYPESCRIPT GENERICS - Should handle correctly
// ============================================================================

type ApiConfigWithGenerics = {
  timeout: number;
  retries: number;
  baseUrl: string;
  headers: Record<string, string>;
  enabled: boolean;
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
  statusCode: 200,
  data: {
    users: [
      {
        email: "user1@example.com",
        name: "User One",
        _id: "mongo1",
        id: "1",
        __typename: "User"
      },
      {
        email: "user2@example.com",
        name: "User Two",
        _id: "mongo2",
        id: "2",
        __typename: "User"
      }
    ],
    total: 2,
    __typename: "UserConnection"
  },
  message: "Success",
  timestamp: Date.now()
};

// ============================================================================
// SECTION 14: RETURN STATEMENTS - Should be sorted
// ============================================================================

function getUserData() {
  return {
    name: "John",
    age: 30,
    email: "john@example.com",
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
    data: await response.json(),
    message: "Success"
  };
}

// ============================================================================
// SECTION 15: NAMED EXPORTS - Should be sorted
// ============================================================================

export {
  userSettings,
  graphqlUser,
  applicationConfig,
  eventHandlers,
  apiClient,
  complexApiResponse
};

// ============================================================================
// SECTION 16: IGNORE COMMENTS - Should NOT be sorted
// ============================================================================

// auto-sort-ignore-next-line
const manualOrder1 = { zebra: 1, apple: 2, monkey: 3, banana: 4 };

// auto-sort-ignore
const manualOrder2 = { z: 5, a: 6, m: 7, b: 8 };

// This one WILL be sorted (no ignore comment)
const willBeSorted = { zebra: 9, apple: 10, monkey: 11, banana: 12 };

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

