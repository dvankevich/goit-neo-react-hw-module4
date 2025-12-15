import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query === "") {
      return;
    }
    const searchImages = async (query) => {
      try {
        const images = await fetchImages(query);
        return images;
      } catch (error) {
        console.error("Failed to retrieve images:", error);
      }
    };

    searchImages("grogu").then((images) => {
      console.log(images);
      setResults(images);
    });
  }, [query, page]);

  // for testing purposes
  useState(() => {
    console.log(results);
  }, [results]);

  const handleSearch = (searchTerm) => {
    setResults([]);
    setQuery(searchTerm);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
    </>
  );
}

export default App;
