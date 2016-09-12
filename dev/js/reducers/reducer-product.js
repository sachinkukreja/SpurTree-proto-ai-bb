export default  function (state = null, action) {
    switch (action.type) {

        case "PRODUCTS_RECEIVED":
            console.log("At reducer", action.payload);
            return action.payload
            break;

        default :
            return null;
            break;

    }

}