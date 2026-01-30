// Backend proxy for Imagen-4
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the image and prompt from your iOS app
    const { image, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Prepare the input for Imagen-4
    const input = {
      prompt: prompt
    };

    // Add image if provided (for image-to-image generation)
    if (image) {
      input.image = image;
    }

    // Call Replicate API - NOTE: No version needed for Imagen-4
    const response = await fetch('https://api.replicate.com/v1/models/google/imagen-4/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input
      })
    });

    const data = await response.json();

    // Return the result to your iOS app
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
