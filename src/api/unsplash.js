import axios from "axios";
//import mockImages from "./example.json";

const apiUrl = "https://api.unsplash.com/search/photos";
const apiKey = import.meta.env.VITE_API_KEY;

export const fetchImages = async (query, page = 1, perPage = 12) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        query,
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });
    console.log("Fetched images from Unsplash:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    throw error;
  }
};
