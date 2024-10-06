import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all users
export async function GET() {
  try {
    const db = await connectToDatabase();
    const users = await db.collection('users').find().toArray();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST a new user
export async function POST(request) {
  try {
    const { username, email, password, organization } = await request.json();
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
    const newUser = {
      username,
      email,
      password,
      organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
      organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
      createdAt: new Date(),
    };
    await db.collection('users').insertOne(newUser);
    return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

// PUT (Update) a user
export async function PUT(request) {
  try {
    const { _id, username, email, password, organization } = await request.json();
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
    await db.collection('users').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { 
        username, 
        email, password,
        organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
        organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
        updatedAt: new Date() } }
    );
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const db = await connectToDatabase();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
