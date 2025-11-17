import { PUT } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the entire firebase-admin module
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

describe("PUT /api/projects/[projectId]", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet, mockUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    mockUpdate = jest.fn().mockResolvedValue();
    mockGet = jest.fn();
    // This mock now correctly returns an object with the update function
    mockDoc = jest.fn(() => ({
      get: mockGet,
      update: mockUpdate,
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

  const mockParams = { projectId: "proj123" };

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ projectData: {} }, null);
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(401);
  });

  it("should return 400 if projectData is missing from the body", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });
    const req = mockRequest({}, "valid-token"); // Missing projectData
    const response = await PUT(req, { params: mockParams });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("projectData object is required in the body.");
  });

  it("should return 404 if the project does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });
    mockGet.mockResolvedValue({ exists: false }); // Project does not exist

    const req = mockRequest({ projectData: {} }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Project not found");
  });

  it("should return 403 if the user is not a member of the project", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "not-a-member" });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        members: { "member-user": { role: "owner" } }, // User 'not-a-member' is not in this list
      }),
    });

    const req = mockRequest({ projectData: {} }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("Forbidden: You are not a member of this project.");
  });

  it("should return 403 if the user is a viewer (not owner or editor)", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-viewer" });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        members: { "user-viewer": { role: "viewer" } },
      }),
    });

    const req = mockRequest({ projectData: {} }, "valid-token");
    const response = await PUT(req, { params: mockParams });

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe(
      "Forbidden: You must be an owner or editor to make changes."
    );
  });

  it("should successfully update the project if user is an owner", async () => {
    const userId = "user-owner";
    const projectId = "proj123";
    const updateData = {
      title: "Updated Project Title",
      logline: "An updated logline.",
    };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: userId });

    // Mock project existence and membership
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ members: { [userId]: { role: "owner" } } }),
    });

    const req = mockRequest({ projectData: updateData }, "valid-token");
    const response = await PUT(req, { params: { projectId } });

    // Assertions
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(projectId);
    expect(body.title).toBe(updateData.title);

    // Verify the correct update call was made
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: updateData.title,
        logline: updateData.logline,
        updatedAt: expect.anything(), // FieldValue is an object
      })
    );
  });
});
