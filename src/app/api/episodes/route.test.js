import { POST } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the entire firebase-admin module
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

describe("POST /api/episodes", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet, mockAdd;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    mockAdd = jest.fn().mockResolvedValue({ id: "new-ep-id" });
    mockGet = jest.fn();
    mockDoc = jest.fn(() => ({
      get: mockGet,
      collection: jest.fn(() => ({
        add: mockAdd,
      })),
    }));
    mockCollection = jest.fn(() => ({
      doc: mockDoc,
    }));

    mockDb = {
      collection: mockCollection,
    };

    mockAuth = {
      verifyIdToken: jest.fn(),
    };

    getAdminServices.mockReturnValue({ db: mockDb, auth: mockAuth });
  });

  const mockRequest = (body, token) => ({
    headers: {
      get: (header) => (header === "authorization" ? `Bearer ${token}` : null),
    },
    json: async () => body,
  });

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ projectId: "proj1" }, null);
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it("should return 400 if projectId is missing", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    const req = mockRequest({}, "valid-token"); // Missing projectId
    const response = await POST(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Project ID is required to create an episode.");
  });

  it("should return 404 if project does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    mockGet.mockResolvedValue({ exists: false }); // Project does not exist

    const req = mockRequest({ projectId: "non-existent-proj" }, "valid-token");
    const response = await POST(req);

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
    const response = await POST(req);

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toContain("Forbidden");
  });

  it("should successfully create an episode if user is an editor", async () => {
    const userId = "user-editor";
    const projectId = "proj1";
    const episodeData = {
      title: "The Pilot",
      description: "The first episode.",
    };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project existence and membership
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ members: { [userId]: { role: "editor" } } }),
    });

    const req = mockRequest({ projectId, ...episodeData }, "valid-token");
    const response = await POST(req);

    // Assertions
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBe("new-ep-id");
    expect(body.title).toBe(episodeData.title);
    expect(body.ownerId).toBe(userId);

    // Verify the correct Firestore calls were made
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockDoc).toHaveBeenCalledWith(projectId);
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        title: episodeData.title,
        description: episodeData.description,
        ownerId: userId,
      })
    );
  });

  it("should return 500 on a server error during creation", async () => {
    const userId = "user-owner";
    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project check to succeed
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ members: { [userId]: { role: "owner" } } }),
    });

    // Simulate a failure during the .add() operation
    mockAdd.mockRejectedValue(new Error("Firestore write failed"));

    const req = mockRequest({ projectId: "proj1" }, "valid-token");
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Internal Server Error");
  });
});
