"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Shield, ArrowRight } from "lucide-react";
import { UploadModal } from "@/components/upload-modal";

export default function HomePage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BillTracker</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Bill
              </Button>
              <Link href="/bills">
                <Button variant="outline">View Bills</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Secure • Fast • Reliable
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your Bills with
            <span className="text-blue-600 block">Complete Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            BillTracker is a comprehensive bill management system that helps you
            upload, organize, and track all your important documents in one
            secure location. Never lose a bill again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Your First Bill
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Bill Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines powerful features with an intuitive
              interface to make bill tracking effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Secure Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Upload bills, receipts, and invoices with military-grade
                  encryption. Support for images and PDF files up to 10MB.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Smart Organization</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Automatically organize your bills by date, amount, and
                  category. Search and filter through thousands of documents
                  instantly.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Cloud Storage</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Your documents are safely stored in the cloud with 99.9%
                  uptime guarantee. Access from anywhere, anytime.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Bill</h3>
              <p className="text-gray-600">
                Click the upload button and select your bill image or PDF file
                from your device.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Details</h3>
              <p className="text-gray-600">
                Fill in the bill title, amount, and date to help organize your
                documents.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Anytime</h3>
              <p className="text-gray-600">
                View, search, and manage all your bills from our organized
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who trust BillTracker to manage their
            important documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="h-5 w-5 mr-2" />
              Start Uploading Now
            </Button>
            <Link href="/bills">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent"
              >
                View All Bills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className=" text-center text-gray-400">
            <p>&copy; Made by Yogesh Rouniyar</p>
          </div>
        </div>
      </footer>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
