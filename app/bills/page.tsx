"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, ArrowLeft, Search, Calendar, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Bill {
  _id: string
  title: string
  amount: number
  date: string
  s3Key: string
  s3Url: string
  createdAt: string
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await fetch("/api/bills")
      if (!response.ok) {
        throw new Error("Failed to fetch bills")
      }
      const data = await response.json()
      setBills(data.bills)
    } catch (error) {
      console.error("Error fetching bills:", error)
      setError("Failed to load bills. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredBills = bills.filter((bill) => bill.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const thisMonthBills = bills.filter((bill) => {
    const billDate = new Date(bill.date)
    const now = new Date()
    return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear()
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">BillTracker</h1>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-lg text-gray-600">Loading your bills...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">BillTracker</h1>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <Button onClick={fetchBills} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">BillTracker</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Bill
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              {bills.length} Bills • {formatCurrency(totalAmount)} Total
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Bills Dashboard</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all your uploaded bills in one organized location.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bills</p>
                    <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-gray-900">{thisMonthBills.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">All Bills</CardTitle>
                  <CardDescription className="text-base">View and manage your uploaded bills</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Link href="/upload">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Bill
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredBills.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-600 mb-2">
                    {searchTerm ? "No bills match your search" : "No bills uploaded yet"}
                  </p>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? "Try adjusting your search terms" : "Upload your first bill to get started"}
                  </p>
                  <Link href="/upload">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First Bill
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Uploaded</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills.map((bill) => (
                        <TableRow key={bill._id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-gray-900">{bill.title}</TableCell>
                          <TableCell className="font-semibold text-green-600">{formatCurrency(bill.amount)}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(bill.date)}</TableCell>
                          <TableCell className="text-gray-500">{formatDate(bill.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                            >
                              <a href={bill.s3Url} target="_blank" rel="noopener noreferrer">
                                View File
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
