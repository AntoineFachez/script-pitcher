import { authOptions } from "./authOptions";
import { getFirebaseDb } from "@/lib/firebase/firebase-client";
import { doc, getDoc } from "firebase/firestore";

// Mock the entire firebase/firestore module
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock our client-side DB getter
jest.mock("@/lib/firebase/firebase-client", () => ({
  getFirebaseDb: jest.fn(),
}));

describe("NextAuth authOptions", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("jwt callback", () => {
    it("should fetch and embed user profile data into the token on sign-in", async () => {
      // Arrange
      const mockUser = { id: "user123", name: "Initial Name" };
      const mockToken = {};
      const mockDb = {}; // Placeholder DB object
      const mockFirestoreUser = {
        displayName: "Firestore Name",
        email: "test@example.com",
        role: "admin",
      };

      getFirebaseDb.mockReturnValue(mockDb);
      doc.mockReturnValue("mock-doc-ref");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockFirestoreUser,
      });

      // Act
      const resultToken = await authOptions.callbacks.jwt({
        token: mockToken,
        user: mockUser,
      });

      // Assert
      expect(getFirebaseDb).toHaveBeenCalled();
      expect(doc).toHaveBeenCalledWith(mockDb, "users", "user123");
      expect(getDoc).toHaveBeenCalledWith("mock-doc-ref");

      expect(resultToken).toEqual({
        id: "user123",
        name: "Firestore Name",
        email: "test@example.com",
        profileData: {
          ...mockFirestoreUser,
          uid: "user123",
        },
      });
    });

    it("should return the original token if no user is provided (e.g., on session check)", async () => {
      // Arrange
      const mockToken = { id: "user123", name: "Existing Name" };

      // Act
      const resultToken = await authOptions.callbacks.jwt({ token: mockToken });

      // Assert
      // Ensure no database calls were made
      expect(getFirebaseDb).not.toHaveBeenCalled();
      expect(getDoc).not.toHaveBeenCalled();
      expect(resultToken).toBe(mockToken);
    });
  });

  describe("session callback", () => {
    it("should transfer data from the JWT token to the session object", async () => {
      // Arrange
      const mockSession = {
        user: { name: "Old Name" },
        expires: "some-date",
      };
      const mockToken = {
        id: "user123",
        name: "Token Name",
        email: "token@example.com",
        profileData: { role: "editor", uid: "user123" },
      };

      // Act
      const resultSession = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken,
      });

      // Assert
      expect(resultSession.user).toEqual({
        id: "user123",
        name: "Token Name",
        email: "token@example.com",
        profileData: {
          role: "editor",
          uid: "user123",
        },
      });
    });
  });
});
