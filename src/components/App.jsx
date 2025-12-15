import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";
import ImageGallery from "./ImageGallery/ImageGallery.jsx";
import ImageModal from "./ImageModal/ImageModal";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imageModal, setImageModal] = useState({});

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

  function openModal(img) {
    setImageModal(img);
    setImageModalIsOpen(true);
  }

  function closeModal() {
    setImageModal({});
    setImageModalIsOpen(false);
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {results.length > 0 && (
        <ImageGallery images={results} openModal={openModal} />
      )}

      {imageModalIsOpen && (
        <ImageModal
          isOpen={imageModalIsOpen}
          closeModal={closeModal}
          img={imageModal}
        />
      )}
    </>
  );
}

export default App;
