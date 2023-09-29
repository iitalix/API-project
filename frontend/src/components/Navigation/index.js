// frontend/src/components/Navigation/index.js
import React from "react";
import {NavLink, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import CreateSpotForm from "../CreateSpotForm";
import "./Navigation.css";
import logo from "../../images/luxbnb-horizontal.png";

function Navigation({isLoaded}) {
  const { push } = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const goToCreateSpotForm = () => {

    push("/spots/new");
    return;
  };

  return (
    <>
      <nav className="header">
        <div>
          <NavLink exact to="/">
            <img src={logo} alt="logo" id="logo" />
          </NavLink>
        </div>
        <div>
          <div>
            {isLoaded && (
              <>
                <div>
                  {sessionUser && (
                    <button onClick={() => goToCreateSpotForm()}>
                      Create a New Spot
                    </button>
                  )}
                </div>
                <div>
                  <ProfileButton user={sessionUser} />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
