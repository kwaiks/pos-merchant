import { 
    ASYNC_START,
    LOAD_MENUS,
    LOAD_MENU,
    LOAD_CATEGORIES,
    ADD_CATEGORY,
    REMOVE_CATEGORY,
} from "store/constants/actionTypes";

const defaultState = {
    menus: [],
    currentMenu: {},
    categories: []
}

export default function MenuReducer(state = defaultState, action: any) {
    switch(action.type) {
        case ASYNC_START:
        case LOAD_MENUS:
            return {...state, menus: action.error? [] : action.payload};
        case LOAD_MENU:
            return {...state, currentMenu: action.payload};
        case LOAD_CATEGORIES:
            return {...state, categories: action.error ?[] : action.payload}
        case ADD_CATEGORY:
            return {...state, categories: action.error ? state.categories : [...state.categories, action.payload]}
        case REMOVE_CATEGORY:
            const newCat = state.categories.filter((item:any) => item.id !== action.payload);
            return {...state, categories: action.error ? state.categories : newCat}
        default:
            return state;
    }
}