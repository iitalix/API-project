// frontend/src/components/Navigation/index.js
import React from "react";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../images/luxbnb-horizontal.png"

function Navigation({isLoaded}) {
  const sessionUser = useSelector((state) => state.session.user);



  return (

    <>
      <nav className="header">
        <div>
          <NavLink exact to="/">
            <img src={logo} alt="logo image" id="logo"/>
          </NavLink>
        </div>
        <div>
          <div>
            {isLoaded && (
              <div>
                <ProfileButton user={sessionUser} />
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
