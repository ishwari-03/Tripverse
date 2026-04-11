export const SelectTravelesList = [
  {
    id: 1,
    title: "Solo",
    desc: "A personalized experience for the lone adventurer",
    people: "1",
  },
  {
    id: 2,
    title: "Duo",
    desc: "A curated journey designed for two travelers",
    people: "2",
  },
  {
    id: 3,
    title: "Group",
    desc: "Coordinated travel for families or large teams",
    people: "3-5",
  },
];

export const selectbudgetoptions = [
  {
    id: 1,
    title: "Economy",
    desc: "Optimized for value and affordability",
  },
  {
    id: 2,
    title: "Standard",
    desc: "Balanced comfort with strategic spending",
  },
  {
    id: 3,
    title: "Premium",
    desc: "Elite experiences with high-end convenience",
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

