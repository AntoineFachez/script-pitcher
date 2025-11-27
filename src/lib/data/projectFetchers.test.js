import { getProjectsAndMembers } from "./projectFetchers";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the firebase-admin services
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

// Create mock functions that we can spy on and control
// Create mock functions that we can spy on and control
const mockGetDoc = jest.fn();
const mockGetDocs = jest.fn();

// Mock objects for chaining
const mockDocObj = {
  get: jest.fn(() => mockGetDoc()),
};

const mockQueryObj = {
  get: jest.fn(() => mockGetDocs()),
};

const mockCollectionObj = {
  where: jest.fn(() => mockQueryObj),
  doc: jest.fn(() => mockDocObj),
};

const mockDoc = jest.fn(() => mockDocObj);
const mockCollection = jest.fn(() => mockCollectionObj);
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockDocumentId = jest.fn(() => "mockFieldPath"); // Keep this for the 'in' query

jest.mock("firebase-admin/firestore", () => ({
  ...jest.requireActual("firebase-admin/firestore"),
  doc: (...args) => mockDoc(...args),
  getDoc: (docRef) => mockGetDoc(docRef),
  collection: (...args) => mockCollection(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  getDocs: (query) => mockGetDocs(query),
  documentId: () => mockDocumentId(),
  FieldPath: {
    documentId: jest.fn(() => "mockFieldPath"),
  },
}));

describe("getProjectsAndMembers", () => {
  let mockDb;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // The mockDb is now just a placeholder, as the top-level functions are mocked directly.
    mockDb = {
      doc: mockDoc,
      collection: mockCollection,
    };

    // Make getAdminServices return our mock database
    getAdminServices.mockReturnValue({ db: mockDb });
  });

  it("should fetch projects and users for a user with projects", async () => {
    // Arrange: Mock data
    const userId = "user-with-projects";
    const mockProjectsMap = {
      "project-1": { role: "owner" },
      "project-2": { role: "viewer" },
    };
    const mockProjectDocs = [
      {
        id: "project-1",
        data: () => ({
          title: "Project One",
          members: { "user-with-projects": { role: "owner" } },
        }),
      },
      {
        id: "project-2",
        data: () => ({
          title: "Project Two",
          members: {
            "user-with-projects": { role: "viewer" },
            "another-user": { role: "editor" },
          },
        }),
      },
    ];
    const mockUserDocs = [
      {
        id: "user-with-projects",
        data: () => ({ displayName: "Test User" }),
      },
      { id: "another-user", data: () => ({ displayName: "Another User" }) },
    ];

    // Mock Firestore responses
    // 1. Mock the getDoc call for the user's summary
    mockGetDoc.mockResolvedValue({
      exists: true,
      data: () => ({ projects: mockProjectsMap }),
    });

    // 2. Mock the getDocs calls for projects and users
    // This simulates the batching behavior. We'll just return all docs in one go.
    mockGetDocs.mockResolvedValueOnce({ docs: mockProjectDocs }); // For projects
    mockGetDocs.mockResolvedValueOnce({ docs: mockUserDocs }); // For users

    // Act
    const result = await getProjectsAndMembers(userId);

    // Assert
    expect(result.projects).toHaveLength(2);
    expect(result.users).toHaveLength(2);
    expect(result.projects[0].title).toBe("Project One");
    expect(result.users[0].displayName).toBe("Test User");

    // Verify that the correct collections and documents were queried
    // Verify that the correct collections and documents were queried
    expect(mockDoc).toHaveBeenCalledWith(`users/${userId}/private/summary`);
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockCollection).toHaveBeenCalledWith("users");
  });

  it("should return empty arrays for a user with no projects", async () => {
    // Arrange
    const userId = "user-with-no-projects";
    mockGetDoc.mockResolvedValue({
      exists: true,
      data: () => ({ projects: {} }), // Empty projects map
    });

    // Act
    const result = await getProjectsAndMembers(userId);

    // Assert
    expect(result.projects).toEqual([]);
    expect(result.users).toEqual([]);
    expect(mockGetDocs).not.toHaveBeenCalled(); // Should not query projects or users
  });

  it("should return empty arrays if the user summary document does not exist", async () => {
    // Arrange
    const userId = "non-existent-user";
    mockGetDoc.mockResolvedValue({ exists: false });

    // Act
    const result = await getProjectsAndMembers(userId);

    // Assert
    expect(result.projects).toEqual([]);
    expect(result.users).toEqual([]);
  });

  it("should throw an error if the database call fails", async () => {
    // Arrange
    const userId = "any-user";
    const errorMessage = "Firestore is offline";
    mockGetDoc.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(getProjectsAndMembers(userId)).rejects.toThrow(
      "Firestore is offline"
    );

    // You can also check if your error logger was called
    // This requires setting up a spy on console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    try {
      await getProjectsAndMembers(userId);
    } catch (e) {
      // Expected to fail
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching projects and members:",
      "Firestore is offline"
    );
    consoleErrorSpy.mockRestore();
  });
});
