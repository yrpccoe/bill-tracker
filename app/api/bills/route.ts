import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bill from "@/models/Bill";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// GET /api/bills - List all bills with signed URLs
export async function GET() {
  try {
    await dbConnect();

    const bills = await Bill.find({}).sort({ createdAt: -1 });

    // Attach signed URL dynamically
    const billsWithUrls = await Promise.all(
      bills.map(async (bill) => {
        let signedUrl = "";
        try {
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: bill.s3Key,
          });
          signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
        } catch (err) {
          console.error("Error generating signed URL:", err);
        }

        return {
          ...bill.toObject(),
          s3Url: signedUrl, // overwrite with signed URL
        };
      })
    );

    return NextResponse.json({ bills: billsWithUrls });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

// POST /api/bills - Save a new bill
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, amount, date, s3Key } = body;

    if (!title || !amount || !date || !s3Key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const bill = new Bill({
      title,
      amount: amountNum,
      date,
      s3Key,
    });

    await bill.save();

    return NextResponse.json(
      { message: "Bill saved successfully", bill },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving bill:", error);
    return NextResponse.json({ error: "Failed to save bill" }, { status: 500 });
  }
}
