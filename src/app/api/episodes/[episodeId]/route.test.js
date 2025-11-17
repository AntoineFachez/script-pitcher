import { PUT } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the entire firebase-admin module
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

describe("PUT /api/episodes/[episodeId]", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet, mockUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    mockUpdate = jest.fn().mockResolvedValue();
    mockGet = jest.fn();
    mockDoc = jest.fn(() => ({
      get: mockGet,
      update: mockUpdate,
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: mockGet,
          update: mockUpdate,
        })),
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

  const mockParams = { episodeId: "ep123" };

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ projectId: "proj1" }, null);
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(401);
  });

  it("should return 400 if projectId is missing", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    const req = mockRequest({}, "valid-token"); // Missing projectId
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(400);
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

  it("should return 404 if episode does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });

    // First get() for project, second for episode
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ members: { "user-owner": { role: "owner" } } }),
      })
      .mockResolvedValueOnce({ exists: false }); // Episode does not exist

    const req = mockRequest({ projectId: "proj1" }, "valid-token");
    const response = await PUT(req, {
      params: { episodeId: "non-existent-ep" },
    });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Episode not found.");
  });

  it("should successfully update the episode if user is an editor", async () => {
    const userId = "user-editor";
    const episodeId = "ep123";
    const projectId = "proj1";
    const updateData = {
      title: "The Pilot - Updated",
      description: "An updated description.",
    };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project and episode existence
    mockGet
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ members: { [userId]: { role: "editor" } } }),
      })
      .mockResolvedValueOnce({ exists: true });

    const req = mockRequest({ projectId, ...updateData }, "valid-token");
    const response = await PUT(req, { params: { episodeId } });

    // Assertions
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(episodeId);
    expect(body.title).toBe(updateData.title);

    // Verify the correct update call was made
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: updateData.title,
        description: updateData.description,
        updatedAt: expect.anything(), // FieldValue is an object
      })
    );
  });
});
