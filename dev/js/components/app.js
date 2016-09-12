import React from 'react' ;
import BotInput from '../containers/botinput'
import ChatList from '../containers/chatlist'
import {bindActionCreators} from 'redux';
import {SelectProduct} from  '../actions/index';


require('../../scss/style.css');

export default React.createClass({

    render(){
        return (<div>
            <div className="right w-30 background-theme h-full fixed">
                <ChatList  />
                <BotInput className/>
                {console.log("AT APP!", this.props.location)}
            </div>
            <div className="left w-70">
                {this.props.children}
            </div>
        </div>);
    }
});

