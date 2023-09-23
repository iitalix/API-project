// frontend/src/components/Navigation/ProfileButton.js

import React, {useState, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({user}) {
  const dispatch = useDispatch();
  const ulRef = useRef();

  // controls displaying of drop-down
  const [showMenu, setShowMenu] = useState(false); // menu is hidden

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

  // logout
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  // if the showMenu state variable is false,
  // apply className "hidden" to dropdown menu element
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  return (
    <>
      <button onClick={openMenu}>
        <i className="fa-solid fa-user"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
