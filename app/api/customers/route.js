import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


// GET all customers
export async function GET() {
  try {
    const db = await connectToDatabase();
    const customers = await db.collection('customers').find().toArray();
    return NextResponse.json({ data: customers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST a new customer
export async function POST(request) {
  try {
    const { name, address, contact, email, organization,organization_id } = await request.json();
    const db = await connectToDatabase();
        
    const newCustomer = {
      name,
      address,
      contact,
      email,
      organization_id,
      organization,
      createdAt: new Date(),
    };
    await db.collection('customers').insertOne(newCustomer);
    return NextResponse.json({ message: 'Customer added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });
  }
}

// PUT (Update) a customer
export async function PUT(request) {
  try {
    const { _id, name, address, contact, email, organization,organization_id } = await request.json();
    const db = await connectToDatabase();
   
    await db.collection('customers').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { name, address, contact, email, 
        organization_id, // Access the 'id' from the organization_id JSON object
        organization, // Access the 'id' from the organization_id JSON object
        updatedAt: new Date() } }
    );
    return NextResponse.json({ message: 'Customer updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE a customer
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
