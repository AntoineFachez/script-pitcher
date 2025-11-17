import { POST } from "./route";
import { auth } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

// Mock the Firebase Admin auth object
jest.mock("@/lib/firebase/firebase-admin", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

// Mock 'jose' for JWT signing if it's not available in the test env
jest.mock("jose", () => ({
  SignJWT: jest.fn().mockReturnThis(),
  setProtectedHeader: jest.fn().mockReturnThis(),
  setIssuedAt: jest.fn().mockReturnThis(),
  setExpirationTime: jest.fn().mockReturnThis(),
  sign: jest.fn().mockResolvedValue("mock-signed-jwt"),
}));

describe("POST /api/auth/session-sync", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...originalEnv, NEXTAUTH_SECRET: "test-secret" };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original env
  });

  it("should return 400 if idToken is missing", async () => {
    // Arrange
    const req = {
      json: async () => ({}), // No idToken
    };

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Missing ID token");
  });

  it("should return 401 if idToken is invalid", async () => {
    // Arrange
    auth.verifyIdToken.mockRejectedValue(new Error("Invalid token"));
    const req = {
      json: async () => ({ idToken: "invalid-firebase-token" }),
    };

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.message).toBe("Authentication failed or invalid token");
  });

  it("should return 200 and set a session cookie on valid idToken", async () => {
    // Arrange
    const mockDecodedToken = {
      uid: "user123",
      email: "test@example.com",
      name: "Test User",
    };
    auth.verifyIdToken.mockResolvedValue(mockDecodedToken);

    const req = {
      json: async () => ({ idToken: "valid-firebase-token" }),
    };

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.userId).toBe("user123");

    // Check if the cookie is set correctly
    const cookieHeader = response.headers.get("Set-Cookie");
    expect(cookieHeader).toContain("next-auth.session-token=mock-signed-jwt");
    expect(cookieHeader).toContain("HttpOnly");
    expect(cookieHeader).toContain("Path=/");
    expect(cookieHeader).toContain("SameSite=Lax");
  });

  it("should return 500 if NEXTAUTH_SECRET is not set", async () => {
    // Arrange
    delete process.env.NEXTAUTH_SECRET;
    const req = {
      json: async () => ({ idToken: "any-token" }),
    };

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.message).toBe("Server configuration error.");
  });
});
