import {combineReducers} from 'redux';
import ChatList from './reducer-chatlist';
import Products from './reducer-product';
import Categories from './reducer-categories';


const allReducers = combineReducers(
    {
        categories: Categories,
        products: Products,
        chat: ChatList,

    });

export default  allReducers;