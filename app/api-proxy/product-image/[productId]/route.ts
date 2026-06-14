import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/services/API_Service'; // Your configured Axios instance
import { Readable } from 'node:stream';

export async function GET(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  const { productId } =  context.params;

  if (!productId || Number.isNaN(Number.parseInt(productId))) {
    return new NextResponse('Invalid product ID', { status: 400 });
  }

  const backendImageUrl = `${process.env.NEXT_PUBLIC_URL || 'https://localhost:7296'}/api/ImageServe/${productId}`;

  try {
    // Use your 'api' axios instance which is configured to handle self-signed certs
    const response = await api.get(backendImageUrl, {
      responseType: 'arraybuffer', // Important for binary data like images
    });

    if (response.status === 200 && response.data) {
      const contentType = response.headers['content-type'] || 'image/jpeg'; // Default to jpeg if not specified

      const buffer = Buffer.from(response.data);

   // Yeni — tek seferde:
const readableStream = new Readable({
  read() {
    this.push(buffer);
    this.push(null); // stream sonu
  }
});

      return new NextResponse(readableStream as any, { // Cast to any to satisfy NextResponse type, stream is compatible
        status: 200,
        headers: {
          'Content-Type': String(contentType),
          'Cache-Control': 'public, max-age=600, s-maxage=600', // Cache for 10 minutes
        },
      });
    } else {
      return new NextResponse(response.statusText || 'Failed to fetch image from backend', { status: response.status });
    }
  } catch (error: any) {
    console.error(`Error proxying image for productId ${productId}:`, error.message);
    if (error.response) {
      return new NextResponse(error.response.data || 'Backend error', { status: error.response.status });
    }
    return new NextResponse('Internal server error while proxying image', { status: 500 });
  }
} 