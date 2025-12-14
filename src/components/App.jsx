import "./App.css";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";

function App() {
  const searchImages = async (query) => {
    try {
      const images = await fetchImages(query);
      return images;
    } catch (error) {
      console.error("Failed to retrieve images:", error);
    }
  };

  // for testing purposes
  searchImages("grogu").then((images) => {
    console.log(images);
  });

  const handleSearch = (searchTerm) => {
    console.log("Search submitted with query:", searchTerm);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
    </>
  );
}

export default App;
