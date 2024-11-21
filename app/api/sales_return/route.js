import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all sales returns or search by invoice_no
export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const url = new URL(request.url);
    const invoiceNo = url.searchParams.get("invoice_no"); // Get 'invoice_no' from query params

    if (invoiceNo) {
      // Search for a specific sales return by invoice_no
      const salesReturn = await db
        .collection("sales_return")
        .findOne({ invoice_no: invoiceNo });
      if (salesReturn) {
        return NextResponse.json({ data: salesReturn }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Sales return not found with the provided invoice_no" },
          { status: 404 }
        );
      }
    } else {
      // Return all sales returns if no invoice_no is provided
      const salesReturns = await db.collection("sales_return").find().toArray();
      return NextResponse.json({ data: salesReturns }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sales returns" },
      { status: 500 }
    );
  }
}

// POST a new sales return
export async function POST(request) {
  try {
    const {
      invoice_no,
      returned_products, // Array of returned products with product_id, quantity, price, etc.
      date,
    } = await request.json();

    const db = await connectToDatabase();

    // Prepare the data for the sales return
    const returnData = {
      invoice_no,
      date,
      returned_products: returned_products.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        rate: product.rate,
        refund_amount: product.quantity * product.rate,
      })),
      createdAt: new Date(),
    };

    // Add the return data to the sales_return collection
    await db.collection("sales_return").insertOne(returnData);

    return NextResponse.json(
      { message: "Sales return processed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing sale return:", error);
    return NextResponse.json(
      { error: "Failed to process sale return" },
      { status: 500 }
    );
  }
}

// PUT (Update) a sales return
export async function PUT(request) {
  try {
    const { _id, invoice_no, returned_products, return_date } =
      await request.json();

    const db = await connectToDatabase();

    // Update the sales return record
    const updatedReturnData = {
      invoice_no,
      return_date,
      returned_products: returned_products.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        quantity: product.quantity,
        rate: product.rate,
        refund_amount: product.quantity * product.rate,
      })),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("sales_return")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updatedReturnData });

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Sales return updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Sales return not found or no changes made" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating sales return:", error);
    return NextResponse.json(
      { error: "Failed to update sales return" },
      { status: 500 }
    );
  }
}

// DELETE a sales return
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();

    const result = await db
      .collection("sales_return")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Sales return deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Sales return not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting sales return:", error);
    return NextResponse.json(
      { error: "Failed to delete sales return" },
      { status: 500 }
    );
  }
}
