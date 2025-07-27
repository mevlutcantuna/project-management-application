import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll, beforeEach, vi } from "vitest";
import { server } from "./src/mocks/server";
import { cleanup } from "@testing-library/react";

// MSW server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Cleanup after each test
beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});
