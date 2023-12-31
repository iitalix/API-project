import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetailsPage from "./components/SpotDetailsPage";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpotForm from "./components/UpdateSpotForm";
import ReviewFormModal from "./components/ReviewFormModal";
import DeleteSpotModal from "./components/DeleteSpotModal";
import "./index.css"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path="/current">
            <ManageSpots />
          </Route>

          <Route exact path="/spots/new">
            <CreateSpotForm />
          </Route>

          <Route exact path="/spots/review/:spotId">
            <ReviewFormModal />
          </Route>

          <Route exact path="/spots/edit/:spotId">
            <UpdateSpotForm />
          </Route>

          <Route exact path="/spots/delete/:spotId">
            <DeleteSpotModal />
          </Route>

          <Route exact path="/spots/:spotId">
            <SpotDetailsPage />
          </Route>

          <Route exact path="/">
            <LandingPage />
          </Route>

      </Switch>}
    </>
  );
}

export default App;
