"use client";
import { useState, useEffect } from 'react';
import MapPage from './map';

// Define a type for the location object
interface Location {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Function to get user's location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }, (error) => {
          console.error('Error getting user location:', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Call the function to get user's location when the component mounts
    getUserLocation();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <main className="flex min-h-screen flex-col   bg-[#fefefe]">
      <h1 className="font-bold text-white">Welcome to My Restaurant Finder</h1>
      {userLocation && (
        <div className="bg-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Your Location:</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
      )}

      {!userLocation && (
        <p className="text-lg font-semibold text-gray-600">Getting your location...</p>
      )}
      <MapPage />
    </main>
  );
}
