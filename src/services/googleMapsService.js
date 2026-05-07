/**
 * Google Maps API Service
 * Replicates the Python script behavior using the Google Maps JavaScript API SDK.
 */

// We'll create a single instance wrapper for services to prevent recreating them
let geocoderInstance = null;
let placesServiceInstance = null;
let dummyDiv = null;

const getGeocoder = () => {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps script is not loaded yet');
  }
  if (!geocoderInstance) {
    geocoderInstance = new window.google.maps.Geocoder();
  }
  return geocoderInstance;
};

const getPlacesService = () => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    throw new Error('Google Maps Places Library is not loaded yet');
  }
  if (!placesServiceInstance) {
    // PlacesService needs a node if we don't have a map instance
    if (!dummyDiv) {
      dummyDiv = document.createElement('div');
    }
    placesServiceInstance = new window.google.maps.places.PlacesService(dummyDiv);
  }
  return placesServiceInstance;
};

/**
 * Main function bridging backend Python script into frontend JS.
 * 
 * @param {string} universityName - The name of the university to center search on
 * @param {string} genderType - 'both', 'girls', or 'boys'
 * @returns {Promise<Array>} Array of mapped hostal results
 */
export const getHostels = async (universityName, genderType = "both") => {
  try {
    const geocoder = getGeocoder();
    const placesService = getPlacesService();

    // Step A: Get University Coordinates
    console.log(`Searching for ${universityName}...`);
    
    const geocodePromise = new Promise((resolve, reject) => {
      geocoder.geocode({ address: universityName }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          resolve(results[0].geometry.location);
        } else {
          reject(`University not found (Status: ${status})`);
        }
      });
    });

    const location = await geocodePromise;
    console.log(`University Location: ${location.lat()}, ${location.lng()}`);

    // Step B: Search for Hostels Nearby
    let searchQuery = "private hostel";
    if (genderType === "girls" || genderType === "Girls") {
      searchQuery = "private girls hostel";
    } else if (genderType === "boys" || genderType === "Boys") {
      searchQuery = "private boys hostel";
    }

    console.log(`Finding ${searchQuery} near location...`);
    
    // Wrap nearbySearch in Promise
    const nearbyPromise = new Promise((resolve, reject) => {
      const request = {
        location: location,
        radius: 5000, // 5km
        keyword: searchQuery,
        type: 'lodging'
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === 'OK' || status === 'ZERO_RESULTS') {
          resolve(results || []);
        } else {
          reject(`Places API nearbySearch failed: ${status}`);
        }
      });
    });

    const nearbyResults = await nearbyPromise;

    // We cap to top 15 results to prevent excessive 'getDetails' rate limiting
    const limitedResults = nearbyResults.slice(0, 15);
    const hostels = [];

    // Step C: Get specific details for each hostel
    // We do this sequentially to avoid overwhelming rate limits (OVER_QUERY_LIMIT)
    for (const place of limitedResults) {
      const detailsPromise = new Promise((resolve) => {
        placesService.getDetails(
          {
            placeId: place.place_id,
            fields: ['name', 'formatted_phone_number', 'photos', 'rating', 'vicinity']
          },
          (res, status) => {
            if (status === 'OK' && res) {
              resolve(res);
            } else {
              // Gracefully handle partial detail failure
              resolve(place); // fallback to nearbySearch base data
            }
          }
        );
      });

      const details = await detailsPromise;
      
      // We parse the photos similarly to the python code's 'photo_reference'
      // But GMaps JS provides a helper function `getUrl`
      let photoUrl = 'https://via.placeholder.com/400x250?text=No+Image'; // Fallback
      if (details.photos && details.photos.length > 0) {
        photoUrl = details.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 });
      }

      hostels.push({
        id: place.place_id,
        name: details.name || place.name,
        address: details.vicinity || place.vicinity || 'No address provided',
        phone: details.formatted_phone_number || 'No number listed',
        rating: details.rating || 'N/A',
        image: photoUrl,
        coordinates: [place.geometry.location.lat(), place.geometry.location.lng()] // Using leaflet format [lat, lng]
      });

      // Small delay to prevent API flooding on Google side
      await new Promise(r => setTimeout(r, 150));
    }

    return { hostels, universityLocation: [location.lat(), location.lng()] };

  } catch (error) {
    console.error("Error fetching hostels from Google Maps:", error);
    throw error;
  }
};
