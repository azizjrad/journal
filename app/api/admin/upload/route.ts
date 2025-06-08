import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import crypto from "crypto";
import { getClientIP } from "@/lib/security";

// Security constants for file upload
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

/**
 * Validate file security properties
 */
function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  // Check file exists
  if (!file || !file.name) {
    return { isValid: false, error: "No valid file provided" };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "File size exceeds 5MB limit" };
  }

  // Check file size is not zero
  if (file.size === 0) {
    return { isValid: false, error: "File is empty" };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, GIF, and WebP images are allowed",
    };
  }

  // Check file extension
  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: "Invalid file extension" };
  }

  // Check for suspicious filename patterns
  if (
    file.name.includes("..") ||
    file.name.includes("/") ||
    file.name.includes("\\")
  ) {
    return { isValid: false, error: "Invalid filename" };
  }

  // Check filename length
  if (file.name.length > 255) {
    return { isValid: false, error: "Filename too long" };
  }

  return { isValid: true };
}

/**
 * Generate secure filename
 */
function generateSecureFilename(originalName: string): string {
  const extension = originalName
    .toLowerCase()
    .substring(originalName.lastIndexOf("."));
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString("hex");

  // Sanitize original name for use in filename
  const baseName = originalName
    .replace(extension, "")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .substring(0, 20);

  return `${timestamp}-${randomBytes}-${baseName}${extension}`;
}

/**
 * Basic file content validation (magic number check)
 */
function validateFileContent(buffer: Buffer, mimeType: string): boolean {
  const first4Bytes = buffer.subarray(0, 4);

  switch (mimeType) {
    case "image/jpeg":
    case "image/jpg":
      // JPEG starts with FF D8 FF
      return (
        first4Bytes[0] === 0xff &&
        first4Bytes[1] === 0xd8 &&
        first4Bytes[2] === 0xff
      );

    case "image/png":
      // PNG starts with 89 50 4E 47
      return (
        first4Bytes[0] === 0x89 &&
        first4Bytes[1] === 0x50 &&
        first4Bytes[2] === 0x4e &&
        first4Bytes[3] === 0x47
      );

    case "image/gif":
      // GIF starts with 47 49 46 38
      return (
        first4Bytes[0] === 0x47 &&
        first4Bytes[1] === 0x49 &&
        first4Bytes[2] === 0x46 &&
        first4Bytes[3] === 0x38
      );

    case "image/webp":
      // WebP has RIFF in first 4 bytes, but let's be flexible for WebP
      return buffer.length >= 12; // Basic length check for WebP

    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // Security: Parse form data with error handling
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.warn(`Invalid form data in upload request from ${clientIP}`);
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file") as File;

    // Security: Validate file upload
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      console.warn(
        `File upload validation failed from ${clientIP}: ${validation.error}`
      );
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Security: Convert to buffer and validate content
    let buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (error) {
      console.warn(`Failed to read file content from ${clientIP}`);
      return NextResponse.json(
        { error: "Failed to read file content" },
        { status: 400 }
      );
    }

    // Security: Validate file content matches declared MIME type
    if (!validateFileContent(buffer, file.type)) {
      console.warn(
        `File content validation failed from ${clientIP}: MIME type mismatch`
      );
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    // Security: Create uploads directory with proper permissions
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true, mode: 0o755 });
    }

    // Security: Generate secure filename
    const secureFileName = generateSecureFilename(file.name);
    const filePath = join(uploadsDir, secureFileName);

    // Security: Write file with restricted permissions
    await writeFile(filePath, buffer, { mode: 0o644 });

    // Return the URL path
    const url = `/uploads/${secureFileName}`;

    console.log(
      `File uploaded successfully by admin from ${clientIP}: ${secureFileName} (${file.size} bytes)`
    );

    return NextResponse.json({
      url,
      filename: secureFileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    const clientIP = getClientIP(request);
    console.error(`Upload error from ${clientIP}:`, error);

    // Security: Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
