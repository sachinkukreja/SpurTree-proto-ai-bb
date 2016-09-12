import React, {Component} from 'react' ;
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {SendToLuis, ChatChanged} from '../actions/index';


class BotInput extends Component {

    handleClick(e) {
        // Explicitly focus the text input using the raw DOM API.
        e.preventDefault();
        if (this._input !== null) {

            this.props.SendToLuis(this._input.value);
            this._input.value = "";
        }
    }

    render() {
        return (
            <div className="bot-input">
                <form onSubmit={(e) => this.handleClick(e)}>
                    <input ref={(c) => this._input = c} className="input-text"/>
                    <button type="submit" className="search-button"/>
                </form>

            </div>

        );

    }

    componentDidMount() {

        this.props.ChatChanged("Hi there, Please select a category or tell us what you are looking for");
    }

}


function mapStateToProps(state) {
    return {};
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, {SendToLuis: SendToLuis}, {ChatChanged: ChatChanged}), dispatch);

}

export default connect(mapStateToProps, matchDispatchToProps)(BotInput);