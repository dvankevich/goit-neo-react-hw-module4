import css from "./ImageGallery.module.css";
import ImageCard from "../ImageCard/ImageCard.jsx";
//import { v4 as uuidv4 } from "uuid";

const ImageGallery = ({ images, openModal }) => {
  return (
    <ul className={css.imagesList}>
      {images.map((image) => (
        <li
          key={image.id}
          //key={`${image.id}-${image.created_at}`}
          //key={uuidv4()}
          className={css.imagesListItem}
          onClick={() => openModal(image)}
        >
          <ImageCard
            small={image.urls.small}
            description={image.alt_description}
          />
        </li>
      ))}
    </ul>
  );
};

export default ImageGallery;
