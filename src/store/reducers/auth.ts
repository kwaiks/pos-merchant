import {
    LOGIN,
    REGISTER,
    LOGIN_PAGE_UNLOADED,
    REGISTER_PAGE_UNLOADED,
    ASYNC_START
  } from '../constants/actionTypes';

export default function User(state = {}, action:any) {
    switch (action.type) {
      case LOGIN:
          //Workaround for not working switch route after login
        if (!action.error) {
            window.location.replace("/dashboard");
        }
        return {
            ...state,
            inProgress: false,
            errors: action.error ? action.payload : null,
            redirectTo: !action.error ? "/dashboard" : null,
        };
      case REGISTER:
        return {
          ...state,
          inProgress: false,
          errors: action.error ? action.payload.errors : null
        };
      case LOGIN_PAGE_UNLOADED:
      case REGISTER_PAGE_UNLOADED:
        return {};
      case ASYNC_START:
        if (action.subtype === LOGIN || action.subtype === REGISTER) {
          return { ...state, inProgress: true };
        }
        break;
      default:
        return state;
    }
  
    return state;
  };