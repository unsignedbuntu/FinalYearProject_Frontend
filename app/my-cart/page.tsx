"use client"
import { useEffect } from 'react'; // Import useEffect
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import Sidebar from '@/components/sidebar/Sidebar';
// ... other imports if needed ...

export default function MyCartPage() {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const { isAuthenticated, isLoading } = useAuth(); // Get auth state

  useEffect(() => {
    // Wait until loading is finished and then check authentication
    if (!isLoading && !isAuthenticated) {
      // Redirect to signin, preserving the intended destination
      router.push(`/signin?redirectedFrom=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]); // Add pathname to dependency array

  // Show loading state or nothing while checking auth
  if (isLoading || !isAuthenticated) {
    // Optionally, return a loading spinner or a minimal layout
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* You can add a loading spinner component here */}
        <p>Loading...</p>
      </div>
    );
    // Or just return null:
    // return null;
  }

  // --- Original Page Content Starts Here ---
  // This content will only render if authenticated
  return (
    <div className="min-h-screen pt-[40px] relative">
      <Sidebar />
      
      <div className="ml-[391px] mt-[87px]">
        {/* Main Content for My Cart */}
        <div className="w-[1000px] bg-white rounded-lg p-6">
          <h1 className="font-raleway text-[64px] font-normal text-center mb-8">
            My Cart
          </h1>
          {/* Add Cart specific content here */}
          <p>Your shopping cart is empty.</p> 
          {/* Example content */}
        </div>
      </div>
    </div>
  );
} 