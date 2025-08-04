import { data, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { userId } = await request.json();

    if (!userId) {
      return data({ error: 'Missing userId' }, { status: 400 });
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is required');
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/unban`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to unban user: ${response.statusText}`);
    }
    
    return data({ success: true });
  } catch (error) {
    console.error('Error unbanning user:', error);
    return data({ error: 'Failed to unban user' }, { status: 500 });
  }
}