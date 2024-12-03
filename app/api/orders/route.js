import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all orders or search by invoice_no
export async function GET(request) {
  try {
    const db = await connectToDatabase();
    const url = new URL(request.url);
    const invoiceNo = url.searchParams.get("invoice_no"); // Get 'invoice_no' from query params

    if (invoiceNo) {
      // Search for a specific order by invoice_no
      const order = await db
        .collection("orders")
        .findOne({ invoice_no: invoiceNo });
      if (order) {
        return NextResponse.json({ data: order }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Order not found with the provided invoice_no" },
          { status: 404 }
        );
      }
    } else {
      // Return all orders if no invoice_no is provided
      const orders = await db.collection("orders").find().toArray();
      return NextResponse.json({ data: orders }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST a new order
export async function POST(request) {
  try {
    const {
      invoice_no,
      time,
      date,
      customer_name,
      customer_contact_no,
      products_purchased,
      quantity,
      rate,
      amount,
      total_amount,
      payment_method,
    } = await request.json();

    const db = await connectToDatabase();

    const newOrder = {
      invoice_no,
      time,
      date,
      customer_name,
      customer_contact_no,
      products_purchased,
      quantity,
      rate,
      amount,
      total_amount,
      payment_method,
      createdAt: new Date(), // Store the creation time
    };

    await db.collection("orders").insertOne(newOrder);
    return NextResponse.json(
      { message: "Order added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to add order" }, { status: 500 });
  }
}

// PUT (Update) an order
export async function PUT(request) {
  try {
    const {
      _id,
      invoice_no,
      time,
      date,
      customer_name,
      customer_contact_no,
      products_purchased,
      quantity,
      rate,
      amount,
      total_amount,
      payment_method,
    } = await request.json();
    const db = await connectToDatabase();

    await db.collection("orders").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          invoice_no,
          time,
          date,
          customer_name,
          customer_contact_no,
          products_purchased,
          quantity,
          rate,
          amount,
          total_amount,
          payment_method,
          updatedAt: new Date(), // Store the update time
        },
      }
    );

    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE an order
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
