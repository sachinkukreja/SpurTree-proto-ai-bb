import fetch from 'isomorphic-fetch'
import {browserHistory} from 'react-router'


let chatlist = [];
let contextid = "";
let _selectedCategoryID = "";
let _selectedCategory = "";
let Color = "";
let ordinalDict = {
    first: 0,
    second: 1,
    third: 2,
    fourth: 3
};

export const FetchCategories = () => {

    return dispatch => {
        fetch(`https://api.bestbuy.com/v1/categories(id=abcat0*0000)?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&show=id,name&format=json`)
            .then(response => response.json())
            .then(json => dispatch(CategoriesReceived(json)))
    };
};


export const SendToLuis = (searchterm) => {
    console.log("Sending to Luis :", searchterm);
    return (dispatch) => {
        dispatch(ChatChanged(searchterm));
        dispatch(callLuisApi(searchterm));
    };
};

export const SetCategoryID = (categoryID) => {
    _selectedCategoryID = categoryID;
    return {
        type: 'Setter'
    }

}

export const FetchProductsForCategory = (categoryId, sort_order = '') => {
    return dispatch => fetch(`https://api.bestbuy.com/v1/products((categoryPath.id=${categoryId}))?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&format=json&sort=${sort_order}&show=name,salePrice,image,sku`)
        .then(response => response.json())
        .then(json => dispatch(UpdateProducts(json)));
}

export const FetchProducts = (search_query, sort_order = '') => {
    return dispatch => fetch(`https://api.bestbuy.com/v1/products(name=${search_query}*)?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&format=json&sort=${sort_order}`)
        .then(response => response.json())
        .then(json => dispatch(UpdateProducts(json)));
}

export const FetchProductsWithAttributes = (attributes, sort_order) => {

    let params = `&`;
    var Keys = Object.keys(attributes);
    Keys.map((key)=> {
        if (key != 'search' && key != 'sort') {
            params += `${key}=${attributes[key]}`
        }

    });

    return dispatch => fetch(`https://api.bestbuy.com/v1/products(name=${attributes.search}*${params})?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&format=json&sort=${sort_order}`)
        .then(response => response.json())
        .then(json => dispatch(UpdateProducts(json)));
}

function callLuisApi(searchterm) {
    console.log("calling Luis Api");

    searchterm = encodeURIComponent(searchterm);
    return dispatch =>fetch(`https://api.projectoxford.ai/luis/v1/application/preview?id=9ed7a7e3-cb6c-42a2-97ab-3a274be6b858&subscription-key=c71fa1b6442b4c73ae3a60abb7bc251b&q=${searchterm}&contextid=${contextid}`)
        .then(response => response.json())
        .then(json => dispatch(getTopScoringIntentandEntites(json)))


}

function getTopScoringIntentandEntites(json) {
    console.log("Got Top Scoring Intent", json);

    let topscoringIntent = json.topScoringIntent;
    let entities = json.entities;
    let dialog = json.dialog;
    return (dispatch)=> dispatch(callIntent(topscoringIntent, entities, dialog));

}

function callIntent(topscoringIntent, entites, dialog) {
    return (dispatch) => {
        switch (topscoringIntent.intent) {
            case 'SelectCategory':

                if (entites.length == 1) {
                    if (dialog.status != 'Finished') {
                        contextid = dialog.contextId;
                    } else {
                        contextid = "";
                    }

                    var firstEntityType = entites[0].type;
                    if (firstEntityType == "ProductCategory") {
                        _selectedCategory = entites[0].entity;
                        const path = `/category/${_selectedCategory}?id=${_selectedCategoryID}&sort=salePrice.dsc`;
                        browserHistory.push(path);
                        dispatch(ChatChanged(`Here are the Top Products for ${_selectedCategory}`));
                        dispatch(ChatChanged(dialog.prompt));
                    } else if (firstEntityType == "Color") {
                        Color = entites[0].entity;
                        fetch(`https://api.bestbuy.com/v1/products(color=${Color}&(categoryPath.id=${_selectedCategoryID}))?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&format=json&sort=salePrice.dsc&show=name,salePrice,image,sku`)
                            .then(response => response.json())
                            .then(json => dispatch(UpdateProducts(json)));
                        dispatch(ChatChanged(dialog.prompt));
                    }
                    else if (firstEntityType == "manufacturer") {
                        fetch(`https://api.bestbuy.com/v1/products(color=${Color}&manufacturer=${entites[0].entity}&(categoryPath.id=${_selectedCategoryID}))?apiKey=zscfhepsyaq2kpjpvna6jyvm&pageSize=20&format=json&sort=salePrice.dsc&show=name,salePrice,image,sku`)
                            .then(response => response.json())
                            .then(json => dispatch(UpdateProducts(json)));
                    }
                }

                break;

            case 'SearchProducts':

                if (dialog.status != 'Finished') {
                    contextid = dialog.contextId;
                } else {
                    contextid = "";
                }

                if (entites.length == 1) {
                    var firstEntityType = entites[0].type;
                    if (firstEntityType == "Product") {
                        var search_query = entites[0].entity;
                        const path = `/products/?search=${search_query}`;
                        browserHistory.push(path);
                        dispatch(ChatChanged(dialog.prompt));
                    } else if (firstEntityType == "Color") {
                        const path = location.pathname + location.search + `&color=${entites[0].entity}`;
                        browserHistory.push(path);
                        dispatch(ChatChanged(dialog.prompt));
                    }
                    else if (firstEntityType == "manufacturer") {
                        const path = location.pathname + location.search + `&manufacturer=${entites[0].entity}`;
                        browserHistory.push(path);
                    }
                } else if (entites.length > 1) {
                    let searchterm = '';
                    let params = ''


                    entites.map((entity)=> {
                        if (entity.type == 'Product') {
                            searchterm = entity.entity;
                        } else {
                            params += `&${entity.type}=${entity.entity}`
                        }

                    });
                    const path = `/products/?search=${searchterm}${params}`;
                    browserHistory.push(path);
                    dispatch(ChatChanged(dialog.prompt));

                }


                break;

            case 'SortProducts':

                break;
            case 'FilterProducts' :
                console.log('Filtering Products');
                break;
            case 'AddToCart':
                console.log('Adding To Cart');
                break;
            case 'ProductDetails':
                console.log('Showing Product Details');
                break;
        }
    }
}

export const UpdateProducts = (json) => {
    console.log("Number of products received", json.products.count);
    return {
        type: 'PRODUCTS_RECEIVED',
        payload: json.products
    }
};

export const CategoriesReceived = (json) => {
    console.log("CATEGORIES_FETCHED", json);
    return {
        type: 'CATEGORIES_FETCHED',
        payload: json
    }

};

export const ChatChanged = (chatItem) => {
    chatlist.push(chatItem);
    return {
        type: 'CHAT_CHANGED',
        payload: chatlist
    }
};

export const ClearContext = () => {
    contextid = "";
    return {
        type: 'CONTEXT_CLEARED'
    }
};