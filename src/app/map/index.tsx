"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import markerImage from './marker.png'; // Adjust the import if necessary

const containerStyle = {
  width: '100%',
  height: '70vh', // Adjust height to 70% of the viewport height
};

const center = {
  lat: 33.603315,
  lng: 73.0033746,
};

type MarkerType = {
  position: google.maps.LatLngLiteral;
  name: string;
};

const MapPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      query: search,
      fields: ['name', 'geometry'],
    };

    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const newMarkers: MarkerType[] = results
          .filter(place => place.geometry && place.geometry.location && place.name)
          .map((place) => ({
            position: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
            },
            name: place.name!,
          }));
        setMarkers(newMarkers);
      }
    });
  };

  const handleLocateMe = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setMarkers([{ position: { lat: latitude, lng: longitude }, name: 'My Location' }]);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="map-container relative">
      <LoadScript googleMapsApiKey="AIzaSyDWNtFs8Gbg7w7uy82SlU4gzmjS6IErBLA" >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={marker.position} 
              title={marker.name}
            //   icon={markerImage} // Use the imported image
            />
          ))}
          {/* Marker for current location */}
          {currentLocation && (
            <Marker 
              position={currentLocation} 
              title="My Location"
              icon='./marker.png' // Use the imported image
            />
          )}
        </GoogleMap>
        <form
  onSubmit={handleSearchSubmit}
  className="min-w-[50%] search-form absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-2 rounded-10 shadow-lg flex items-center justify-center"
>
  <input
    type="text"
    value={search}
    onChange={handleSearchChange}
    placeholder="Find restaurants..."
    className="flex-1 p-2 border-none rounded-l-lg "
  />
  <button 
    type="button" 
    onClick={handleLocateMe}
    className="p-2 bg-green-500 text-white cursor-pointer mr-1"
  >
    📍
  </button>
  <button 
    type="submit" 
    className="p-2 bg-green-500 text-[#000000] rounded-r-lg cursor-pointer"
  >
    Find Restaurants
  </button>
</form>



      </LoadScript>
    </div>
  );
};

export default MapPage;
