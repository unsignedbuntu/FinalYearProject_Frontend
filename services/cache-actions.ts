import axios from 'axios';
import https from 'https';

const API_URL = process.env.URL;

interface CacheResponse {
    cached: boolean;
    image?: string;
    error?: string;
}

interface CacheSaveResponse {
    success: boolean;
    error?: string;
}

export const getImageFromCache = async (pageId: string, prompt: string): Promise<CacheResponse> => {
    try {
        const response = await axios.get(`${API_URL}/api/ImageCache/${pageId}/${prompt}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        if (response.data && response.data.cached) {
            return {
                cached: true,
                image: response.data.image
            };
        }

        return { cached: false };
    } catch (error) {
        console.error('Error fetching from cache:', error);
        return {
            cached: false,
            error: error instanceof Error ? error.message : 'Failed to fetch from cache'
        };
    }
};

interface CreateCacheImageParams {
    pageID: string;
    prompt: string;
    image?: string;
}

export const createCacheImage = async ({ pageID, prompt, image }: CreateCacheImageParams): Promise<CacheSaveResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/ImageCache`, {
            pageID,
            prompt,
            image,
            status: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        if (response.data?.success) {
            return {
                success: true
            };
        }

        return {
            success: false,
            error: response.data?.error || 'Failed to cache image'
        };
    } catch (error) {
        console.error('Error caching image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to cache image'
        };
    }
}; 