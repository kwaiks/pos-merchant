import {
    APP_LOAD,
    REDIRECT,
    LOGOUT,
    LOGIN,
    REGISTER,
    LOGIN_PAGE_UNLOADED,
    REGISTER_PAGE_UNLOADED,
    SET_STORE,
    EDIT_STORE,
    ADD_MENU,
    EDIT_MENU,
    ADD_INVENTORY,
    EDIT_INVENTORY
  } from '../constants/actionTypes';
  
  const defaultState = {
    appLoaded: false,
    stores: [],
    appName: 'Mesan',
    token: null,
    currentStore: null,
    viewChangeCounter: 0,
  };
  
export default function CommonReducer(state = defaultState, action:any) {
    switch (action.type) {
      case APP_LOAD:
        return {
          ...state,
          token: action.token || null,
          appLoaded: true,
          currentUser: action.payload ? action.payload : null,
          stores: action.stores,
          currentStore: action.currentStore
        };
      case REDIRECT:
        return { ...state, redirectTo: null };
      case LOGOUT:
        return { ...state, redirectTo: '/login', token: null, currentUser: null };
      case LOGIN:
          return { ...state, redirectTo: action.error? null : '/dashboard'}
      case REGISTER:
        return {
          ...state,
          redirectTo: action.error ? null : '/',
          token: action.error ? null : action.payload.user.token,
          currentUser: action.error ? null : action.payload.user
        };
      case LOGIN_PAGE_UNLOADED:
      case REGISTER_PAGE_UNLOADED:
        return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
      case SET_STORE:
        return { ...state, currentStore: action.payload };
      case EDIT_STORE:
        return { ...state, redirectTo: action.error? null : "/dashboard" };
      case ADD_MENU:
        return { ...state, redirectTo: action.error? null : "/menu"};
      case EDIT_MENU:
        return { ...state, redirectTo: action.error? null : "/menu"}
      case ADD_INVENTORY:
        return { ...state, redirectTo: action.error? null : "/inventory"};
      case EDIT_INVENTORY:
        return { ...state, redirectTo: action.error? null : "/inventory"};
      default:
        return state;
    }
  };