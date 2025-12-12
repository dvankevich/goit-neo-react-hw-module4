import "./App.css";

import { fetchImages } from "../api/unsplash";

function App() {
  const searchImages = async (query) => {
    try {
      const images = await fetchImages(query);
      console.log(images);
    } catch (error) {
      console.error("Failed to retrieve images:", error);
    }
  };

  console.log(searchImages("grogu"));

  return (
    <>
      <h1>goit-neo-react-hw-module4</h1>
    </>
  );
}

export default App;
