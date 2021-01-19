import React, {useEffect, useState} from "react";
import { createPopper } from "@popperjs/core";
import { store } from "store";
import { SET_STORE } from "store/constants/actionTypes";

const NotificationDropdown = () => {
  // dropdown props
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState<any>(null);
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef<HTMLAnchorElement>();
  const popoverDropdownRef = React.createRef<HTMLDivElement>();

  useEffect(()=>{
    setCurrentStore(store.getState().common.currentStore);
    setStores(store.getState().common.stores);
  },[])


  // Outside click
  useEffect(()=>{
      function handleClickOutside(event:any) {
          if(popoverDropdownRef.current){
              if (!popoverDropdownRef.current.contains(event.target) && !btnDropdownRef.current?.contains(event.target)) {
                setDropdownPopoverShow(false);
              }
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
  })

  const openDropdownPopover = () => {
    if (btnDropdownRef.current && popoverDropdownRef.current) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: "bottom-end",
      });
      setDropdownPopoverShow(true);
    }
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-white block py-1 px-3"
        href="#store"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        {currentStore !== null? currentStore.storeName : "SELECT STORE"}
        <i
            className="fas fa-caret-down ml-2 text-sm opacity-75"
          ></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={(dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48"
        }
      >
        {
          stores.length > 0 ? 
          stores && stores.map((item:any, i:number) => (
            <div
              key={i}
              className={
                "cursor-pointer hover:bg-gray-100 text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
              }
              onClick={() => {
                store.dispatch({type: SET_STORE, payload: item});
                setCurrentStore(item);
                closeDropdownPopover();
              }}
            >
              {item.storeName}
            </div>
          )):
          null
        }
      </div>
    </>
  );
};

export default NotificationDropdown;
