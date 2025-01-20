import { NextResponse } from 'next/server';
import axios from 'axios';

const AUTOMATIC1111_API_URL = 'http://127.0.0.1:7860';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received request body:', body);
        
        const payload = {
            prompt: body.prompt,
            negative_prompt: body.negative_prompt || "",
            steps: 15,
            cfg_scale: 7,
            width: 512,
            height: 512,
            sampler_name: "DPM 2M a",
            batch_size: 1,
            n_iter: 1,
            seed: -1
        };

        console.log('Sending request to AUTOMATIC1111...');
        
        const response = await axios({
            method: 'post',
            url: `${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`,
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 300000
        });

        if (response.data && response.data.images && response.data.images.length > 0) {
            return new NextResponse(JSON.stringify({
                success: true,
                image: response.data.images[0]
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new NextResponse(JSON.stringify({
            success: false,
            error: 'No image generated'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error details:', error instanceof axios.AxiosError ? {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        } : error);

        return new NextResponse(JSON.stringify({
            success: false,
            error: 'Failed to generate image',
            details: error instanceof axios.AxiosError ? {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            } : 'Unknown error'
        }), {
            status: error instanceof axios.AxiosError ? error.response?.status || 500 : 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}