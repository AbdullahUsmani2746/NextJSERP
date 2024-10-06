import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads/products');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// POST method for uploading files
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file'); // Ensure 'file' matches the input field name in your client-side form

        // Check if a file was uploaded
        if (!file || !file.size) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Create a unique filename to avoid conflicts
        const filename = `${Date.now()}_${file.name}`;
        const filePath = path.join(uploadDir, filename);

        // Save the file to the upload directory
        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        return NextResponse.json({ message: 'File uploaded successfully', filename: `/uploads/products/${filename}`  }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

// Optional: Handle GET requests (not typically used for uploads)
export async function GET() {
    return NextResponse.json({ message: "GET method not supported for file uploads." }, { status: 405 });
}
