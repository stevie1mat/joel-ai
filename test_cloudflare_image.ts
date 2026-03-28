import fs from 'fs';
import path from 'path';

async function testCloudflareImage() {
    // Manually parse .env.local to avoid 'dotenv' dependency
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('.env.local not found');
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').reduce((acc: any, line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            acc[key.trim()] = valueParts.join('=').trim();
        }
        return acc;
    }, {});

    const ACCOUNT_ID = envVars.CLOUDFLARE_ACCOUNT_ID;
    const API_TOKEN = envVars.CLOUDFLARE_API_TOKEN;

    if (!ACCOUNT_ID || !API_TOKEN) {
        console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in .env.local');
        return;
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;
    const prompt = "A dark fantasy knight in amber-lit armor, standing amidst swirling fog, highly detailed, cinematic lighting";

    console.log('Sending request to Cloudflare...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudflare API error: ${response.status} - ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const outputPath = path.join(process.cwd(), 'cloudflare_test.png');
        fs.writeFileSync(outputPath, buffer);
        
        console.log(`Success! Image saved to: ${outputPath}`);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCloudflareImage();
