// Complex real-world TypeScript file to test extension behavior
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce, throttle, isEmpty, orderBy } from "lodash";
import { API_CONFIG, DEFAULT_TIMEOUT } from "./constants";

// This file tests that our extension doesn't break actual code logic
// Only object/interface properties should be sorted, not code execution order

interface UserProfile {
  name: string;
  email: string;
  age: number;
  id: string;
  __typename: string;
  _id: string;
}

type ApiResponse = {
  statusCode: number;
  data: any;
  message: string;
  timestamp: number;
};

class UserService {
  private cache: Map<string, any>;
  private timeout: number;

  constructor(timeout = 5000) {
    this.timeout = timeout;
    this.cache = new Map();
  }

  async fetchUser(id: string): Promise<UserProfile | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      this.cache.set(id, data);
      return data;
    } catch (error) {
      console.error("Failed to fetch user", error);
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Test: Function argument order should NOT be sorted
function calculateTotal(price: number, tax: number, discount: number): number {
  return price + tax - discount;
}

// Test: Function call argument order should NOT be sorted
const result = calculateTotal(100, 10, 5);

// Test: Array element order should NOT be sorted (unless it's a primitive array)
const executionSteps = [
  "initialize",
  "validate",
  "process",
  "cleanup"
];

// Test: Object property order SHOULD be sorted
const userConfig = {
  timeout: 5000,
  retries: 3,
  enabled: true,
  apiKey: "secret",
  id: "config-1"
};

// Test: Switch case order should NOT be sorted
function handleAction(action: string): string {
  switch (action) {
    case "create":
      return "Creating...";
    case "delete":
      return "Deleting...";
    case "update":
      return "Updating...";
    case "read":
      return "Reading...";
    default:
      return "Unknown action";
  }
}

// Test: If-else logic order should NOT be sorted
function validateAge(age: number): boolean {
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

// Test: Destructuring order should NOT be sorted (it's positional)
const [first, second, third] = [1, 2, 3];
const { zebra, alpha, monkey } = { zebra: 1, alpha: 2, monkey: 3 };

// Test: Object with methods - method order should be sorted
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
  put: async (url: string, data: any) => {
    return fetch(url, { method: "PUT", body: JSON.stringify(data) });
  }
};

// Test: Nested objects should be sorted recursively
const appConfig = {
  database: {
    port: 5432,
    host: "localhost",
    password: "secret",
    username: "admin"
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    ssl: true
  },
  version: "1.0.1",
  name: "MyApp"
};

// Test: React component - props object should be sorted, but JSX structure should NOT be reordered
function UserCard({ userId, onDelete, className, theme }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await fetch(`/api/users/${userId}`).then(r => r.json());
      setUser(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={className}>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

// Test: Complex GraphQL-like object
const graphqlQuery = {
  query: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        posts {
          id
          title
          content
        }
      }
    }
  `,
  variables: {
    id: "user-123"
  },
  operationName: "GetUser"
};

// Test: Object with computed properties - should NOT break
const dynamicKey = "username";
const dynamicObject = {
  [dynamicKey]: "john_doe",
  email: "john@example.com",
  id: "user-456"
};

// Test: Regex patterns should NOT be modified
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  id: /^[a-f0-9]{24}$/
};

// Test: Template literals and multi-line strings should NOT be modified
const template = `
  User Information:
  Name: ${userConfig.timeout}
  Email: test@example.com
  Status: Active
`;

// Test: Arrow function bodies should NOT be reordered
const operations = [
  () => console.log("First operation"),
  () => console.log("Second operation"),
  () => console.log("Third operation")
].forEach(op => op());

// Test: Enum-like object (values should be sorted)
const StatusCodes = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401
};

// Test: Type with union - order should NOT matter in logic
type Action = "create" | "read" | "update" | "delete";

// Test: Export order should NOT be sorted
export { UserService, calculateTotal, handleAction, validateAge, UserCard };
export type { UserProfile, ApiResponse, Action };
export default appConfig;

