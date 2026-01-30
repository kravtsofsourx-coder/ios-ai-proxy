// This is your backend proxy function
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Get the image and prompt from your iOS app
      const { image, prompt } = req.body;
  
      if (!image || !prompt) {
        return res.status(400).json({ error: 'Missing image or prompt' });
      }
  
      // Call Replicate API
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "your-model-version-here", // You'll need to replace this
          input: {
            image: image,
            prompt: prompt,
          }
        })
      });
  
      const data = await response.json();
  
      // Return the result to your iOS app
      return res.status(200).json(data);
  
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }