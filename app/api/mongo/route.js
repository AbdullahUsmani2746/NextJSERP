import clientPromise from '../../../lib/mongodb'
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the client from our MongoDB helper
    const client = await clientPromise;
    const db = client.db('sample_mflix');
    const moviesCollection = db.collection('movies');

    // Fetch movies based on the query
    const query = {};  // Modify this if you need specific query params
    const movies = await moviesCollection.find(query).toArray();

    // Return the movies as a JSON response
    return NextResponse.json({ movies });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Unable to fetch movies' },
      { status: 500 }
    );
  }
}
