// frontend/src/components/LandingPage/index.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { thunkGetSpots } from '../../store/spots';

export default function LandingPage () {

    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.data);


    useEffect(() => {

        dispatch(thunkGetSpots())
    }, [])


    return (

        <ul>
            <h1>Hello Koyfacegirl! </h1>
            {spots.map((spot) => (


                <li>{spot.address}</li>
            ))}
        </ul>
    )
}
