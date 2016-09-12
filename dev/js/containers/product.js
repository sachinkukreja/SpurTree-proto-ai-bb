import React, {Component} from 'react' ;
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {FetchProducts, FetchProductsForCategory, FetchProductsWithAttributes} from  '../actions/index';

class Product extends Component {

    showProductdetails(id) {
        alert(id);
    }

    renderProductList() {
        console.log("Product at Container", this.props.product);
        return this.props.products.map((product)=> {
            return (
                <li key={product.sku} onClick={()=>this.showProductdetails(product.sku)}><p>{product.name}</p>
                    <div><img src={product.image}/></div>
                    <p>{product.salePrice}</p>
                </li>
            );
        });
    }

    componentWillMount() {

    }

    componentDidMount() {


        if (this.props.location.query.id) {
            this.props.FetchProductsForCategory(this.props.location.query.id, this.props.location.query.sort);
        } else if (this.props.location.query.search) {
            if (Object.keys(this.props.location.query).length == 1)
                this.props.FetchProducts(this.props.location.query.search, this.props.location.query.sort);
            else {
                this.props.FetchProductsWithAttributes(this.props.location.query, this.props.location.query.sort);
            }
        }


    }

    render() {

        if (!this.props.products) {

            return (<h4>Loading Products - {this.props.params.query}</h4>)

        }


        return (
            <div className="products-container">
                {this.renderProductList()}
            </div>
        );
    }

}
function mapStateToProps(state) {
    return {
        products: state.products
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, {FetchProductsForCategory: FetchProductsForCategory}, {FetchProducts: FetchProducts}, {FetchProductsWithAttributes: FetchProductsWithAttributes}), dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Product);
