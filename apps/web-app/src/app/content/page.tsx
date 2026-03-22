"use client";

import React, { useState } from "react";

export default function SecureImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Client-Side UX Validation (Matches our AWS strict policy)
    if (file.size > 512000) {
      setUploadStatus("File is too large. Maximum size is 500KB.");
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadStatus("Only image files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Requesting secure upload ticket...");

    try {
      // ==========================================
      // PHASE 1: Get the Pre-Signed URL from NestJS
      // ==========================================
      const contentEndpoint = process.env.NEXT_PUBLIC_CONTENT_API;
      if (!contentEndpoint) {
        throw new Error("Something went wrong");
      }
      const ticketResponse = await fetch(`${contentEndpoint}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: selectedFile.type }),
      });

      if (!ticketResponse.ok) throw new Error("Failed to get upload ticket");

      const ticketData = await ticketResponse.json();
      const { url, fields } = ticketData;

      // ==========================================
      // PHASE 2: Upload directly to AWS S3
      // ==========================================
      setUploadStatus("Uploading directly to secure vault...");

      const formData = new FormData();

      // CRITICAL: You MUST append all the signature fields FIRST
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // CRITICAL: The actual file MUST be appended LAST
      formData.append("file", selectedFile);

      const s3Response = await fetch(url, {
        method: "POST",
        body: formData,
        // Do NOT set the 'Content-Type' header manually here.
        // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
      });

      if (!s3Response.ok) {
        throw new Error(
          "S3 rejected the file. Policy violation or expired ticket.",
        );
      }

      // ==========================================
      // PHASE 3: Success & Sync (Optimized UX)
      // ==========================================
      setUploadStatus("Upload complete!");

      // Instantly create a local URL from the file the user already selected.
      // This saves an API call and makes the UI feel blazingly fast while
      // SQS and NestJS handle the actual database sync behind the scenes.
      const localPreviewUrl = URL.createObjectURL(selectedFile);
      setFinalImageUrl(localPreviewUrl);
    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadStatus(error.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">
        Profile Picture Upload
      </h2>

      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
      >
        {isUploading ? "Processing..." : "Upload Image"}
      </button>

      {uploadStatus && (
        <p
          className={`text-sm font-medium ${uploadStatus.includes("complete") ? "text-green-600" : "text-red-600"}`}
        >
          {uploadStatus}
        </p>
      )}

      {finalImageUrl && (
        <div className="mt-4 flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">
            Upload successful! Here is your preview:
          </p>
          <img
            src={finalImageUrl}
            alt="Uploaded file preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-gray-100 shadow-sm"
          />
        </div>
      )}
    </div>
  );
}
