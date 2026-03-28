import { createHash } from 'crypto';
import Bytez from 'bytez.js';

type ImageProvider = 'bytez' | 'pollinations' | 'cloudflare';

type BytezModel = {
    run: (prompt: string) => Promise<{ error?: unknown; output?: unknown }>;
};

const BYTEZ_MODEL = process.env.BYTEZ_IMAGE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';
const CLOUDFLARE_MODEL =
    process.env.CLOUDFLARE_IMAGE_MODEL || '@cf/stabilityai/stable-diffusion-xl-base-1.0';
const DEFAULT_PROVIDER_ORDER = 'bytez,pollinations,cloudflare';

let cachedBytezModel: BytezModel | null = null;

function getCloudflareConfig() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    return { accountId, apiToken };
}

function getCloudinaryConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    return { cloudName, apiKey, apiSecret };
}

function hasRealCredential(value: string | undefined) {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    if (normalized.includes('your_')) return false;
    if (normalized.includes('replace_me')) return false;
    if (normalized.includes('example')) return false;

    return true;
}

function getBytezModel() {
    const key = process.env.BYTEZ_API_KEY;
    if (!key) {
        return null;
    }

    if (!cachedBytezModel) {
        const client = new Bytez(key);
        cachedBytezModel = client.model(BYTEZ_MODEL) as BytezModel;
    }

    return cachedBytezModel;
}

function getPollinationsBaseUrl() {
    return process.env.POLLINATIONS_BASE_URL || 'https://image.pollinations.ai/prompt';
}

function getPollinationsApiKey() {
    const key = process.env.POLLINATIONS_API_KEY;
    return hasRealCredential(key) ? key : undefined;
}

function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;

    try {
        return JSON.stringify(error);
    } catch {
        return 'Unknown error';
    }
}

function isHttpUrl(value: string) {
    return value.startsWith('https://') || value.startsWith('http://');
}

function parseMimeType(contentType: string | null) {
    if (!contentType) return 'image/png';
    return contentType.split(';')[0]?.trim() || 'image/png';
}

function normalizeImageString(value: string) {
    if (value.startsWith('data:') || isHttpUrl(value)) {
        return value;
    }

    return `data:image/png;base64,${value}`;
}

function parseDataUri(dataUri: string) {
    const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;

    const mimeType = match[1] || 'image/png';
    const base64Payload = match[2];
    return { mimeType, buffer: Buffer.from(base64Payload, 'base64') };
}

function parseProviderOrderValue(value: string): ImageProvider | null {
    if (value === 'bytez' || value === 'pollinations' || value === 'cloudflare') {
        return value;
    }

    return null;
}

function getProviderOrder() {
    const configured =
        process.env.IMAGE_PROVIDER_ORDER || process.env.IMAGE_GENERATOR_ORDER || DEFAULT_PROVIDER_ORDER;

    const uniqueProviders = new Set<ImageProvider>();
    const parsed = configured
        .split(',')
        .map((part) => part.trim().toLowerCase())
        .map(parseProviderOrderValue)
        .filter((provider): provider is ImageProvider => provider !== null);

    for (const provider of parsed) {
        uniqueProviders.add(provider);
    }

    if (uniqueProviders.size === 0) {
        uniqueProviders.add('pollinations');
    }

    return Array.from(uniqueProviders);
}

export function isBytezConfigured() {
    return Boolean(process.env.BYTEZ_API_KEY);
}

export function isCloudflareConfigured() {
    const { accountId, apiToken } = getCloudflareConfig();
    return Boolean(accountId && apiToken);
}

export function isCloudinaryConfigured() {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    return Boolean(
        hasRealCredential(cloudName) &&
        hasRealCredential(apiKey) &&
        hasRealCredential(apiSecret),
    );
}

export function isPollinationsEnabled() {
    return (process.env.POLLINATIONS_ENABLED || 'true').toLowerCase() !== 'false';
}

export function isImageGenerationConfigured() {
    return isBytezConfigured() || isCloudflareConfigured() || isPollinationsEnabled();
}

function buildCloudflareUrl(accountId: string) {
    return `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_MODEL}`;
}

function buildPollinationsUrl(prompt: string) {
    const base = getPollinationsBaseUrl().replace(/\/$/, '');
    const encodedPrompt = encodeURIComponent(prompt);
    const params = new URLSearchParams();

    const model = process.env.POLLINATIONS_MODEL;
    if (model) {
        params.set('model', model);
    }

    params.set('nologo', 'true');

    return `${base}/${encodedPrompt}?${params.toString()}`;
}

