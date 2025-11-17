import { POST } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";

// Mock the entire firebase-admin module
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

describe("POST /api/projects/[projectId]/invite", () => {
  let mockDb, mockAuth, mockCollection, mockDoc, mockGet, mockSet;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Firestore functions
    mockSet = jest.fn().mockResolvedValue();
    mockGet = jest.fn();
    mockDoc = jest.fn(() => ({
      get: mockGet,
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: mockSet,
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

  const mockParams = { projectId: "proj123" };

  it("should return 401 if no auth token is provided", async () => {
    const req = mockRequest({ email: "test@test.com", role: "viewer" }, null);
    const response = await POST(req, { params: mockParams });
    expect(response.status).toBe(401);
  });

  it("should return 400 if email or role is missing", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });
    const req = mockRequest({ email: "test@test.com" }, "valid-token"); // Missing role
    const response = await POST(req, { params: mockParams });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Email and role are required.");
  });

  it("should return 404 if project does not exist", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });
    mockGet.mockResolvedValue({ exists: false }); // Project does not exist

    const req = mockRequest(
      { email: "test@test.com", role: "viewer" },
      "valid-token"
    );
    const response = await POST(req, { params: mockParams });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error).toBe("Project not found");
  });

  it("should return 403 if the inviting user is not an owner", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-editor" });
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({
        members: {
          "user-editor": { role: "editor" }, // User is an editor, not an owner
        },
      }),
    });

    const req = mockRequest(
      { email: "test@test.com", role: "viewer" },
      "valid-token"
    );
    const response = await POST(req, { params: mockParams });

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toContain("Forbidden");
  });

  it("should successfully create an invitation if user is an owner", async () => {
    const ownerId = "user-owner";
    const projectId = "proj123";
    const inviteData = {
      email: "new.user@example.com",
      role: "viewer",
    };

    mockAuth.verifyIdToken.mockResolvedValue({ uid: ownerId });

    // Mock project existence and owner membership
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ members: { [ownerId]: { role: "owner" } } }),
    });

    const req = mockRequest(inviteData, "valid-token");
    const response = await POST(req, { params: { projectId } });

    // Assertions
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(inviteData.email.toLowerCase());
    expect(body.role).toBe(inviteData.role);
    expect(body.invitedBy).toBe(ownerId);

    // Verify the correct Firestore calls were made
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockDoc).toHaveBeenCalledWith(projectId);
    const projectDocInstance = mockDoc.mock.results[0].value;
    expect(projectDocInstance.collection).toHaveBeenCalledWith("invitations");
    const invitationsCollectionInstance =
      projectDocInstance.collection.mock.results[0].value;
    expect(invitationsCollectionInstance.doc).toHaveBeenCalledWith(
      inviteData.email.toLowerCase()
    );
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        email: inviteData.email.toLowerCase(),
        role: inviteData.role,
        invitedBy: ownerId,
      })
    );
  });

  it("should return 500 on a server error", async () => {
    mockAuth.verifyIdToken.mockResolvedValue({ uid: "user-owner" });
    mockGet.mockRejectedValue(new Error("Database connection failed"));

    const req = mockRequest(
      { email: "test@test.com", role: "viewer" },
      "valid-token"
    );
    const response = await POST(req, { params: mockParams });

    expect(response.status).toBe(500);
  });
});
