import css from "./ErrorMessage.module.css";

const ErrorMessage = ({ errorMsg }) => {
  return (
    <div className={css.errorMsgContainer}>
      <h2>Whoops, something went wrong! Please try reloading this page!</h2>
      <p>{errorMsg}</p>
    </div>
  );
};

export default ErrorMessage;
