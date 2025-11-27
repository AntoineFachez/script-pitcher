import { GET } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the entire firebase-admin module
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("GET /api/document", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    // Setup mock Firestore functions
    mockGet = jest.fn();

    // Stable mock objects
    const mockInnerDocObj = {
      get: mockGet,
    };
    const mockInnerDoc = jest.fn(() => mockInnerDocObj);

    const mockInnerCollectionObj = {
      doc: mockInnerDoc,
    };
    const mockInnerCollection = jest.fn(() => mockInnerCollectionObj);

    const mockDocObj = {
      get: mockGet,
      collection: mockInnerCollection,
    };
    mockDoc = jest.fn(() => mockDocObj);

    const mockCollectionObj = {
      doc: mockDoc,
    };
    mockCollection = jest.fn(() => mockCollectionObj);

    mockDb = {
      collection: mockCollection,
      doc: mockDoc,
    };

    mockAuth = {
      verifyIdToken: jest.fn(),
    };

    getAdminServices.mockReturnValue({ db: mockDb, auth: mockAuth });
  });

  // Helper to create a mock request object
  const mockRequest = (queryParams, token) => ({
    headers: {
      get: (header) =>
        header === "Authorization" && token ? `Bearer ${token}` : null,
    },
    url: `http://localhost/api/document?${new URLSearchParams(
      queryParams
    ).toString()}`,
  });

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ projectId: "proj1", fileId: "file1" }, null);
    const response = await GET(req);
    expect(response.status).toBe(401);
  });

  it("should return 400 if projectId or fileId is missing", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user1" });
    const req = mockRequest({ projectId: "proj1" }, "valid-token"); // Missing fileId
    const response = await GET(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Missing required query parameters");
  });

  it("should return 404 if the project is not found", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user1" });
    mockGet.mockResolvedValue({ exists: false }); // Project does not exist

    const req = mockRequest(
      { projectId: "non-existent-proj", fileId: "file1" },
      "valid-token"
    );
    const response = await GET(req);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Project not found");
  });

  it("should return 403 if the user is not a member of the project", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "not-a-member" });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        members: { "member-user": { role: "viewer" } }, // User 'not-a-member' is not in this list
      }),
    });

    const req = mockRequest(
      { projectId: "proj1", fileId: "file1" },
      "valid-token"
    );
    const response = await GET(req);

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("You are not authorized to view this document.");
  });

  it("should return 404 if the file is not found within the project", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "member-user" });

    // First .get() is for the project (exists), second is for the file (does not exist)
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          members: { "member-user": { role: "viewer" } },
        }),
      })
      .mockResolvedValueOnce({ exists: false });

    const req = mockRequest(
      { projectId: "proj1", fileId: "non-existent-file" },
      "valid-token"
    );
    const response = await GET(req);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("File not found");
  });

  it("should successfully fetch and return the document for an authorized user", async () => {
    const userId = "member-user";
    const fileData = { content: "This is the document content." };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project and file existence
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({
          members: { [userId]: { role: "viewer" } },
        }),
      })
      .mockResolvedValueOnce({
        exists: true,
        data: () => fileData,
      });

    const req = mockRequest(
      { projectId: "proj1", fileId: "file1" },
      "valid-token"
    );
    const response = await GET(req);

    // Assertions
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(fileData);

    // Verify correct Firestore calls
    expect(mockDoc).toHaveBeenCalledWith(`projects/proj1`);
    // The mock is a bit complex, but this confirms the subcollection was accessed
    expect(mockDoc().collection).toHaveBeenCalledWith("files");
    expect(mockDoc().collection().doc).toHaveBeenCalledWith("file1");
  });
});
