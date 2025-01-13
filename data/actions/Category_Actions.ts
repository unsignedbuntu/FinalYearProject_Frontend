"use server"

import https from 'https';

export async function getCategories() {
  try {
    const response = await fetch("https://localhost:7296/CustomerFeedback", {
      cache: 'no-store',
      next: { revalidate: 0 },
      
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}