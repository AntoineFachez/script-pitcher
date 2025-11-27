import { POST } from "./route";
import { getAdminServices } from "@/lib/firebase/firebase-admin";
import { NextResponse } from "next/server";

// Mock dependencies
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

// Mock FieldValue
jest.mock("firebase-admin/firestore", () => ({
  FieldValue: {
    serverTimestamp: jest.fn(() => "mock-timestamp"),
  },
}));

describe("POST /api/invitations/accept", () => {
  let mockDb,
    mockAuth,
    mockDoc,
    mockCollection,
    mockTransaction,
    mockRunTransaction,
    mockGet,
    mockVerifyIdToken;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Firestore mocks
    mockGet = jest.fn();

    // Transaction mock
    mockTransaction = {
      get: mockGet,
      update: jest.fn(),
      set: jest.fn(),
    };
    mockRunTransaction = jest.fn(async (callback) => {
      return await callback(mockTransaction);
    });

    // Stable mock objects for db.doc and db.collection
    const mockDocObj = {
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

    mockDb = {
      doc: mockDoc,
      collection: mockCollection,
      runTransaction: mockRunTransaction,
    };

    // Setup Auth mocks
    mockVerifyIdToken = jest.fn();
    mockAuth = {
      verifyIdToken: mockVerifyIdToken,
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

  it("should return 400 if missing parameters", async () => {
    const req = mockRequest({ projectId: "proj1" }, "valid-token"); // Missing token
    const response = await POST(req);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Missing parameters.");
  });

  it("should return 401 if unauthorized (no token)", async () => {
    const req = mockRequest({ projectId: "proj1", token: "inv-token" }, null);
    const response = await POST(req);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("should return 401 if token verification fails", async () => {
    mockVerifyIdToken.mockRejectedValue(new Error("Invalid token"));
    const req = mockRequest(
      { projectId: "proj1", token: "inv-token" },
      "invalid-token"
    );
    const response = await POST(req);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Authentication failed.");
  });

  it("should return 500 (Error) if project does not exist", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user1",
      email: "user@example.com",
    });

    // Mock transaction.get results
    // First call is projectRef, Second is invitationRef
    mockGet
      .mockResolvedValueOnce({ exists: false }) // Project
      .mockResolvedValueOnce({ exists: true }); // Invitation (irrelevant here)

    const req = mockRequest(
      { projectId: "proj1", token: "inv-token" },
      "valid-token"
    );
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Project does not exist.");
  });

  it("should return 500 (Error) if invitation does not exist", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user1",
      email: "user@example.com",
    });

    mockGet
      .mockResolvedValueOnce({ exists: true }) // Project
      .mockResolvedValueOnce({ exists: false }); // Invitation

    const req = mockRequest(
      { projectId: "proj1", token: "inv-token" },
      "valid-token"
    );
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Invitation not found or expired.");
  });

  it("should return 500 (Error) if invitation is already accepted", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user1",
      email: "user@example.com",
    });

    mockGet
      .mockResolvedValueOnce({ exists: true }) // Project
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ status: "accepted" }),
      }); // Invitation

    const req = mockRequest(
      { projectId: "proj1", token: "inv-token" },
      "valid-token"
    );
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Invitation already accepted.");
  });

  it("should return 500 (Error) if invitation is expired", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user1",
      email: "user@example.com",
    });

    const pastDate = { toMillis: () => Date.now() - 10000 };
    mockGet
      .mockResolvedValueOnce({ exists: true }) // Project
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ status: "pending", expiresAt: pastDate }),
      }); // Invitation

    const req = mockRequest(
      { projectId: "proj1", token: "inv-token" },
      "valid-token"
    );
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Invitation has expired.");
  });

  it("should successfully accept invitation", async () => {
    const userId = "user1";
    const userEmail = "user@example.com";
    const projectId = "proj1";
    const token = "inv-token";
    const role = "editor";

    mockVerifyIdToken.mockResolvedValue({ uid: userId, email: userEmail });

    const futureDate = { toMillis: () => Date.now() + 10000 };
    mockGet
      .mockResolvedValueOnce({ exists: true }) // Project
      .mockResolvedValueOnce({
        exists: true,
        data: () => ({ status: "pending", expiresAt: futureDate, role }),
      }); // Invitation

    const req = mockRequest({ projectId, token }, "valid-token");
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.projectId).toBe(projectId);

    // Verify Transaction Updates
    // 1. Update Invitation Status
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: token }), // Invitation Ref
      expect.objectContaining({
        status: "accepted",
        acceptedBy: userId,
      })
    );

    // 2. Add User to Project Members
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: projectId }), // Project Ref
      expect.objectContaining({
        [`members.${userId}`]: expect.objectContaining({
          role: role,
          email: userEmail,
        }),
      })
    );

    // 3. Add Project to User Summary
    expect(mockTransaction.set).toHaveBeenCalledWith(
      expect.objectContaining({ id: "summary" }), // User Summary Ref (mock id check)
      expect.objectContaining({
        projects: expect.objectContaining({
          [projectId]: expect.objectContaining({
            role: role,
          }),
        }),
      }),
      { merge: true }
    );

    // 4. Update Invitation Status in User Summary
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: "summary" }), // User Summary Ref
      expect.objectContaining({
        [`invitations.${token}.status`]: "accepted",
      })
    );
  });
});
