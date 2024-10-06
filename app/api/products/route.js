import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all products
export async function GET() {
    try {
      const db = await connectToDatabase();
      const products = await db.collection('products').find().toArray();
      return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }
  
  // POST a new product
  export async function POST(request) {
    try {
      const { name, price, sku, product_category, brand, unit, organization, reference,slug,weight,stock_alert,photo} = await request.json();
      const db = await connectToDatabase();
       // Ensure organization_id is an object and not a string
       let orgIdObject = organization;
       let catIdObject = product_category;
       let brandIdObject = brand;
       let unitdObject = unit;


       // Check if organization_id was passed as a stringified object, and parse it if necessary
       if (typeof organization === 'string') {
         try {
           orgIdObject = JSON.parse(organization);
           catIdObject = JSON.parse(product_category);
           brandIdObject = JSON.parse(brand);
           unitdObject = JSON.parse(unit);

         } catch (error) {
           console.error('Error parsing organization_id:', error);
         }
       }
      const newProduct = {
        name,
        price,
        sku,
        slug,
        weight,
        photo,
        reference,
        stock_alert,
        organization_id: orgIdObject.id, 
        organization: orgIdObject.name, 
        product_category_id: catIdObject.id, 
        product_category: catIdObject.name, 
        brand_id: brandIdObject.id, 
        brand: brandIdObject.name, 
        unit_id: unitdObject.id, 
        unit: unitdObject.name, 
        createdAt: new Date(),
      };
      await db.collection('products').insertOne(newProduct);
      return NextResponse.json({ message: 'Product added successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
  }
  
  // PUT (Update) a product
  export async function PUT(request) {
    try {
      const { id, product_name, price, sku, category_id, brand_id, unit_id } = await request.json();
      const db = await connectToDatabase();
      await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            product_name,
            price,
            sku,
            category_id: new ObjectId(category_id),
            brand_id: new ObjectId(brand_id),
            unit_id: new ObjectId(unit_id),
            updatedAt: new Date(),
          },
        }
      );
      return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
  }
  
  // DELETE a product
  export async function DELETE(request) {
    try {
      const { id } = await request.json();
      const db = await connectToDatabase();
      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
  }
  