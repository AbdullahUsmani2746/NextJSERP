import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all product categories
export async function GET() {
    try {
      const db = await connectToDatabase();
      const categories = await db.collection('product_categories').find().toArray();
      return NextResponse.json({ data: categories }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch product categories' }, { status: 500 });
    }
  }
  
  // POST a new product category
  export async function POST(request) {
    try {
      const { name, description, photo,organization,organization_id } = await request.json();
      const db = await connectToDatabase();


      const newCategory = {
        name,
        description,
        photo,
        organization_id, // Access the 'id' from the organization_id JSON object
        organization, // Access the 'id' from the organization_id JSON object
        createdAt: new Date(),
      };
      await db.collection('product_categories').insertOne(newCategory);
      return NextResponse.json({ message: 'Category added successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
  }
  
  // PUT (Update) a product category
  export async function PUT(request) {
    try {
      const { _id, name, description, organization,organization_id, photo } = await request.json();
      const db = await connectToDatabase();

          

      await db.collection('product_categories').updateOne(
        { _id: new ObjectId(_id) },
        { $set: { name, description, photo,
          organization_id, // Access the 'id' from the organization_id JSON object
          organization, // Access the 'id' from the organization_id JSON object
          updatedAt: new Date() } }
      );
      return NextResponse.json({ message: 'Category updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
  }
  
  // DELETE a product category
  export async function DELETE(request) {
    try {
      const { id } = await request.json();
      const db = await connectToDatabase();
      await db.collection('product_categories').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
  }
  