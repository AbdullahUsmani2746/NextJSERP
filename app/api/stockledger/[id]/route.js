import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "bson";

// Update an existing stock ledger entry
export async function PUT(request) {
  try {
    // Extract the ID from the URL path
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Get the last part of the path, which is the ID

    const db = await connectToDatabase();
    const ledgerCollection = db.collection("stockledger");

    const updatedEntry = await request.json();
    const { _id, ...rest } = updatedEntry; // Destructure to exclude _id

    const result = await ledgerCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: rest }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No entry found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update stock ledger entry" },
      { status: 500 }
    );
  }
}

// DELETE a stock ledger entry
export async function DELETE(request) {
  try {
    // Extract the ID from the URL path
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Get the last part of the path, which is the ID

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ObjectId format" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const ledgerCollection = db.collection("stockledger");

    // Delete the entry using the ObjectId
    const result = await ledgerCollection.deleteOne({ _id: new ObjectId(id) });

    // Check if the deletion was successful
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: `No entry found to delete with ID: ${id}` },
        { status: 404 }
      );
    }

    // Successfully deleted
    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete stock ledger entry" },
      { status: 500 }
    );
  }
}
