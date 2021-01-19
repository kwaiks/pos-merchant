import { LOAD_FACILITIES, LOAD_STORE_CATEGORIES, LOAD_STORE } from "store/constants/actionTypes";

const defaultState = {
    facility: [],
    category: [],
    store: null
}

export default function StoreReducer(state = defaultState, action: any) {
    switch(action.type){
        case LOAD_STORE:
            return {...state, store: action.error ? null : action.payload}
        case LOAD_FACILITIES:
            return {...state, facility: action.error ? [] : action.payload}
        case LOAD_STORE_CATEGORIES:
            return {...state, category: action.error ? [] : action.payload}
        default:
            return state;
    }
}