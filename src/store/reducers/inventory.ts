import { 
    ASYNC_START,
    LOAD_INVENTORIES,
    LOAD_INVENTORY,
} from "store/constants/actionTypes";

const defaultState = {
    inventories: [],
    currentInv: {},
}

export default function InventoryReducer(state = defaultState, action: any) {
    switch(action.type) {
        case ASYNC_START:
        case LOAD_INVENTORIES:
            return {...state, inventories: action.error? [] : action.payload};
        case LOAD_INVENTORY:
            return {...state, currentInv: action.payload};
        default:
            return state;
    }
}