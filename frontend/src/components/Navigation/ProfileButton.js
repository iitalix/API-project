// frontend/src/components/Navigation/ProfileButton.js
import React, {useState, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "../../index.css"

function ProfileButton({user}) {
  const dispatch = useDispatch();
  const {push} = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    push("/");
  };

  const goToManage = () => {
    push("/current");
    return;
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-button-container">
      <button onClick={openMenu} className="profile-button">
        <div>
          <i className="fa-solid fa-bars"></i>
        </div>
        <div>
          <i className="fa-regular fa-user"></i>
        </div>
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="profile-container">
            <p>Hello, {user.username}</p>
            <p>{user.email}</p>
            <p id="manage-link" onClick={() => goToManage()}>Manage Spots</p>
            <div>
              <button onClick={logout} id="logout-button">Log Out</button>
            </div>
          </div>
        ) : (
          <div className="profile-container">
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
