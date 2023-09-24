import React from "react";
import "./SpotCard.css"

export default function SpotCard({spot}) {

    return (

        <div className="card-container">
            <div>
                <img src={`${spot.previewImage}`} alt="spot image" className="card-image"></img>
            </div>
            <div className="card-details">
                <div>
                    <div>{spot.city}, {spot.state}</div>
                    <div>{spot.avgRating}</div>
                </div>
                <div>{`$${spot.price}`}</div>
            </div>
        </div>
    )

}
