import css from "./ImageGallery.module.css";
import ImageCard from "../ImageCard/ImageCard.jsx";

const ImageGallery = ({ images }) => {
  return (
    <ul className={css.imagesList}>
      {images.map((image) => (
        <li key={image.id} className={css.imagesListItem}>
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
