import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
// GET all brands
export async function GET() {
    try {
      const db = await connectToDatabase();
      const brands = await db.collection('brands').find().toArray();
      return NextResponse.json({ data: brands }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
  }
  
  // POST a new brand
  export async function POST(request) {
    try {
      const {  name, description,photo, organization } = await request.json();
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
      const newBrand = {
        name,
        description,
        photo,
        organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
        organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
        createdAt: new Date(),
      };
      await db.collection('brands').insertOne(newBrand);
      return NextResponse.json({ message: 'Brand added successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add brand' }, { status: 500 });
    }
  }
  
  // PUT (Update) a brand
  export async function PUT(request) {
    try {
      const { _id, name, description,photo, organization } = await request.json();
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
      await db.collection('brands').updateOne(
        { _id: new ObjectId(_id) },
        { $set: { 
          name,
          description,
          photo,
          organization_id: orgIdObject.id, // Access the 'id' from the organization_id JSON object
          organization: orgIdObject.name, // Access the 'id' from the organization_id JSON object
           updatedAt: new Date() } }
      );
      return NextResponse.json({ message: 'Brand updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }
  }
  
  // DELETE a brand
  export async function DELETE(request) {
    try {
      const { id } = await request.json();
      const db = await connectToDatabase();
      await db.collection('brands').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Brand deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
    }
  }
  