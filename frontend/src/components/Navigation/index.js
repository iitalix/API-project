// frontend/src/components/Navigation/index.js
import React from "react";
import {NavLink, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import "../../index.css"
import logo from "../../images/luxbnb-horizontal.png";

function Navigation({isLoaded}) {
  const { push } = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const goToCreateSpotForm = () => {

    push("/spots/new");
    return;
  };

  return (
    <div className="nav-container">
      <nav className="header">
        <div className="logo-container">
          <NavLink exact to="/">
            <img src={logo} alt="logo" id="logo" />
          </NavLink>
        </div>
        <div>
          <div>
            {isLoaded && (
              <div className="profile-menu-container">
                <div>
                  {sessionUser && (
                    <button id="create-spot-profile" onClick={() => goToCreateSpotForm()}>
                      Create a New Spot
                    </button>
                  )}
                </div>
                <div>
                  <ProfileButton user={sessionUser} />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
