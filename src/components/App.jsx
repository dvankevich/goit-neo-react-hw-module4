import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";
import ImageGallery from "./ImageGallery/ImageGallery.jsx";
import ImageModal from "./ImageModal/ImageModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imageModal, setImageModal] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (query === "") {
      return;
    }

    async function getImages() {
      try {
        setLoading(true);
        setError(false);
        setErrorMessage("");
        const apiResponse = await fetchImages(query, page);
        setResults((prevResults) => {
          return [...prevResults, ...apiResponse.results];
        });
        setTotalPages(apiResponse.total_pages);
      } catch (error) {
        setError(true);
        setErrorMessage(`Error occurred: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    getImages();
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

      {error && <ErrorMessage errorMsg={errorMessage} />}

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
