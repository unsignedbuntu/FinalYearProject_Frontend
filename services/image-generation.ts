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

export const generateImage = async ({
    prompt,
    negative_prompt = "",
    width = 512,
    height = 512,
    steps = 20,
    cfg_scale = 7,
    sampler_name = "Euler a"
}: GenerationParams) => {
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

        const response = await axios.post('/api/generate-image', {
            prompt,
            negative_prompt,
            width,
            height,
            steps,
            cfg_scale,
            sampler_name
        });

        console.log('Response received:', response.status);

        if (response.data && response.data.success && response.data.image) {
            return {
                success: true,
                image: response.data.image
            };
        }

        const errorMessage = response.data?.error || 'No image generated';
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);

    } catch (error) {
        console.error('Error generating image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate image',
            details: error instanceof axios.AxiosError ? error.response?.data : null
        };
    }
};

// Prompt oluşturma yardımcı fonksiyonu
export const generatePrompt = (productName: string, description: string) => {
    const basePrompt = `${productName}, ${description}, professional product photography`;
    const stylePrompt = "high quality, detailed, 8k resolution, product showcase";
    const negativePrompt = "blur, noise, distortion, watermark, text, low quality";
    
    return {
        prompt: `${basePrompt}, ${stylePrompt}`,
        negative_prompt: negativePrompt
    };
}; 