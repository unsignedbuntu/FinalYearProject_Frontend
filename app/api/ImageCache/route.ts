import { NextResponse } from 'next/server';
import axios from 'axios';

const AUTOMATIC1111_API_URL = 'http://127.0.0.1:7860';
const API_URL = process.env.URL;

// GET /api/ImageCache - Get cached image by pageId and prompt
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageID = searchParams.get('pageID');
    console.log("PageID: ", pageID);
    const prompt = searchParams.get('prompt');
    console.log("Prompt: ", prompt);

    if (!pageID || !prompt) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get image from backend API
    const response = await axios.get(`${API_URL}/api/ImageCache/${pageID}`, {
      params: { prompt }
    });

    if (response.data && response.data.image) {
      return NextResponse.json({
        cached: true,
        image: response.data.image
      });
    }

    return NextResponse.json({ cached: false });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/ImageCache - Generate and cache new image
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageID, prompt, negative_prompt = '' } = body;

    if (!pageID || !prompt) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Generate image using AUTOMATIC1111
    const response = await axios.post(`${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`, {
      prompt: prompt,
      negative_prompt: negative_prompt,
      steps: 15,
      sampler_name: "DPM++ 2M a",
      width: 512,
      height: 512,
      cfg_scale: 7
    }, {
      timeout: 300000
    });

    const generatedImage = response.data.images[0];

    // Save to backend API
    await axios.post(`${API_URL}/api/ImageCache`, {
      pageID,
      prompt,
      negative_prompt,
      image: generatedImage
    });

    return NextResponse.json({
      success: true,
      image: generatedImage
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 