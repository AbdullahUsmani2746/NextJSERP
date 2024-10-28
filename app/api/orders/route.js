// import { NextResponse } from 'next/server';
// import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'; // Import WooCommerce API


// // Initialize WooCommerce API
// const WooCommerce = new WooCommerceRestApi({
//     url: 'https://royalblue-sparrow-140525.hostingersite.com/', // Your store URL
//     consumerKey: process.env.WC_CONSUMER_KEY, // Your consumer key
//     consumerSecret: process.env.WC_CONSUMER_SECRET, // Your consumer secret
//     version: 'wc/v3', // WooCommerce WP REST API version
//   });

// // GET all products
// export async function GET() {
//     try {
   

//        // Fetch products from WooCommerce as well
//     const wcOrdersResponse = await WooCommerce.get("orders");
//     const wcOrders = wcOrdersResponse.data;

//       return NextResponse.json({ data: wcOrders}, { status: 200 });
//     } catch (error) {
//       return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//     }
//   }

