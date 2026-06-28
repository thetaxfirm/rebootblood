import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response } from "express";

// Mock the collaborators the handler imports. We assert on auth-gating and that
// a successful cron request triggers the sync, without any network/DB.
vi.mock("../server/_core/sdk", () => ({
  sdk: { authenticateRequest: vi.fn() },
}));
vi.mock("../server/_core/linkartemis", () => ({
  syncLinkArtemis: vi.fn(),
}));
vi.mock("../server/db", () => ({
  upsertSyncedArticle: vi.fn(),
}));
vi.mock("../server/_core/audit", () => ({
  recordAudit: vi.fn().mockResolvedValue(undefined),
}));

import { sdk } from "../server/_core/sdk";
import { syncLinkArtemis } from "../server/_core/linkartemis";
import { recordAudit } from "../server/_core/audit";
import { syncLinkArtemisScheduledHandler } from "../server/_core/scheduled";

function mockRes() {
  const res = {} as Response & { _status: number; _json: unknown };
  res._status = 200;
  res.status = vi.fn((code: number) => {
    res._status = code;
    return res;
  }) as unknown as Response["status"];
  res.json = vi.fn((body: unknown) => {
    res._json = body;
    return res;
  }) as unknown as Response["json"];
  return res;
}

const baseReq = { headers: {}, body: {}, originalUrl: "/api/scheduled/syncLinkArtemis", socket: {} } as unknown as Request;

describe("syncLinkArtemisScheduledHandler", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.clearAllMocks());

  it("rejects requests that are not cron-authenticated (403)", async () => {
    (sdk.authenticateRequest as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "u1",
      isCron: false,
    });
    const res = mockRes();
    await syncLinkArtemisScheduledHandler(baseReq, res);
    expect(res._status).toBe(403);
    expect(syncLinkArtemis).not.toHaveBeenCalled();
  });

  it("rejects when authentication throws (403, no sync)", async () => {
    (sdk.authenticateRequest as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("bad token"));
    const res = mockRes();
    await syncLinkArtemisScheduledHandler(baseReq, res);
    expect(res._status).toBe(403);
    expect(syncLinkArtemis).not.toHaveBeenCalled();
  });

  it("runs the sync for a cron request and returns the summary", async () => {
    (sdk.authenticateRequest as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "owner",
      isCron: true,
      taskUid: "task_abc",
    });
    const summary = { fetched: 2, inserted: 1, updated: 1, skipped: 0, errors: [] };
    (syncLinkArtemis as ReturnType<typeof vi.fn>).mockResolvedValue(summary);
    const res = mockRes();
    await syncLinkArtemisScheduledHandler(baseReq, res);
    expect(syncLinkArtemis).toHaveBeenCalledTimes(1);
    expect(recordAudit).toHaveBeenCalledTimes(1);
    expect(res._status).toBe(200);
    expect(res._json).toMatchObject({ ok: true, summary });
  });

  it("returns a JSON-encoded 500 when the sync throws", async () => {
    (sdk.authenticateRequest as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "owner",
      isCron: true,
      taskUid: "task_abc",
    });
    (syncLinkArtemis as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("upstream down"));
    const res = mockRes();
    await syncLinkArtemisScheduledHandler(baseReq, res);
    expect(res._status).toBe(500);
    expect(res._json).toMatchObject({ error: "upstream down" });
  });
});
