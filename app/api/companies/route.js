import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all companies
export async function GET() {
  try {
    const db = await connectToDatabase();
    const companies = await db.collection('companies').find().toArray();
    return NextResponse.json({ data: companies }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

// POST a new company
export async function POST(request) {
  try {
    const { name, address, contact, email, organization,organization_id } = await request.json();
    const db = await connectToDatabase();

          
    const newCompany = {
      name,
      address,
      contact,
      email,
      organization_id, // Access the 'id' from the organization_id JSON object
      organization, // Access the 'id' from the organization_id JSON object
      createdAt: new Date(),
    };
    await db.collection('companies').insertOne(newCompany);
    return NextResponse.json({ message: 'Company added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add company' }, { status: 500 });
  }
}

// PUT (Update) a company
export async function PUT(request) {
  try {
    const { _id, name, address, contact, email, organization,organization_id } = await request.json();
    const db = await connectToDatabase();
          
    await db.collection('companies').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { name, address, contact, email, 
      organization_id, // Access the 'id' from the organization_id JSON object
      organization, // Access the 'id' from the organization_id JSON object
        updatedAt: new Date() } }
    );
    return NextResponse.json({ message: 'Company updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

// DELETE a company
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection('companies').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
