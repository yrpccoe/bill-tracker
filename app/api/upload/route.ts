import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, fileType } = body

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName and fileType are required" }, { status: 400 })
    }

    // Validate file type (images and PDFs only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"]

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: "File type not allowed. Only images and PDFs are supported." }, { status: 400 })
    }

    // Generate unique key for S3
    const fileExtension = fileName.split(".").pop()
    const key = `bills/${uuidv4()}.${fileExtension}`

    // Create presigned URL for PUT operation
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour

    return NextResponse.json({
      key,
      url,
    })
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
  }
}
