import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'; // Import WooCommerce API


// Initialize WooCommerce API 
const WooCommerce = new WooCommerceRestApi({
  url: 'https://royalblue-sparrow-140525.hostingersite.com/', // Your store URL
  consumerKey: process.env.WC_CONSUMER_KEY, // Your consumer key
  consumerSecret: process.env.WC_CONSUMER_SECRET, // Your consumer secret
  version: 'wc/v3', // WooCommerce WP REST API version
});
// Helper function to generate a unique barcode
function generateBarcode() {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp for time uniqueness
  const uniqueId = new ObjectId().toString().slice(-6); // Last 6 digits of MongoDB's ObjectId for global uniqueness
  return `${timestamp}${uniqueId}`; // Concatenating both for the barcode
}

// GET all products
export async function GET() {
    try {
      const db = await connectToDatabase();
      const products = await db.collection('products').find().toArray();

       // Fetch products from WooCommerce as well
    const wcProductsResponse = await WooCommerce.get("products");
    const wcProducts = wcProductsResponse.data;

      return NextResponse.json({ data: {products,wcProducts} }, { status: 200 });
      // return NextResponse.json({ data: products }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }
  
  // POST a new product
  export async function POST(request) {
    try {
      const { name, price, sku, product_category,product_category_id, brand,brand_id, unit,unit_id, organization,organization_id, reference,slug,weight,stock_alert,photo} = await request.json();
      const db = await connectToDatabase();
     
      // Generate a unique barcode for the product
      const barcode = generateBarcode();

      const newProduct = {
        name,
        price,
        sku,
        slug,
        weight,
        photo,
        reference,
        stock_alert,
        organization_id, 
        organization, 
        product_category_id, 
        product_category, 
        brand_id, 
        brand , 
        unit_id, 
        unit, 
        barcode, // Adding the barcode to the product
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
  