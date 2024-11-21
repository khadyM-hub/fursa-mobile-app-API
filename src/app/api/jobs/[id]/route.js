import { JobModel } from "@/models/Job";  // Ensure correct import for JobModel
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Extract job ID from params
    const { id } = params;  // This will be the job ID passed in the URL

    // Fetch the job by ID
    const job = await JobModel.findById(id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Return job details as JSON
    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json({ error: "Failed to fetch job details" }, { status: 500 });
  }
}
