import React, {Component} from 'react' ;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {FetchCategories, SendToLuis, SetCategoryID} from '../actions/index';

class Categories extends Component {

    categorySelected(categoryName, categoryId) {
        this.props.SendToLuis(categoryName);
        this.props.SetCategoryID(categoryId);

    }

    renderCategories() {
        return this.props.categories.categories.map((category) => {
            return (<li key={category.id}
                        onClick={this.categorySelected.bind(this,category.name,category.id)}>{category.name}</li>);

        });

    }

    render() {
        if (!this.props.categories) {
            return (<h4>Loading</h4>);
        }
        return (
            <ul className="category-list">
                {this.renderCategories()}
            </ul>
        );

    }

    componentDidMount() {
        this.props.FetchCategories();
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categories
    };
}
function matchDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, {FetchCategories: FetchCategories}, {SendToLuis: SendToLuis}, {SetCategoryID: SetCategoryID}), dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Categories);
