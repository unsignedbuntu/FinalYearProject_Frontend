import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/services/API_Service'; // Your configured Axios instance
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
  { params }: { params: { supplierId: string } }
) {
  const supplierId = params.supplierId;
  if (!supplierId || isNaN(parseInt(supplierId))) {
    return new NextResponse('Invalid supplier ID', { status: 400 });
  }

  // ASSUMPTION: Backend has an endpoint like /api/ImageServe/supplier/{supplierId}
  // If your C# backend endpoint for serving supplier images by ID is different,
  // please update this URL.
  const backendImageUrl = `${process.env.URL || 'https://localhost:7296'}/api/ImageServe/supplier/${supplierId}`;

  try {
    const response = await api.get(backendImageUrl, {
      responseType: 'arraybuffer',
    });

    if (response.status === 200 && response.data) {
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      const buffer = Buffer.from(response.data);
      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(buffer);
      readableStream.push(null);

      return new NextResponse(readableStream as any, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=600, s-maxage=600',
        },
      });
    } else {
      return new NextResponse(response.statusText || 'Failed to fetch image from backend', { status: response.status });
    }
  } catch (error: any) {
    console.error(`Error proxying image for supplierId ${supplierId}:`, error.message);
    if (error.response) {
      return new NextResponse(error.response.data || 'Backend error', { status: error.response.status });
    }
    return new NextResponse('Internal server error while proxying image', { status: 500 });
  }
} 