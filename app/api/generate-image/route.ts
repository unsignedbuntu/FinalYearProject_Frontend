import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import credentials from '../../../utils/credentials.json';

export async function POST(req: Request) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { prompt } = await req.json();
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const location = process.env.GOOGLE_CLOUD_LOCATION;

        if (!projectId || !location) {
            return new NextResponse(JSON.stringify({ error: 'Project ID or Location is not set' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const googleAuthOptions = {
            credentials: credentials,
        };

        const vertexAI = new VertexAI({ project: projectId, location: location, googleAuthOptions });

        const model = vertexAI.preview.getGenerativeModel({
            model: 'projects/ktun-final-year-project/locations/us-central1/models/gemini-pro-vision',
        });

        const requestContent = {
            contents: [{
                role: 'user' as const,
                parts: [{ text: prompt }]
            }],
            generation_config: {
                sampleCount: 1
            }
        };

        const response = await model.generateContent(requestContent);
        console.log('Raw response:', response);

        // Checking if response is a valid JSON string
        let responseString = '';
        try {
            responseString = JSON.stringify(response); // Convert to string to ensure it's valid JSON
            console.log('Response string:', responseString);
        } catch (stringifyError) {
            console.error('Error stringifying response:', stringifyError);
            return new NextResponse(JSON.stringify({ error: 'Failed to stringify response' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseString);
            console.log('Parsed response:', parsedResponse);
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            return new NextResponse(JSON.stringify({ error: 'Failed to parse response' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!parsedResponse || !parsedResponse.response || !parsedResponse.response.candidates || parsedResponse.response.candidates.length === 0) {
            return new NextResponse(JSON.stringify({ error: 'No response or valid candidates received' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (parsedResponse.response.candidates.length > 0) {
            const imageData = parsedResponse.response.candidates[0].content.parts[0].inlineData?.data;
            return new NextResponse(JSON.stringify({ image: imageData }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Error generating image:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to generate image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
