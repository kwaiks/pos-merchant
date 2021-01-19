/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import NotificationDropdown from "components/Dropdowns/StoreDropdown";
import UserDropdown from "components/Dropdowns/UserDropdown";
import { APP_NAME } from "config/appConfig";

export default function Sidebar() {
  const menu = [
    {
      groupName: "",
      menus: [
        {
          icon: "fa-tv",
          name: "Dashboard",
          url: "/dashboard"
        }
      ]
    },
    {
      groupName: "Store",
      menus: [
        {
          icon: "fa-store-alt",
          name: "Information",
          url: "/info"
        },
        {
          icon: "fa-photo-video",
          name: "Gallery",
          url: "/gallery"
        },
        {
          icon: "fa-star",
          name: "Inventory",
          url: "/inventory"
        }
      ]
    },
    {
      groupName: "Menu",
      menus: [
        {
          icon: "fa-scroll",
          name: "Items",
          url: "/menu"
        },
        {
          icon: "fa-tags",
          name: "Categories",
          url: "/category"
        }
      ]
    }
  ];
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap uppercase font-bold p-4 px-0"
            to="/"
          >
            {APP_NAME}
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    {APP_NAME}
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-3 py-2 h-12 border border-solid  border-gray-600 placeholder-gray-400 text-gray-700 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {
              menu.map((item) => (
                <div>
                  <hr className="my-4 md:min-w-full" />
                  <h6 className="md:min-w-full text-gray-600 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                    {item.groupName}
                  </h6>
                  <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                    {item.menus.map((child) => (
                      <li className="items-center">
                        <Link
                          className={
                            "text-xs uppercase py-3 font-bold block " +
                            (window.location.href.indexOf(child.url) !== -1
                              ? "text-blue-500 hover:text-blue-600"
                              : "text-gray-800 hover:text-gray-600")
                          }
                          to={child.url}
                        >
                          <i
                            className={
                              `fas ${child.icon} mr-2 text-sm
                              ${window.location.href.indexOf(child.url) !== -1
                                ? "opacity-75"
                                : "text-gray-400"}`
                            }
                          ></i>{" "}
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            }
          </div>
        </div>
      </nav>
    </>
  );
}
