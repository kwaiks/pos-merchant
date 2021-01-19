import React from "react";

import UserDropdown from "components/Dropdowns/UserDropdown";
import NotificationDropdown from "components/Dropdowns/StoreDropdown";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-no-wrap md:justify-start flex items-center p-4">
        <div className="w-full mx-autp items-center flex justify-between md:flex-no-wrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="/"
            onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </a>
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <NotificationDropdown />
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
