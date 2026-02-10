import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[v0] Test API endpoint called');
  console.log('[v0] Method:', req.method);
  console.log('[v0] Headers:', req.headers);
  console.log('[v0] Body:', req.body);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Test API endpoint working!',
    timestamp: new Date().toISOString()
  });
}
