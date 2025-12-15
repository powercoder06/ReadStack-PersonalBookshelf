import "./Rating.scss";

const Rating = ({ rating = 0, onRatingChange, readonly = false, darkMode = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`rating ${darkMode ? "dark-mode" : ""}`}>
      <span className="rating-text">Rating:</span>
      <div className="rating-stars">
        {stars.map(star => (
          <span
            key={star}
            className={`star ${readonly ? "readonly" : ""}`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            style={{ color: star <= rating ? "#ffd700" : "#ddd" }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default Rating;
