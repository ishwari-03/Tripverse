export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler exploring the world",
    icon: "🧍",
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    desc: "Two travelers looking for a fun journey",
    icon: "👫",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "A small group or family trip",
    icon: "🗺️",
    people: "3-5",
  },
];

export const selectbudgetoptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balanced comfort and value",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium stay with top experiences",
    icon: "💎",
  },
];


export const AI_PROMPT = `
Generate a detailed travel plan for:

Location: {location}
Days: {days}
Travelers: {travelers}
Budget: {budget}

Return ONLY JSON with the following structure:

{
  "best_time_to_visit": "text",
  "total_estimated_cost": "text",
  "hotels": [
    {
      "hotel_name": "",
      "address": "",
      "price": "",
      "image_url": "",
      "rating": "",
      "geo_coordinates": [lat, lng]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "plan": [
        {
          "place_name": "",
          "details": "",
          "image_url": "",
          "ticket_price": "",
          "rating": "",
          "geo_coordinates": [lat, lng]
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- "hotels" MUST contain 4 hotel objects.
- Follow the exact JSON structure above.
- Do NOT return markdown.
- Do NOT wrap output in backticks.
`;

