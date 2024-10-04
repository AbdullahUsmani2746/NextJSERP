import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const organizations = await db.collection('organizations').find().toArray();
    return NextResponse.json({ data: organizations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, address, contact } = await request.json();
    const db = await connectToDatabase();
    console.log(db);
    const newOrganization = {
      name,
      address,
      contact,
      createdAt: new Date(),
    };
    
    await db.collection('organizations').insertOne(newOrganization);
    return NextResponse.json({ message: 'Organization added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add organization' }, { status: 500 });
  }
}
