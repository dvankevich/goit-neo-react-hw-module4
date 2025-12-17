import toast, { Toaster } from "react-hot-toast";
import css from "./SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const showToast = () =>
    toast.error("search text must be longer than 2 characters");

  const handleSubmit = (evt) => {
    const form = evt.target;
    const searchTerm = form.elements.searchTerm.value.trim();
    evt.preventDefault();
    if (searchTerm.length < 3) {
      showToast();
    } else {
      onSearch(searchTerm);
      form.reset();
    }
  };
  return (
    <header className={css.header}>
      <form onSubmit={handleSubmit}>
        <input
          className={css.input}
          type="text"
          name="searchTerm"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
        <button type="submit">Search</button>
      </form>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </header>
  );
};

export default SearchBar;
