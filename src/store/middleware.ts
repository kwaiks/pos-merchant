import Cookies from 'universal-cookie';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  SET_STORE,
} from './constants/actionTypes';

const promiseMiddleware = (store:any) => (next:any) => (action:any) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      (res:any) => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      (error:any) => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        action.error = true;
        action.payload = error.message;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = (store:any) => (next:any) => (action:any) => {
  const cookie = new Cookies();
  if (action.type === LOGIN) {
    if (!action.error) {
      cookie.set("ATKN", action.payload.token, {
          path: "/"
      });
      console.log("mdLc",action.payload);
      window.localStorage.setItem("u_", JSON.stringify(action.payload.user));
      window.localStorage.setItem("s_", JSON.stringify(action.payload.stores));
    }
  } else if (action.type === LOGOUT) {
    cookie.remove("ATKN",{
        path:"/"
    });
    window.localStorage.removeItem("u_");
    window.localStorage.removeItem("s_");
    window.localStorage.removeItem("c_s_");
  } else if (action.type === SET_STORE) {
    console.log(action.payload);
    window.localStorage.setItem("c_s_", JSON.stringify(action.payload));
  }

  next(action);
};

function isPromise(v:any) {
  return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware }