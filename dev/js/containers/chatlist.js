import React, {Component} from 'react' ;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ClearContext} from  '../actions/index';

class ChatList extends Component {

    clearContext() {
        this.props.ClearContext();
    }

    renderList() {
        if (this.props.chats !== null) {
            return this.props.chats.map(function (object, i) {
                return (
                    <li key={i}><p>{object}<span className="clearContext" onClick={()=> this.clearContext()}>x</span>
                    </p></li>);
            });
        }
    }
    
    render() {
        if (!this.props.chats || this.props.chats.length <= 0) {
            return (<div></div>)
        }

        return (
            <div className="chatlist">
                <ul>
                    {this.renderList()}
                </ul>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        chats: state.chat
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ClearContext: ClearContext}, dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(ChatList);
