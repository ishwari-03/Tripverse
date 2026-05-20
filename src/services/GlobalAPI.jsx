import axios from "axios";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export const fetchUnsplashImage = async (query) => {
  try {
    const searchQuery = query ? query.split(',')[0] : "travel";
    const res = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: searchQuery,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`,
        },
      }
    );

    return res.data.results[0]?.urls?.regular || "/placeholder.jpg";
  } catch (err) {
    console.log("Unsplash Error:", err);
    return "/placeholder.jpg";
  }
};
