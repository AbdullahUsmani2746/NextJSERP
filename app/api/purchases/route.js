import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all purchases or search by invoice_no
export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const url = new URL(request.url);
    const invoiceNo = url.searchParams.get("invoice_no"); // Get 'invoice_no' from query params

    if (invoiceNo) {
      // Search for a specific purchase by invoice_no
      const purchase = await db
        .collection("purchases")
        .findOne({ invoice_no: invoiceNo });
      if (purchase) {
        return NextResponse.json({ data: purchase }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Purchase not found with the provided invoice_no" },
          { status: 404 }
        );
      }
    } else {
      // Return all purchases if no invoice_no is provided
      const purchases = await db.collection("purchases").find().toArray();
      return NextResponse.json({ data: purchases }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}

// POST a new purchase
export async function POST(request) {
  try {
    const { invoice_no, vendor_id, date, products, total } =
      await request.json();

    const db = await connectToDatabase();

    const newPurchase = {
      invoice_no,
      vendor_id: new ObjectId(vendor_id),
      date,
      products: products.map((product) => ({
        ...product,
        product_id: new ObjectId(product.product_id),
      })),
      total,
      createdAt: new Date(), // Store the creation time
    };

    await db.collection("purchases").insertOne(newPurchase);
    return NextResponse.json(
      { message: "Purchase added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add purchase" },
      { status: 500 }
    );
  }
}

// PUT (Update) a purchase
export async function PUT(request) {
  try {
    const { _id, invoice_no, vendor_id, date, products, total } =
      await request.json();

    const db = await connectToDatabase();

    await db.collection("purchases").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          invoice_no,
          vendor_id: new ObjectId(vendor_id),
          date,
          products: products.map((product) => ({
            ...product,
            product_id: new ObjectId(product.product_id),
          })),
          total,
          updatedAt: new Date(), // Store the update time
        },
      }
    );

    return NextResponse.json(
      { message: "Purchase updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update purchase" },
      { status: 500 }
    );
  }
}

// DELETE a purchase
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection("purchases").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      { message: "Purchase deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}
