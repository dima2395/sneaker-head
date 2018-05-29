import React, { Component } from 'react';
import NumberInput from 'layout/components/NumberInput';
import { connectStore } from 'redux-box';
import { module as productModule } from 'store/product';

class ProductDetail extends Component {
  renderSizes = () => {
    const { productDetails } = this.props.productModule;
    const options = productDetails.sizes.map(size => {
      return (
        <option value={size} key={size}>
          {`EU-${size}`}
        </option>
      )
    })
    return (
      [
        <option key="first" selected disabled value="">{options.length ? "Select size ..." : "No sizes"}</option>,
        ...options
      ]
    )
  }

  addToCart = () => {
    const { id } = this.props.productModule.productDetails;
    this.props.user.addToCart({
      product: id,
      amount: 1,
      size: 46
    });
  }

  componentDidMount() {
    this.props.productModule.getProduct(this.props.match.params.id);
  }
  render() {
    const { productDetails } = this.props.productModule;
    if (productDetails) {
      return (
        <div className="product-detail page">
          <div className="product-detail-head row">
            <div className="preview col-md-6">
              <div className="current-image">
                <img src={productDetails.images[0]} alt="" />
              </div>
            </div>
            <div className="info col-md-6">
              <div className="name">{productDetails.name}</div>
              <div className="brand">{productDetails.brand.name}</div>
              <div className="price">${productDetails.price}</div>
              <div className="add-to-bag">
                <div className="size-quantity">
                  <div className="field size-field">
                    <label htmlFor="size">Size:</label>
                    <select name="size" className="size" placeholder="Choose size">
                      {this.renderSizes()}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="quantity">Amount:</label>
                    <NumberInput minValue={1} maxValue={10} />
                  </div>
                </div>
                <button className="add-button" onClick={this.addToCart}>
                  Add to bag
              </button>
              </div>
            </div>
          </div>
        </div >
      )
    } else {
      return <p>Loading boy</p>
    }



  }
}

export default connectStore({
  productModule
})(ProductDetail);