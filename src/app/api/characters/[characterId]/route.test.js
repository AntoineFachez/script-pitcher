import { PUT } from "./route";
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

describe("PUT /api/characters/[characterId]", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet, mockUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    mockUpdate = jest.fn().mockResolvedValue();
    mockGet = jest.fn();

    // Stable mock objects
    const mockInnerDocObj = {
      get: mockGet,
      update: mockUpdate,
    };
    const mockInnerDoc = jest.fn((path) => ({
      ...mockInnerDocObj,
      id: path ? path.split("/").pop() : "mock-id",
    }));

    const mockInnerCollectionObj = {
      doc: mockInnerDoc,
    };
    const mockInnerCollection = jest.fn(() => mockInnerCollectionObj);

    const mockDocObj = {
      get: mockGet,
      update: mockUpdate,
      collection: mockInnerCollection,
    };
    mockDoc = jest.fn((path) => ({
      ...mockDocObj,
      id: path ? path.split("/").pop() : "mock-id",
    }));

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

  const mockRequest = (body, token) => ({
    headers: {
      get: (header) =>
        header === "authorization" && token ? `Bearer ${token}` : null,
    },
    json: async () => body,
  });

  const mockParams = { characterId: "char123" };

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ projectId: "proj1" }, null);
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(401);
  });

  it("should return 401 if the auth token is invalid", async () => {
    mockAuth.verifyIdToken.mockRejectedValue(new Error("Invalid token"));
    const req = mockRequest({ projectId: "proj1" }, "invalid-token");
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(401);
  });

  it("should return 400 if projectId is missing", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    const req = mockRequest({}, "valid-token"); // Missing projectId
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Project ID and Character ID are required.");
  });

  it("should return 404 if project does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    mockGet.mockResolvedValue({ exists: false }); // Project does not exist

    const req = mockRequest({ projectId: "non-existent-proj" }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Project not found.");
  });

  it("should return 403 if user is not an owner or editor", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-viewer" });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        members: {
          "user-viewer": { role: "viewer" },
        },
      }),
    });

    const req = mockRequest({ projectId: "proj1" }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toContain("Forbidden");
  });

  it("should return 404 if character does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });

    // First get() for project, second for character
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ members: { "user-owner": { role: "owner" } } }),
      })
      .mockResolvedValueOnce({ exists: false }); // Character does not exist

    const req = mockRequest({ projectId: "proj1" }, "valid-token");
    const response = await PUT(req, {
      params: { characterId: "non-existent-char" },
    });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Character not found.");
  });

  it("should successfully update the character if user is an owner", async () => {
    const userId = "user-owner";
    const characterId = "char123";
    const projectId = "proj1";
    const updateData = {
      name: "Updated Name",
      archetype: "Hero",
      description: "An updated hero.",
    };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project and character existence
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ members: { [userId]: { role: "owner" } } }),
      })
      .mockResolvedValueOnce({ exists: true });

    const req = mockRequest({ projectId, ...updateData }, "valid-token");
    const response = await PUT(req, { params: { characterId } });

    // Assertions
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(characterId);
    expect(body.name).toBe(updateData.name);

    // Verify the correct update call was made
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: updateData.name,
        archetype: updateData.archetype,
        description: updateData.description,
        updatedAt: expect.anything(), // FieldValue is an object
      })
    );
  });

  it("should return 500 on a server error", async () => {
    const userId = "user-editor";
    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Simulate a failure during the project fetch
    mockGet.mockRejectedValue(new Error("Database connection failed"));

    const req = mockRequest({ projectId: "proj1" }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Internal Server Error");

    // Optional: Check if the error was logged
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    try {
      await PUT(req, { params: mockParams });
    } catch (e) {
      // We expect this to fail, but we want to check the log
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating character document:",
      "Database connection failed"
    );
    consoleErrorSpy.mockRestore();
  });
});
