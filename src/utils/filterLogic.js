export const filterHostels = (hostels, searchQuery, filters) => {
  return hostels.filter(hostel => {
    // Search query filter (by university name)
    let matchesSearch = true;
    if (searchQuery.trim() !== '' && hostel.nearestUniversities) {
      const query = searchQuery.toLowerCase();
      matchesSearch = hostel.nearestUniversities.some(uni => 
        uni.name.toLowerCase().includes(query)
      );
    }

    // Filters (Gender)
    let matchesGender = true;
    if (filters.gender && filters.gender !== 'All') {
      matchesGender = hostel.gender === filters.gender;
    }

    // Filters (Room Type)
    let matchesRoomType = true;
    if (filters.roomType && filters.roomType !== 'All' && hostel.roomType) {
      matchesRoomType = hostel.roomType === filters.roomType;
    }

    // Filters (Amenities)
    let matchesAmenities = true;
    if (filters.amenities && filters.amenities.length > 0 && hostel.amenities) {
      matchesAmenities = filters.amenities.every(amenity => 
        hostel.amenities.includes(amenity)
      );
    }

    return matchesSearch && matchesGender && matchesRoomType && matchesAmenities;
  });
};
