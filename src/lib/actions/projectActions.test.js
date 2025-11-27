import { toggleProjectPublishState, inviteUserAction } from "./projectActions";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { getCurrentUser } from "@/lib/auth/auth";

// Mock dependencies
jest.mock("@/lib/firebase/firebase-admin", () => ({
  getAdminServices: jest.fn(),
}));

jest.mock("@/lib/auth/auth", () => ({
  getCurrentUser: jest.fn(),
}));

// Mock FieldValue
jest.mock("firebase-admin/firestore", () => ({
  FieldValue: {
    serverTimestamp: jest.fn(() => "mock-timestamp"),
  },
}));

describe("projectActions", () => {
  let mockDb,
    mockAuth,
    mockDoc,
    mockCollection,
    mockBatch,
    mockGet,
    mockUpdate,
    mockSet,
    mockCommit,
    mockGetUserByEmail;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Firestore mocks
    mockGet = jest.fn();
    mockUpdate = jest.fn().mockResolvedValue();
    mockSet = jest.fn().mockResolvedValue();
    mockCommit = jest.fn().mockResolvedValue();

    // Stable mock objects
    const mockDocObj = {
      get: mockGet,
      update: mockUpdate,
      collection: jest.fn(), // Will be defined below
    };
    mockDoc = jest.fn((path) => ({
      ...mockDocObj,
      id: path ? path.split("/").pop() : "mock-id",
    }));

    const mockCollectionObj = {
      doc: mockDoc,
    };
    mockCollection = jest.fn(() => mockCollectionObj);

    // Circular reference for doc().collection()
    mockDocObj.collection = mockCollection;

    mockBatch = {
      set: mockSet,
      commit: mockCommit,
    };

    mockDb = {
      doc: mockDoc,
      collection: mockCollection,
      batch: jest.fn(() => mockBatch),
    };

    // Setup Auth mocks
    mockGetUserByEmail = jest.fn();
    mockAuth = {
      getUserByEmail: mockGetUserByEmail,
    };

    getAdminServices.mockReturnValue({ db: mockDb, auth: mockAuth });
  });

  describe("toggleProjectPublishState", () => {
    const projectId = "proj1";

    it("should return error if user is not logged in", async () => {
      getCurrentUser.mockResolvedValue(null);
      const result = await toggleProjectPublishState(projectId, true);
      expect(result.error).toBe("Unauthorized: User not logged in.");
    });

    it("should return error if project does not exist", async () => {
      getCurrentUser.mockResolvedValue({ uid: "user1" });
      mockGet.mockResolvedValue({ exists: false });

      const result = await toggleProjectPublishState(projectId, true);
      expect(result.error).toBe("Project not found.");
    });

    it("should return error if user is not an owner", async () => {
      getCurrentUser.mockResolvedValue({ uid: "user-viewer" });
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          members: { "user-viewer": { role: "viewer" } },
        }),
      });

      const result = await toggleProjectPublishState(projectId, true);
      expect(result.error).toContain("Forbidden");
    });

    it("should successfully update published state if user is owner", async () => {
      getCurrentUser.mockResolvedValue({ uid: "user-owner" });
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          members: { "user-owner": { role: "owner" } },
        }),
      });

      const result = await toggleProjectPublishState(projectId, true);

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith({
        published: true,
        updatedAt: "mock-timestamp",
      });
    });
  });

  describe("inviteUserAction", () => {
    const projectId = "proj1";
    const email = "invitee@example.com";
    const role = "editor";
    const userProfile = {
      displayName: "Inviter Name",
      email: "inviter@example.com",
    };

    it("should return error if user is not logged in", async () => {
      getCurrentUser.mockResolvedValue(null);
      const result = await inviteUserAction({
        projectId,
        email,
        role,
        userProfile,
      });
      expect(result.error).toBe("Unauthorized: User not logged in.");
    });

    it("should return error if project does not exist", async () => {
      getCurrentUser.mockResolvedValue({ uid: "user1" });
      mockGet.mockResolvedValue({ exists: false });

      const result = await inviteUserAction({
        projectId,
        email,
        role,
        userProfile,
      });
      expect(result.error).toBe("Project not found.");
    });

    it("should return error if user is not owner or editor", async () => {
      getCurrentUser.mockResolvedValue({ uid: "user-viewer" });
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          members: { "user-viewer": { role: "viewer" } },
        }),
      });

      const result = await inviteUserAction({
        projectId,
        email,
        role,
        userProfile,
      });
      expect(result.error).toContain("Forbidden");
    });

    it("should create invitation and update user summary if invited user exists", async () => {
      const inviterId = "user-owner";
      const invitedUserId = "invited-user-id";

      getCurrentUser.mockResolvedValue({ uid: inviterId });

      // Mock project existence and membership
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          members: { [inviterId]: { role: "owner" } },
        }),
      });

      // Mock invited user existence
      mockGetUserByEmail.mockResolvedValue({ uid: invitedUserId });

      const result = await inviteUserAction({
        projectId,
        email,
        role,
        userProfile,
      });

      expect(result.success).toBe(true);
      expect(result.invitationData).toBeDefined();

      // Verify batch operations
      // 1. Invitation doc created
      expect(mockBatch.set).toHaveBeenCalledWith(
        expect.anything(), // Invitation Ref
        expect.objectContaining({
          invitedEmail: email,
          role: role,
          invitedById: inviterId,
          status: "pending",
        })
      );

      // 2. User summary updated (badge)
      expect(mockBatch.set).toHaveBeenCalledWith(
        expect.objectContaining({ id: "summary" }), // User Summary Ref (mock id check)
        expect.objectContaining({
          invitations: expect.objectContaining({
            [result.invitationData.token]: expect.objectContaining({
              projectId: projectId,
              invitedByName: userProfile.displayName,
            }),
          }),
        }),
        { merge: true }
      );

      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it("should create invitation but SKIP user summary update if invited user does not exist", async () => {
      const inviterId = "user-owner";

      getCurrentUser.mockResolvedValue({ uid: inviterId });

      // Mock project existence and membership
      mockGet.mockResolvedValue({
        exists: true,
        data: () => ({
          members: { [inviterId]: { role: "owner" } },
        }),
      });

      // Mock invited user NOT found
      mockGetUserByEmail.mockResolvedValue(null);

      const result = await inviteUserAction({
        projectId,
        email,
        role,
        userProfile,
      });

      expect(result.success).toBe(true);

      // Verify batch operations
      // 1. Invitation doc created
      expect(mockBatch.set).toHaveBeenCalledTimes(1); // Only once for the invitation
      expect(mockBatch.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          invitedEmail: email,
        })
      );

      expect(mockBatch.commit).toHaveBeenCalled();
    });
  });
});
