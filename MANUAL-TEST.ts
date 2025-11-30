// 🧪 COMPREHENSIVE TEST FILE FOR VSCode EXTENSION
// Save this file (Cmd/Ctrl + S) to see automatic sorting in action!

// ============================================================================
// TEST 1: Single-line Import (should sort alphabetically)
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apple, banana, monkey, zebra } from "animals";
// ============================================================================
// TEST 2: Multi-line Import (should sort alphabetically)
// ============================================================================
import {
  AlphaComponent,
  DeltaComponent,
  GammaComponent,
  BetaComponent,
  ZebraComponent
} from "my-ui-library";

import {
  Alpha,
  Beta,
  Monkey,
  Zebra
} from "test-library";

// ============================================================================
// TEST 3: Another Multi-line Import with Mixed Order
// ============================================================================
import {
  every,
  filter,
  find,
  forEach,
  map,
  reduce,
  some
} from "lodash";

import {
  alpha,
  bravo,
  charlie,
  zulu
} from "phonetic"

// ============================================================================
// TEST 4: Priority Sorting - __typename, id, _id
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
// TEST 5: Shorthand Properties
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
// TEST 6: TypeScript Interface (with semicolons)
// ============================================================================
interface User {
  __typename: string,
  id: string,
  _id: string,
  age: number,
  email: string,
  name: string}

interface Product {
  __typename: string,
  id: string,
  category: string,
  name: string,
  price: number}

// ============================================================================
// TEST 7: TypeScript Type (with semicolons)
// ============================================================================
type Product = {
  __typename: string,
  id: string,
  category: string,
  name: string,
  price: number};

type Animal = {
  id: string,
  age: number,
  name: string,
  species: string};

// ============================================================================
// TEST 8: Nested Objects
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
// TEST 9: Object with Arrow Functions
// ============================================================================
const componentProps = {
  id: "complex-btn",
  "aria-label": "Complex button",
  children: ["Click", " ", "Me"],
  className: "btn btn-primary",
  onClick: (event) => {
    event.preventDefault();
    return { handled: true };
  },
  "data-testid": "test-button",
  disabled: false,
  type: "submit"
};

const handlers = {
  onChange: () => {},
  id: "form-1",
  onSubmit: () => console.log("submit"),
  name: "myForm",
};

// ============================================================================
// TEST 10: Single Line Object
// ============================================================================
const singleLine = { __typename: "Single", id: 3, alpha: 2, beta: 4, zebra: 1 };
const anotherSingle = { id: 5, a: 2, b: 4, m: 3, z: 1 };

// ============================================================================
// TEST 11: Object with String Keys
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
// TEST 12: Object with Arrays
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

const listData = {
  id: "list-2",
  count: 2,
  items: [
    { id: "1", title: "First" },
    { id: "2", title: "Second" }
  ]
};

// ============================================================================
// TEST 13: Complex Real-World API Response
// ============================================================================
const apiResponse = {
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

const anotherResponse = {
  error: null,
  result: {
    __typename: "ProductList",
    count: 1,
    products: [
      {
        __typename: "Product",
        id: "prod-1",
        name: "Product A",
        price: 99
      }
    ]
  },
  status: 201
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
  alpha: 2,
  bravo: 4,
  mike: 3,
  zulu: 1
};

// ============================================================================
// TEST 16: Flat Arrays with Primitives (should sort)
// ============================================================================
const stringArray = ["apple", "banana", "monkey", "zebra"];
const simpleTest = ["a", "m", "z"];
const numberArray = [1, 10, 100, 5, 50];
const variableArray = [__typename, apple, id, monkey, zebra];
const mixedStrings = [
  "apple",
  "banana", 
  "monkey",
  "zebra"
];

// ============================================================================
// TEST 17: Arrays with Objects (should NOT sort array, but sort objects inside)
// ============================================================================
const arrayWithObjects = [
  { id: "3", name: "Zebra" },
  { id: "1", name: "Apple" },
  { id: "2", name: "Banana" }
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
  alreadySorted,
  apiResponse,
  componentProps,
  config,
  dataWithArrays,
  empty,
  graphqlUser,
  nestedData,
  shorthandObject,
  single,
  singleLine
};
