import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all units
export async function GET() {
    try {
      const db = await connectToDatabase();
      const units = await db.collection('units').find().toArray();
      return NextResponse.json({ data: units }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
    }
  }
  
  // POST a new unit
  export async function POST(request) {
    try {
      const { name, symbol , organization,organization_id} = await request.json();
      const db = await connectToDatabase();

   

      const newUnit = {
        name,
        symbol,
        organization_id, // Access the 'id' from the organization_id JSON object
        organization, // Access the 'id' from the organization_id JSON object
        createdAt: new Date(),
      };

      await db.collection('units').insertOne(newUnit);
      return NextResponse.json({ message: 'Unit added successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add unit' }, { status: 500 });
    }
  }
  
  // PUT (Update) a unit
  export async function PUT(request) {
    try {
      const { _id, name, symbol, organization, organization_id } = await request.json();
      const db = await connectToDatabase();
   

      await db.collection('units').updateOne(
        { _id: new ObjectId(_id) },
        { $set: { 
          name,
          symbol,
          organization_id ,// Access the 'id' from the organization_id JSON object
          organization ,// Access the 'id' from the organization_id JSON object
          updatedAt: new Date()} }
      );
      return NextResponse.json({ message: 'Unit updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update unit' }, { status: 500 });
    }
  }
  
  // DELETE a unit
  export async function DELETE(request) {
    try {
      const { id } = await request.json();
      const db = await connectToDatabase();
      await db.collection('units').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Unit deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete unit' }, { status: 500 });
    }
  }
  