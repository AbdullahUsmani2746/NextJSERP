import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// Fetch stock ledger entries
export async function GET() {
  try {
    const db = await connectToDatabase();
    const ledgerCollection = db.collection("stockledger");
    const entries = await ledgerCollection.find().toArray();

    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ledger entries" },
      { status: 500 }
    );
  }
}

// Add a new stock ledger entry
export async function POST(request) {
  try {
    const db = await connectToDatabase();
    console.log(db);

    const ledgerCollection = db.collection("stockledger");
    console.log(ledgerCollection);

    const newEntry = await request.json();

    // Insert the new entry
    const result = await ledgerCollection.insertOne(newEntry);
    console.log(newEntry);

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add stock ledger entry" },
      { status: 500 }
    );
  }
}


