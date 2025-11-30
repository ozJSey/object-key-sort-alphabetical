// 🧪 COMPREHENSIVE TEST FILE FOR VSCode EXTENSION
// Save this file (Cmd/Ctrl + S) to see automatic sorting in action!

// ============================================================================
// TEST 1: Single-line Import (should sort alphabetically)
// ============================================================================
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { zebra, apple, monkey, banana } from "animals";
// ============================================================================
// TEST 2: Multi-line Import (should sort alphabetically)
// ============================================================================
import {
  ZebraComponent,
  AlphaComponent,
  BetaComponent,
  GammaComponent,
  DeltaComponent
} from "my-ui-library";

import {
  Zebra,
  Alpha,
  Monkey,
  Beta
} from "test-library";

// ============================================================================
// TEST 3: Another Multi-line Import with Mixed Order
// ============================================================================
import {
  map,
  filter,
  reduce,
  forEach,
  find,
  some,
  every
} from "lodash";

import {
  zulu,
  alpha,
  charlie,
  bravo
} from "phonetic"

// ============================================================================
// TEST 4: Priority Sorting - __typename, id, _id
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
// TEST 5: Shorthand Properties
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
// TEST 6: TypeScript Interface (with semicolons)
// ============================================================================
interface User {
  name: string;
  age: number;
  email: string;
  _id: string;
  id: string;
  __typename: string;
}

interface Product {
  price: number;
  name: string;
  category: string;
  id: string;
  __typename: string;
}

// ============================================================================
// TEST 7: TypeScript Type (with semicolons)
// ============================================================================
type Product = {
  price: number;
  name: string;
  id: string;
  __typename: string;
  category: string;
};

type Animal = {
  species: string;
  name: string;
  age: number;
  id: string;
};

// ============================================================================
// TEST 8: Nested Objects
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
// TEST 9: Object with Arrow Functions
// ============================================================================
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

const handlers = {
  onSubmit: () => console.log("submit"),
  name: "myForm",
  onChange: () => {},
  id: "form-1"
};

// ============================================================================
// TEST 10: Single Line Object
// ============================================================================
const singleLine = { zebra: 1, alpha: 2, id: 3, beta: 4, __typename: "Single" };
const anotherSingle = { z: 1, a: 2, m: 3, b: 4, id: 5 };

// ============================================================================
// TEST 11: Object with String Keys
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
// TEST 12: Object with Arrays
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

const listData = {
  items: [
    { title: "First", id: "1" },
    { title: "Second", id: "2" }
  ],
  count: 2,
  id: "list-2"
};

// ============================================================================
// TEST 13: Complex Real-World API Response
// ============================================================================
const apiResponse = {
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

const anotherResponse = {
  status: 201,
  result: {
    products: [
      {
        price: 99,
        name: "Product A",
        id: "prod-1",
        __typename: "Product"
      }
    ],
    count: 1,
    __typename: "ProductList"
  },
  error: null
};

// ============================================================================
// TEST 14: Empty and Single Property Objects (should not change)
// ============================================================================
const empty = {};
const single = { onlyOne: true };
const stillEmpty = {};

// ============================================================================
// TEST 15: Already Sorted (should not change)
// ============================================================================
const alreadySorted = {
  __typename: "Perfect",
  id: "already-1",
  _id: "already-mongo",
  alpha: 1,
  beta: 2,
  gamma: 3,
  zeta: 4
};

const needsSorting = {
  zulu: 1,
  alpha: 2,
  mike: 3,
  bravo: 4
};

// ============================================================================
// TEST 16: Ignore Comments
// ============================================================================
// auto-sort-ignore-next-line
const ignoreThis = {
  zebra: 1,
  apple: 2,
  monkey: 3
};

const sortThis = {
  zebra: 1,
  apple: 2,
  monkey: 3
};

// auto-sort-ignore
const alsoIgnore = { z: 1, a: 2, m: 3 };

// ============================================================================
// TEST 17: Flat Arrays with Primitives (should sort)
// ============================================================================
const stringArray = ["zebra", "apple", "monkey", "banana"];
const simpleTest = ["z", "a", "m"];
const numberArray = [100, 5, 50, 10, 1];
const variableArray = [zebra, apple, monkey, id, __typename];
const mixedStrings = [
  "zebra",
  "apple", 
  "monkey",
  "banana"
];

// ============================================================================
// TEST 17: Arrays with Objects (should NOT sort array, but sort objects inside)
// ============================================================================
const arrayWithObjects = [
  { name: "Zebra", id: "3" },
  { name: "Apple", id: "1" },
  { name: "Banana", id: "2" }
];

// ============================================================================
// EXPECTED RESULTS AFTER SAVE:
// ============================================================================
// OBJECTS:
// 1. __typename (and other __* keys) should always be FIRST
// 2. id should always be SECOND
// 3. _id should always be THIRD
// 4. Everything else alphabetically
// 5. Nested objects sorted recursively
// 6. Formatting (spaces, newlines, commas/semicolons) preserved exactly
//
// IMPORTS:
// 1. Named imports sorted alphabetically
// 2. Formatting preserved exactly
// ============================================================================

export {
  graphqlUser,
  shorthandObject,
  nestedData,
  componentProps,
  singleLine,
  config,
  dataWithArrays,
  apiResponse,
  empty,
  single,
  alreadySorted
};
