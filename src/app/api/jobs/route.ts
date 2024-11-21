import { JobModel } from "@/models/Job";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET request handler for fetching job listings
export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string);

    // Extract search query parameters (if any)
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Fetch jobs from MongoDB
    const jobs = await JobModel.find({
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    })
      .limit(limit)
      .exec();

    // Return the list of jobs as a JSON response
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}



// import {JobModel} from "@/models/Job";
// import mongoose from "mongoose";
// import {NextRequest} from "next/server";

// export async function DELETE(req: NextRequest) {
//   const url = new URL(req.url);
//   const id = url.searchParams.get('id');
//   await mongoose.connect(process.env.MONGO_URI as string);
//   await JobModel.deleteOne({
//     _id: id,
//   });
//   return Response.json(true);
// }