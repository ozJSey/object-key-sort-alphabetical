// MANUAL INLINE TEST FILE
// Save this file (Cmd/Ctrl + S) to verify extension behavior
// This tests that we ONLY sort objects/arrays and don't break anything else

// ============================================================================
// SECTION 1: FUNCTION DEFINITIONS - Should NOT be modified
// ============================================================================

function calculatePrice(basePrice: number, tax: number, discount: number): number {
  return basePrice + tax - discount;
}

const processSteps = (init: boolean, validate: boolean, execute: boolean) => {
  if (init) console.log("Initializing");
  if (validate) console.log("Validating");
  if (execute) console.log("Executing");
};

// ============================================================================
// SECTION 2: FUNCTION CALLS - Argument order should NOT change
// ============================================================================

const totalPrice = calculatePrice(100, 15, 10);
const result = processSteps(true, false, true);

// ============================================================================
// SECTION 3: CONTROL FLOW - Order should NOT change
// ============================================================================

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
function validateUserAge(age: number): boolean {
  if (age < 0) {
    return false;
  } else if (age < 18) {
    return false;
  } else if (age > 120) {
    return false;
  } else {
    return true;
  }
}

// ============================================================================
// SECTION 4: ARRAYS WITH EXECUTION ORDER - Should NOT be sorted
// ============================================================================

const executionQueue = [
  "initialize_database",
  "validate_config",
  "start_server",
  "register_routes",
  "listen_for_connections"
];

const processingPipeline = [
  (data: any) => data.trim(),
  (data: any) => data.toLowerCase(),
  (data: any) => data.split(" "),
  (data: any) => data.filter(Boolean)
];

const operationOrder = [
  { step: "connect", order: 1 },
  { step: "authenticate", order: 2 },
  { step: "query", order: 3 },
  { step: "disconnect", order: 4 }
];

// ============================================================================
// SECTION 5: OBJECTS THAT SHOULD BE SORTED
// ============================================================================

// Simple object - SHOULD be sorted alphabetically
const userSettings = {
  volume: 80,
  theme: "dark",
  notifications: true,
  language: "en",
  autoSave: false
};

// Object with priority keys - SHOULD be sorted with __typename, id, _id first
const graphqlUser = {
  username: "john_doe",
  email: "john@example.com",
  age: 30,
  _id: "mongodb-id-123",
  active: true,
  id: "user-456",
  __typename: "User"
};

// Nested objects - SHOULD be sorted recursively
const applicationConfig = {
  server: {
    port: 3000,
    host: "localhost",
    timeout: 5000,
    ssl: false
  },
  database: {
    port: 5432,
    host: "db.example.com",
    name: "myapp",
    password: "secret",
    username: "admin"
  },
  version: "1.0.1",
  name: "MyApp"
};

// ============================================================================
// SECTION 6: ARRAYS THAT SHOULD BE SORTED (primitives only)
// ============================================================================

const tags = ["zebra", "apple", "monkey", "banana", "charlie"];
const priorities = [5, 2, 8, 1, 3];
const flags = [false, true, false, true];

// Variables in array - SHOULD be sorted
const lastName = "Doe";
const firstName = "John";
const middleName = "Robert";
const userParts = [lastName, firstName, middleName];

// ============================================================================
// SECTION 7: DESTRUCTURING - Should NOT be modified (positional)
// ============================================================================

const [first, second, third, fourth] = [1, 2, 3, 4];
const { zebra, alpha, monkey } = { zebra: 1, alpha: 2, monkey: 3 };

function ComponentWithProps({ userId, theme, onClose, className }: any) {
  return null;
}

// ============================================================================
// SECTION 8: OBJECTS WITH COMPLEX VALUES - Should be sorted, values preserved
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

const configWithArrays = {
  zebra: [1, 2, 3, 4, 5],
  alpha: ["a", "b", "c"],
  monkey: [true, false, true],
  id: "config-123"
};

const patternsWithRegex = {
  zipCode: /^\d{5}(-\d{4})?$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  id: "patterns-1"
};

// ============================================================================
// SECTION 9: TEMPLATE LITERALS & STRINGS - Should NOT be modified
// ============================================================================

const userTemplate = `
  User Profile:
  Name: ${firstName} ${lastName}
  Age: ${30}
  Status: Active
`;

const sqlQuery = `
  SELECT *
  FROM users
  WHERE age > 18
  ORDER BY created_at DESC
`;

const jsonString = '{"name": "test", "age": 30, "city": "NYC"}';

// ============================================================================
// SECTION 10: COMMENTS - Should be preserved with their properties
// ============================================================================

