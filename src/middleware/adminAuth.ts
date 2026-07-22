import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { AppError } from "./errorHandler";

/**
 * Guard for admin-only endpoints (e.g. /health/deep, /health/metrics).
 * Requires the `x-admin-key` header to match ADMIN_API_KEY env var.
 * If ADMIN_API_KEY is not configured, the endpoint is blocked entirely.
 */
export function requireAdminApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { adminApiKey } = config;
  if (!adminApiKey) {
    next(new AppError("Admin endpoint not available", 503));
    return;
  }
  const provided = req.headers["x-admin-key"];
  if (typeof provided !== "string" || !timingSafeEqual(provided, adminApiKey)) {
    next(new AppError("Unauthorized", 401));
    return;
  }
  next();
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}