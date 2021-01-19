import { 
    ASYNC_END,
    ASYNC_START,
    LOAD_IMAGE,
    ADD_MEDIA,
    REMOVE_MEDIA
} from "store/constants/actionTypes";

const defaultState = {
    media: [],
    modalOpened: false,
}

export default function GalleryReducer(state = defaultState, action:any) {
    switch(action.type) {
        case ASYNC_START:
            return {...state, inProgress: true};
        case ASYNC_END:
            return {...state, inProgress: false };
        case LOAD_IMAGE:
            return {...state, media: action.payload};
        case ADD_MEDIA:
            return {
                ...state, 
                media: action.error ? state.media : [...state.media, action.payload],
                modalOpened: false
            };
        case REMOVE_MEDIA: 
            return {
                ...state,
                media: action.error ? state.media : state.media.filter((val:any) => Number(val.id) !== action.payload)
            }
        default:
            return state;
    }
}