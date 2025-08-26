"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, DollarSign, Calendar } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDate("");
    setFile(null);
    setMessage("");
    const fileInput = document.getElementById("modal-file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !date || !file) {
      setMessage("Please fill in all fields and select a file");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // Step 1: Get presigned URL
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { key, url } = await uploadResponse.json();

      // Step 2: Upload file to S3
      const s3Response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!s3Response.ok) {
        throw new Error("Failed to upload file to S3");
      }

      // Step 3: Save metadata to database
      const s3Url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

      const billResponse = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount: Number.parseFloat(amount),
          date,
          s3Key: key,
          s3Url,
        }),
      });

      if (!billResponse.ok) {
        throw new Error("Failed to save bill metadata");
      }

      setMessage("Bill uploaded successfully!");

      // Close modal after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload bill. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload New Bill
          </DialogTitle>
          <DialogDescription>
            Upload your bill with details for easy tracking and organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title
            </Label>
            <Input
              id="modal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Electricity Bill - January 2024"
              required
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount
            </Label>
            <Input
              id="modal-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="modal-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-file">File (Image/PDF)</Label>
            <Input
              id="modal-file"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              disabled={isUploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF (Max 10MB)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Bill
                </>
              )}
            </Button>
          </div>

          {message && (
            <div
              className={`text-sm p-3 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
