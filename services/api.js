export const getUsers = async () => {

    try {
      const result = await fetch(`${process.env.URL}/api/Categories`, { method: 'GET' });
      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
      return await result.json();
    } catch (error) {
      console.error('Fetch error:', error.message);
      return [];
    }
  };