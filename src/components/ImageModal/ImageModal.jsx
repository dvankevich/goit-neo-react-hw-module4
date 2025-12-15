import Modal from "react-modal";
import css from "./ImageModal.module.css";

Modal.setAppElement("#root");

const ImageModal = ({ isOpen, closeModal, img }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={css.Modal}
      overlayClassName={css.Overlay}
    >
      <h2 className={css.h2}>{img.alt_description}</h2>
      <div className={css.image}>
        <img
          className={css.img}
          src={img.urls.regular}
          alt={img.alt_description}
        />
      </div>
      <p>Likes: {img.likes}</p>
      <p>{img.description}</p>

      <p>Author name: {img.user.name}</p>
      {img.user.location && <p>location: {img.user.location}</p>}
      <p>total author photos: {img.user.total_photos}</p>

      {img.user.portfolio_url && (
        <a href={img.user.portfolio_url} target="_blank">
          Portfolio
        </a>
      )}
    </Modal>
  );
};

export default ImageModal;
