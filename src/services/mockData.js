export const MOCK_TRIP_DATA = (location, days, travelers, budget) => {
  return {
    "best_time_to_visit": "October to June",
    "total_estimated_cost": "INR 25,000 - 40,000",
    "hotels": [
      {
        "hotel_name": "Snow Valley Resorts",
        "address": "Log Huts Area, Manali",
        "price": "INR 5,500/night",
        "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
        "rating": "4.5",
        "geo_coordinates": [32.2475, 77.1892]
      },
      {
        "hotel_name": "The Himalayan",
        "address": "Hadimba Road, Manali",
        "price": "INR 12,000/night",
        "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "rating": "4.8",
        "geo_coordinates": [32.2464, 77.1843]
      },
      {
        "hotel_name": "Apple Country Resorts",
        "address": "Log Huts Area, Manali",
        "price": "INR 6,500/night",
        "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "rating": "4.2",
        "geo_coordinates": [32.2501, 77.1905]
      },
      {
        "hotel_name": "Span Resort and Spa",
        "address": "Kullu-Manali Highway",
        "price": "INR 15,000/night",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "rating": "4.9",
        "geo_coordinates": [32.1235, 77.1524]
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "plan": [
          {
            "place_name": "Hadimba Devi Temple",
            "details": "An ancient cave temple dedicated to Hidimbi Devi, surrounded by cedar forests.",
            "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
            "ticket_price": "Free",
            "rating": "4.6",
            "geo_coordinates": [32.2461, 77.1834]
          },
          {
            "place_name": "Mall Road",
            "details": "The main street of Manali, perfect for shopping and local street food.",
            "image_url": "https://images.unsplash.com/photo-1605649440416-cc6e94556a6d",
            "ticket_price": "Free",
            "rating": "4.4",
            "geo_coordinates": [32.2396, 77.1887]
          }
        ]
      },
      {
        "day": 2,
        "plan": [
          {
            "place_name": "Solang Valley",
            "details": "Famous for adventure sports like paragliding and zorbing.",
            "image_url": "https://images.unsplash.com/photo-1621508654686-809f23efdaba",
            "ticket_price": "Variable",
            "rating": "4.7",
            "geo_coordinates": [32.3168, 77.1554]
          }
        ]
      }
    ]
  };
};
