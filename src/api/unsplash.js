import axios from "axios";

const apiUrl = "https://api.unsplash.com/search/photos";
const apiKey = import.meta.env.VITE_API_KEY;

export const fetchImages = async (query, page = 1, perPage = 12) => {
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
  return response.data;
};
