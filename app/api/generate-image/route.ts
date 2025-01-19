import { NextResponse } from 'next/server';
import axios from 'axios';

const AUTOMATIC1111_API_URL = 'http://127.0.0.1:7860';

async function testEndpoint(url: string, description: string) {
    try {
        const response = await axios.get(url);
        console.log(`${description} Check:`, {
            status: response.status,
            url: url,
            data: response.data ? 'Data received' : 'No data'
        });
        return true;
    } catch (error) {
        if (error instanceof axios.AxiosError) {
            console.error(`${description} Error:`, {
                status: error.response?.status,
                message: error.message,
                url: url,
                response: error.response?.data
            });
        }
        return false;
    }
}

async function verifyAPIEndpoint() {
    try {
        // Test all relevant endpoints
        const endpoints = [
            { url: AUTOMATIC1111_API_URL, desc: 'Base API' },
            { url: `${AUTOMATIC1111_API_URL}/docs`, desc: 'Swagger UI' },
            { url: `${AUTOMATIC1111_API_URL}/sdapi/v1/sd-models`, desc: 'Models API' },
            { url: `${AUTOMATIC1111_API_URL}/sdapi/v1/samplers`, desc: 'Samplers API' },
            { url: `${AUTOMATIC1111_API_URL}/sdapi/v1/progress`, desc: 'Progress API' }
        ];

        console.log('Starting API endpoint verification...');
        
        for (const endpoint of endpoints) {
            await testEndpoint(endpoint.url, endpoint.desc);
        }

        // Test a simple txt2img request
        try {
            const testPayload = {
                prompt: "test",
                steps: 1,
                cfg_scale: 7,
                width: 64,
                height: 64,
                sampler_name: "Euler a"
            };

            console.log('Testing txt2img endpoint with minimal payload...');
            const testResponse = await axios.post(
                `${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`,
                testPayload,
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000
                }
            );
            console.log('txt2img test successful:', {
                status: testResponse.status,
                hasImages: testResponse.data?.images?.length > 0
            });
            return true;
        } catch (error) {
            if (error instanceof axios.AxiosError) {
                console.error('txt2img test failed:', {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data
                });
            }
            return false;
        }
    } catch (error) {
        console.error('API verification failed:', error);
        return false;
    }
}

export async function POST(req: Request) {
    try {
        // API'nin hazır olup olmadığını kontrol et
        const isAPIReady = await verifyAPIEndpoint();
        if (!isAPIReady) {
            return new NextResponse(JSON.stringify({
                success: false,
                error: 'AUTOMATIC1111 API is not properly configured. Please check the server logs.'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await req.json();
        console.log('Received request body:', body);

        const payload = {
            prompt: body.prompt,
            negative_prompt: body.negative_prompt || "",
            steps: body.steps || 20,
            cfg_scale: body.cfg_scale || 7,
            width: body.width || 512,
            height: body.height || 512,
            sampler_name: "Euler a",
            batch_size: 1,
            n_iter: 1,
            seed: -1,
            restore_faces: false,
            tiling: false,
            enable_hr: false,
            denoising_strength: 0.7,
            override_settings: {},
            override_settings_restore_afterwards: true,
            script_args: [],
            sampler_index: "Euler a"
        };

        console.log('Sending request to AUTOMATIC1111...');
        
        const response = await axios({
            method: 'post',
            url: `${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`,
            data: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 300000, // 5 dakika
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        if (response.data && response.data.images && response.data.images.length > 0) {
            console.log('Image generated successfully');
            return new NextResponse(JSON.stringify({
                success: true,
                image: response.data.images[0]
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.error('No images in response:', response.data);
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