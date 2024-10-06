import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all organizations
export async function GET() {
  try {
    const db = await connectToDatabase();
    const organizations = await db.collection('organizations').find().toArray();
    console.log(organizations)
    return NextResponse.json({ data: organizations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organizationsss' }, { status: 500 });
  }
}

// POST a new organization
export async function POST(request) {
  try {
    const { name, address, contact, city, country, email } = await request.json();
    const db = await connectToDatabase();
    const newOrganization = {
      name,
      email,
      address,
      contact,
      city,
      country,
      createdAt: new Date(),
    };
    await db.collection('organizations').insertOne(newOrganization);
    return NextResponse.json({ message: 'Organization added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add organization' }, { status: 500 });
  }
}

// PUT (Update) an organization
export async function PUT(request) {
  try {
    const { _id, name, address, country, city , contact, email } = await request.json();
  
    const db = await connectToDatabase();
    console.log(_id)
    const result = await db.collection('organizations').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { 
        name,
        email,
        address,  
        contact,
        city,
        country,
         updatedAt: new Date() } }
    );
   
    return NextResponse.json({ message: 'Organization updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

// DELETE an organization
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    const db = await connectToDatabase();
    await db.collection('organizations').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Organization deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete organization ' }, { status: 500 });
  }
}
