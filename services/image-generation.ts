import axios from 'axios';

interface GenerationParams {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    steps?: number;
    cfg_scale?: number;
    sampler_name?: string;
}

interface GenerationResponse {
    success: boolean;
    image?: string;
    error?: string;
    details?: any;
}

export const generateImage = async ({
    prompt,
    negative_prompt = "",
    width = 512,
    height = 512,
    steps = 15,
    cfg_scale = 7,
    sampler_name = "DPM++ 2M a"
}: GenerationParams): Promise<GenerationResponse> => {
    try {
        console.log('Generating image with params:', {
            prompt,
            negative_prompt,
            width,
            height,
            steps,
            cfg_scale,
            sampler_name
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 saniye timeout
        
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    negative_prompt,
                    width,
                    height,
                    steps,
                    cfg_scale,
                    sampler_name
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Response received:', response.status);

            if (data && data.success && data.image) {
                return {
                    success: true,
                    image: data.image
                };
            }

            const errorMessage = data?.error || 'No image generated';
            console.error('API Error:', errorMessage);
            throw new Error(errorMessage);
            
        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError') {
                console.error('Request timed out after 60 seconds');
                throw new Error('Request timed out after 60 seconds');
            }
            
            throw fetchError;
        }

    } catch (error) {
        console.error('Error generating image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate image',
            details: error instanceof Error ? error.stack : null
        };
    }
};

// Prompt oluşturma yardımcı fonksiyonu
export const generatePrompt = (productName: string, description: string) => {
    const basePrompt = `${productName}, ${description}, professional product photography`;
    const stylePrompt = "high quality, detailed, 4k resolution, product showcase";
    const negativePrompt = "blur, noise, distortion, watermark, text, low quality";
    
    return {
        prompt: `${basePrompt}, ${stylePrompt}`,
        negative_prompt: negativePrompt
    };
}; 