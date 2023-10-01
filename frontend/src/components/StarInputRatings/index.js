import {useState} from "react";
import "./StarInputRatings.css"
import "../../index.css"

export default function StarInputRatings({rating, disabled, onChange}) {
  let [activeStarRating, setActiveStarRating] = useState(rating);

  return (
    <div className="star-container">
      <div className="star-input-container">
        <div
          className={activeStarRating >= 1 ? "filled" : "empty"}
          onMouseEnter={() => {
            if (!disabled) setActiveStarRating(1);
          }}
          onMouseLeave={() => {
            if (!disabled) setActiveStarRating(rating);
          }}
          onClick={() => {
            if (!disabled) onChange(1);
          }}
        >
          <i className="fa-solid fa-star"></i>
        </div>

        <div
          className={activeStarRating >= 2 ? "filled" : "empty"}
          onMouseEnter={() => {
            if (!disabled) setActiveStarRating(2);
          }}
          onMouseLeave={() => {
            if (!disabled) setActiveStarRating(rating);
          }}
          onClick={() => {
            if (!disabled) onChange(2);
          }}
        >
          <i className="fa-solid fa-star"></i>
        </div>

        <div
          className={activeStarRating >= 3 ? "filled" : "empty"}
          onMouseEnter={() => {
            if (!disabled) setActiveStarRating(3);
          }}
          onMouseLeave={() => {
            if (!disabled) setActiveStarRating(rating);
          }}
          onClick={() => {
            if (!disabled) onChange(3);
          }}
        >
          <i className="fa-solid fa-star"></i>
        </div>

        <div
          className={activeStarRating >= 4 ? "filled" : "empty"}
          onMouseEnter={() => {
            if (!disabled) setActiveStarRating(4);
          }}
          onMouseLeave={() => {
            if (!disabled) setActiveStarRating(rating);
          }}
          onClick={() => {
            if (!disabled) onChange(4);
          }}
        >
          <i className="fa-solid fa-star"></i>
        </div>

        <div
          className={activeStarRating >= 5 ? "filled" : "empty"}
          onMouseEnter={() => {
            if (!disabled) setActiveStarRating(5);
          }}
          onMouseLeave={() => {
            if (!disabled) setActiveStarRating(rating);
          }}
          onClick={() => {
            if (!disabled) onChange(5);
          }}
        >
          <i className="fa-solid fa-star"></i>
        </div>

        <div>Stars</div>
      </div>
    </div>
  );
}
