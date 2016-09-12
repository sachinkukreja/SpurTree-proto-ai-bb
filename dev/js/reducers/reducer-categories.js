export default function (state = null, action) {
    switch (action.type) {
        case "CATEGORIES_FETCHED":
            return action.payload;
            break;

        default :
            return state;
            break;

    }
};