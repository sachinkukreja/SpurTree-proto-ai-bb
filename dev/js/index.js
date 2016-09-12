import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import allReducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import Products from './containers/product';
import ProductDetails from './containers/product-description'
import App from './components/app';
import Categories from './containers/Categories'

const loggerMiddleware = createLogger();

const store = createStore(allReducers, compose(applyMiddleware(thunkMiddleware, loggerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f));

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Categories}/>
                <Route path="/category/:query" component={Products}/>
                <Route path="/products/" component={Products}/>
                <Route path="/product-details/:productID" component={ProductDetails}></Route>
            </Route>
        </Router>

    </Provider>,
    document.getElementById('root')
);
