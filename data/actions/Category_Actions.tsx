export const getCategories = async () => {
  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.URL}/api/Categories`, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-store'
    });
    
    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }
    const data = await result.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}; 