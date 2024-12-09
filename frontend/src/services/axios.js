const baseURL = 'https://wallet-dapp-p0r3.onrender.com/';

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers, // Merge any additional headers passed in
      },
    });

    // Parse response as JSON if it's successful
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default request;
