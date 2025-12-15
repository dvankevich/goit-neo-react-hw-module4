import css from "./ImageCard.module.css";

const ImageCard = ({ description, small }) => {
  return <img className={css.image} src={small} alt={description} />;
};

export default ImageCard;
