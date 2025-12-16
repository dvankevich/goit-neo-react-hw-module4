import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";
import ImageGallery from "./ImageGallery/ImageGallery.jsx";
import ImageModal from "./ImageModal/ImageModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import Loader from "../Loader/Loader";
import LoadMoreBtn from "../LoadMoreBtn/LoadMoreBtn.jsx";
import toast from "react-hot-toast";

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
    if (searchTerm === query) return toast.error("Already requested..");
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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const isEmtpyResults = !loading && query && results.length === 0;

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {results.length > 0 && (
        <ImageGallery images={results} openModal={openModal} />
      )}
      {page < totalPages && <LoadMoreBtn handleLoadMore={handleLoadMore} />}
      {loading && <Loader />}
      {error && <ErrorMessage errorMsg={errorMessage} />}
      {isEmtpyResults && <p>No images found</p>}
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
