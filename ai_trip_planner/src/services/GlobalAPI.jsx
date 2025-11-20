import axios from "axios";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export const fetchUnsplashImage = async (query) => {
  try {
    const res = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: query,
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
