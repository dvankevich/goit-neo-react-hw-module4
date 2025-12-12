import "./App.css";

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

  return (
    <>
      <h1>goit-neo-react-hw-module4</h1>
    </>
  );
}

export default App;