async function fetchImageBuffer(url: string, options?: { bearerToken?: string }) {
    const headers: Record<string, string> = {};
    if (options?.bearerToken) {
        headers.Authorization = `Bearer ${options.bearerToken}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Failed to fetch image (${response.status}): ${body}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = parseMimeType(response.headers.get('content-type'));

    return { buffer, mimeType };
}

async function generateWithBytez(prompt: string) {
    const model = getBytezModel();
    if (!model) {
        throw new Error('Bytez is not configured.');
    }

    const { error, output } = await model.run(prompt);
    if (error) {
        throw new Error(`Bytez API error: ${errorMessage(error)}`);
    }

    if (typeof output === 'string') {
        const normalized = normalizeImageString(output);
        if (isHttpUrl(normalized)) {
            try {
                const { buffer, mimeType } = await fetchImageBuffer(normalized);
                return createDataUri(buffer, mimeType);
            } catch (fetchError) {
                const bytezToken = process.env.BYTEZ_API_KEY;
                if (!bytezToken) throw fetchError;
                const { buffer, mimeType } = await fetchImageBuffer(normalized, { bearerToken: bytezToken });
                return createDataUri(buffer, mimeType);
            }
        }
        return normalized;
    }

    if (Array.isArray(output) && typeof output[0] === 'string') {
        const normalized = normalizeImageString(output[0]);
        if (isHttpUrl(normalized)) {
            try {
                const { buffer, mimeType } = await fetchImageBuffer(normalized);
                return createDataUri(buffer, mimeType);
            } catch (fetchError) {
                const bytezToken = process.env.BYTEZ_API_KEY;
                if (!bytezToken) throw fetchError;
                const { buffer, mimeType } = await fetchImageBuffer(normalized, { bearerToken: bytezToken });
                return createDataUri(buffer, mimeType);
            }
        }
        return normalized;
    }

    throw new Error('Bytez returned an unsupported image format.');
}

async function generateWithPollinations(prompt: string) {
    if (!isPollinationsEnabled()) {
        throw new Error('Pollinations is disabled by POLLINATIONS_ENABLED=false.');
    }

    const url = buildPollinationsUrl(prompt);
    const apiKey = getPollinationsApiKey();
    const { buffer, mimeType } = await fetchImageBuffer(
        url,
        apiKey ? { bearerToken: apiKey } : undefined,
    );
    return createDataUri(buffer, mimeType);
}

async function generateWithCloudflare(prompt: string) {
    const { accountId, apiToken } = getCloudflareConfig();
    if (!accountId || !apiToken) {
        throw new Error('Cloudflare image generation is not configured.');
    }

    const response = await fetch(buildCloudflareUrl(accountId), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudflare API error: ${response.status} ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    const mimeType = parseMimeType(contentType);

    // Most models return raw image bytes; JSON fallback is handled here.
    if (contentType?.includes('application/json')) {
        const data = (await response.json()) as { result?: { image?: string } };
        const imageBase64 = data?.result?.image;
        if (!imageBase64) {
            throw new Error('Cloudflare response did not include an image.');
        }

        return {
            buffer: Buffer.from(imageBase64, 'base64'),
            mimeType: 'image/png',
        };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return { buffer, mimeType };
}

function createDataUri(buffer: Buffer, mimeType: string) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

async function uploadToCloudinary(buffer: Buffer, mimeType: string, folder?: string) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary is not configured.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, string | number> = { timestamp };

    if (folder) {
        paramsToSign.folder = folder;
    }

    const signaturePayload =
        Object.entries(paramsToSign)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('&') + apiSecret;

    const signature = createHash('sha1').update(signaturePayload).digest('hex');

    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: mimeType }), 'generated-image.png');
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    if (folder) {
        formData.append('folder', folder);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const payload = (await response.json().catch(() => null)) as
        | { error?: { message?: string }; secure_url?: string }
        | null;

    if (!response.ok) {
        const message = payload?.error?.message || 'Cloudinary upload failed';
        throw new Error(`Cloudinary API error: ${message}`);
    }

    const secureUrl = payload?.secure_url;
    if (!secureUrl || typeof secureUrl !== 'string') {
        throw new Error('Cloudinary upload succeeded but no secure_url was returned.');
    }

    return secureUrl;
}

async function maybeUploadSourceImage(sourceUrl: string, folder?: string) {
    if (!isCloudinaryConfigured()) {
        return sourceUrl;
    }

    try {
        if (isHttpUrl(sourceUrl)) {
            const { buffer, mimeType } = await fetchImageBuffer(sourceUrl);
            return await uploadToCloudinary(buffer, mimeType, folder);
        }

        const parsedDataUri = parseDataUri(sourceUrl);
        if (parsedDataUri) {
            return await uploadToCloudinary(parsedDataUri.buffer, parsedDataUri.mimeType, folder);
        }
    } catch (error) {
        console.error('Cloudinary upload failed, returning original image source:', error);
    }

    return sourceUrl;
}

async function generateFromProvider(provider: ImageProvider, prompt: string, folder?: string) {
    if (provider === 'bytez') {
        const sourceUrl = await generateWithBytez(prompt);
        return maybeUploadSourceImage(sourceUrl, folder);
    }

    if (provider === 'pollinations') {
        const sourceUrl = await generateWithPollinations(prompt);
        return maybeUploadSourceImage(sourceUrl, folder);
    }

    const { buffer, mimeType } = await generateWithCloudflare(prompt);

    if (isCloudinaryConfigured()) {
        try {
            return await uploadToCloudinary(buffer, mimeType, folder);
        } catch (error) {
            console.error('Cloudinary upload failed, returning data URI fallback:', error);
        }
    }

    return createDataUri(buffer, mimeType);
}

export async function generateImageUrl(
    prompt: string,
    options: { folder?: string } = {},
) {
    const order = getProviderOrder();
    const errors: string[] = [];

    for (const provider of order) {
        try {
            return await generateFromProvider(provider, prompt, options.folder);
        } catch (error) {
            errors.push(`${provider}: ${errorMessage(error)}`);
        }
    }

    throw new Error(`All image providers failed. ${errors.join(' | ')}`);
}