const documentedConfig = {
  timeout: 5000, // Maximum timeout in milliseconds
  retries: 3, // Number of retry attempts
  enabled: true, // Feature flag
  apiKey: "secret-key", // API authentication key
  id: "config-456" // Unique identifier
};

const blockCommented = {
  /* This is the zebra property */
  zebra: 1,
  /* This is the alpha property */
  alpha: 2,
  /* This is the ID */
  id: "block-123"
};

// ============================================================================
// SECTION 11: TYPESCRIPT INTERFACES & TYPES - Should be sorted
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
// SECTION 12: IMPORTS - Should be sorted alphabetically
// ============================================================================

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { debounce, throttle, orderBy, isEmpty, clone } from "lodash";

// ============================================================================
// SECTION 13: CLASS DEFINITIONS - Structure should NOT change
// ============================================================================

class DataService {
  private cache: Map<string, any>;
  private timeout: number;

  constructor(timeout = 5000) {
    this.timeout = timeout;
    this.cache = new Map();
  }

  async fetch(id: string) {
    return this.cache.get(id);
  }

  clear() {
    this.cache.clear();
  }

  private validate(id: string) {
    return id.length > 0;
  }
}

// ============================================================================
// SECTION 14: OBJECTS WITH METHODS - Should be sorted
// ============================================================================

const apiClient = {
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
  timeout: 5000,
  id: "api-client-1"
};

// ============================================================================
// SECTION 15: SHORTHAND PROPERTIES - Should be sorted
// ============================================================================

const shorthandId = "short-123";
const shorthandName = "Test";
const shorthandAge = 25;
const shorthandEmail = "test@example.com";

const shorthandObject = {
  shorthandAge,
  shorthandEmail,
  shorthandId,
  shorthandName
};

// ============================================================================
// SECTION 16: STRING KEYS - Should be sorted
// ============================================================================

const cssProperties = {
  "z-index": 100,
  "background-color": "#fff",
  "font-size": "16px",
  "margin-top": "20px",
  display: "flex",
  id: "css-1"
};

// ============================================================================
// SECTION 17: MIXED CONTENT - Complex real-world scenario
// ============================================================================

const complexApiResponse = {
  statusCode: 200,
  data: {
    users: [
      { name: "Alice", id: "1", __typename: "User" },
      { name: "Bob", id: "2", __typename: "User" }
    ],
    pagination: {
      total: 100,
      page: 1,
      limit: 10,
      hasMore: true
    },
    __typename: "UserConnection"
  },
  message: "Success",
  timestamp: Date.now(),
  metadata: {
    version: "2.0",
    cached: false,
    duration: 125
  }
};

// ============================================================================
// SECTION 18: IGNORED BLOCKS - Should NOT be sorted
// ============================================================================

// auto-sort-ignore-next-line
const manualOrder1 = { zebra: 1, apple: 2, monkey: 3, banana: 4 };

// auto-sort-ignore
const manualOrder2 = { z: 5, a: 6, m: 7, b: 8 };

// This one WILL be sorted (no ignore comment)
const autoSorted = { zebra: 9, apple: 10, monkey: 11, banana: 12 };

// ============================================================================
// SECTION 19: EMPTY & SINGLE PROPERTY - Should NOT be modified
// ============================================================================

const emptyObject = {};
const emptyArray: any[] = [];
const singleProp = { onlyOne: true };
const singleElement = ["only"];

// ============================================================================
// SECTION 20: ALREADY SORTED - Should NOT create edits
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
// EXPECTED BEHAVIOR AFTER SAVE:
// ============================================================================
// ✅ Objects (userSettings, graphqlUser, applicationConfig, etc.) - SORTED
// ✅ Primitive arrays (tags, priorities, flags, userParts) - SORTED
// ✅ Imports - SORTED alphabetically
// ✅ Interfaces/Types - Properties SORTED
// ✅ Comments - PRESERVED with their properties
// ✅ Ignored blocks - NOT SORTED
//
// ❌ Function definitions - NOT MODIFIED
// ❌ Function calls - NOT MODIFIED
// ❌ Control flow (if/else, switch) - NOT MODIFIED
// ❌ Execution order arrays - NOT MODIFIED
// ❌ Destructuring - NOT MODIFIED
// ❌ Template literals - NOT MODIFIED
// ❌ Class structure - NOT MODIFIED
// ❌ Empty/single items - NOT MODIFIED
// ❌ Already sorted - NO EDITS
// ============================================================================

export {
  userSettings,
  graphqlUser,
  applicationConfig,
  eventHandlers,
  apiClient,
  complexApiResponse
};

