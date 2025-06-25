import type { APIRoute } from "astro"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const ICONS_DIR = path.join(__dirname, '../../public/icons');
    
    const debugInfo = {
      __dirname,
      ICONS_DIR,
      iconsDirExists: false,
      iconsDirContents: [] as string[],
      error: null as string | null,
      cwd: process.cwd(),
      alternativePaths: {} as Record<string, boolean>
    };

    // Check if icons directory exists
    try {
      debugInfo.iconsDirExists = fs.existsSync(ICONS_DIR);
      if (debugInfo.iconsDirExists) {
        debugInfo.iconsDirContents = fs.readdirSync(ICONS_DIR);
      }
    } catch (error) {
      debugInfo.error = error instanceof Error ? error.message : 'Unknown error checking icons dir';
    }

    // Try alternative paths
    const alternativePaths = [
      path.join(process.cwd(), 'public/icons'),
      path.join(__dirname, '../../../public/icons'),
      path.join(__dirname, '../../../../public/icons'),
      './public/icons',
      '../public/icons',
      '../../public/icons'
    ];

    for (const altPath of alternativePaths) {
      try {
        debugInfo.alternativePaths[altPath] = fs.existsSync(altPath);
      } catch {
        debugInfo.alternativePaths[altPath] = false;
      }
    }

    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
} 