import React from "react";

// components

import AdminNavbar from "components/Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import FooterAdmin from "components/Footers/FooterAdmin";

export default function Admin({children}:{children:any}) {
  return (
    <>
      <Sidebar />
      <div className="h-full relative md:ml-64 bg-gray-200">
        <AdminNavbar />
        <div className="relative bg-blue-600 md:pt-32 md:pb-24 pb-16 pt-12" />
        <div className="px-4 md:px-10 mx-auto w-full -m-24 bg-gray-200">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
