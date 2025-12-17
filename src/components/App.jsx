import "./App.css";
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar/SearchBar.jsx";
import { fetchImages } from "../api/unsplash";
import ImageGallery from "./ImageGallery/ImageGallery.jsx";
import ImageModal from "./ImageModal/ImageModal";
import ErrorMessage from "./ErrorMessage/ErrorMessage.jsx";
import Loader from "./Loader/Loader.jsx";
import LoadMoreBtn from "./LoadMoreBtn/LoadMoreBtn.jsx";
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
  const appRef = useRef();

  useEffect(() => {
    if (query === "") {
      setResults([]);
      return;
    }

    async function getImages() {
      try {
        setLoading(true);
        setError(false);
        setErrorMessage("");

        const apiResponse = await fetchImages(query, page);
        // resolve the key duplication issue
        // Encountered two children with the same key, `7Coo7BwvxmQ`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.

        // setResults((prevResults) => {
        //   // 1. Беремо нові результати з API
        //   const newImages = apiResponse.results;
        //   // 2. Відфільтровуємо лише ті, ID яких ще немає у нашому стані
        //   const uniqueImages = newImages.filter(
        //     (newImg) => !prevResults.some((oldImg) => oldImg.id === newImg.id)
        //   );
        //   // 3. Додаємо лише унікальні фото до попереднього списку
        //   return [...prevResults, ...uniqueImages];
        // });
        setResults((prevResults) => {
          // 1. Беремо нові результати з API
          const newImages = apiResponse.results;

          // 2. Знаходимо дублікати
          const duplicates = newImages.filter((newImg) =>
            prevResults.some((oldImg) => oldImg.id === newImg.id)
          );

          // Виводимо дублікати у консоль
          if (duplicates.length > 0) {
            console.log("Дублікати знайдено:", duplicates);
          }

          // 3. Відфільтровуємо лише ті, ID яких ще немає у нашому стані
          // const uniqueImages = newImages.filter(
          //   (newImg) => !prevResults.some((oldImg) => oldImg.id === newImg.id)
          // );

          // 4. Додаємо лише унікальні фото до попереднього списку
          // return [...prevResults, ...uniqueImages];
          return [...prevResults, ...newImages];
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

  const handleSearch = (searchTerm) => {
    if (searchTerm === query) return toast.error("Already requested..");
    setResults([]);
    setQuery(searchTerm);
    setPage(1);
  };

  function openModal(img) {
    setImageModal(img);
    setImageModalIsOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setImageModal({});
    setImageModalIsOpen(false);
    document.body.style.overflow = "auto";
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page <= 1) return;
    // scroll to bottom of the app
    setTimeout(() => {
      appRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 250);
  }, [page, results]);

  const isEmtpyResults = !loading && query && results.length === 0;

  return (
    <div className="App" ref={appRef}>
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
    </div>
  );
}

export default App;
