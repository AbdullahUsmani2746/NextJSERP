import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all vendors
export async function GET() {
  try {
    const db = await connectToDatabase();
    const vendors = await db.collection('vendors').find().toArray();
    return NextResponse.json({ data: vendors }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

// POST a new vendor
export async function POST(request) {
  try {
    const { name, address, contact, email, organization } = await request.json();
    const db = await connectToDatabase();

          // Ensure organization_id is an object and not a string
          let orgIdObject = organization;

          // Check if organization_id was passed as a stringified object, and parse it if necessary
          if (typeof organization === 'string') {
            try {
              orgIdObject = JSON.parse(organization);
            } catch (error) {
              console.error('Error parsing organization_id:', error);
            }
          }
    const newVendor = {
      name,
      address,
      contact,
      email,
      organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
      organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
      createdAt: new Date(),
    };
    await db.collection('vendors').insertOne(newVendor);
    return NextResponse.json({ message: 'Vendor added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add vendor' }, { status: 500 });
  }
}

// PUT (Update) a vendor
export async function PUT(request) {
  try {
    const { _id, name, address, contact, email, organization } = await request.json();
    const db = await connectToDatabase();

          // Ensure organization_id is an object and not a string
          let orgIdObject = organization;

          // Check if organization_id was passed as a stringified object, and parse it if necessary
          if (typeof organization === 'string') {
            try {
              orgIdObject = JSON.parse(organization);
            } catch (error) {
              console.error('Error parsing organization_id:', error);
            }
          }
    await db.collection('vendors').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { 
        name, 
        address, contact, email,
        organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
        organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
        updatedAt: new Date() } }
    );
    return NextResponse.json({ message: 'Vendor updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

// DELETE a vendor
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection('vendors').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Vendor deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
