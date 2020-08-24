import React, { Component } from "react";
import data from "./data.js";
import "./Home.css";
import * as Notify from "./Notification";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartData: data,
      itemCount: new Array(data.length).fill(1),
    };
  }

  IncrementItem = (index) => {
    let updateArray = this.state.itemCount;
    updateArray.splice(index, 1, this.state.itemCount[index] + 1);
    console.log("updated_Array", updateArray);
    this.setState({ itemCount: updateArray });
    //localStorage.setItem("cartData", JSON.stringify(this.state.cartData));
    localStorage.setItem("quantity", JSON.stringify(this.state.itemCount));
    let getItemCount = localStorage.getItem("quantity");
    this.setState({ itemCount: JSON.parse(getItemCount) });
  };
  DecreaseItem = (index) => {
    let updateArray = this.state.itemCount;
    if (this.state.itemCount[index] !== 0) {
      updateArray.splice(index, 1, this.state.itemCount[index] - 1);
      console.log("updated_Array", updateArray);
      this.setState({ itemCount: updateArray });
    }
    //localStorage.setItem("cartData", JSON.stringify(this.state.cartData));
    localStorage.setItem("quantity", JSON.stringify(this.state.itemCount));
    let getItemCount = localStorage.getItem("quantity");
    this.setState({ itemCount: JSON.parse(getItemCount) });
  };

  DeleteItem = (index, item_name) => {
    Notify.success("Item Deleted");
    let updateCart = this.state.cartData;
    updateCart.splice(index, 1);
    this.setState({ cartData: updateCart });
    let updateItemCount = this.state.itemCount;
    updateItemCount.splice(index, 1);
    this.setState({ itemCount: updateItemCount });
    localStorage.setItem("cartData", JSON.stringify(this.state.cartData));
    localStorage.setItem("quantity", JSON.stringify(this.state.itemCount));
    let getCartData = localStorage.getItem("cartData");
    let getItemCount = localStorage.getItem("quantity");
    this.setState({ cartData: JSON.parse(getCartData) });
    this.setState({ itemCount: JSON.parse(getItemCount) });
  };

  refresh = () => {
    let getCartData = localStorage.getItem("cartData");
    let getItemCount = localStorage.getItem("quantity");

    if (getCartData === "[]") {
      localStorage.setItem("cartData", JSON.stringify(data));
      localStorage.setItem(
        "quantity",
        JSON.stringify(new Array(data.length).fill(1))
      );

      this.setState({ cartData: JSON.parse(localStorage.getItem("cartData")) });
      this.setState({
        itemCount: JSON.parse(localStorage.getItem("quantity")),
      });
    } else {
      Notify.error("Items are present in cart, cant reload");
    }
  };
  calcDiscount = (price, quantity) => {
    let allPrices = price.map((item) => item.price);
    let discount = price.map((item) => item.discount);
    let discountSum = allPrices.map((item, index) => {
      return (discount[index] / 100) * item;
    });
    let totalDiscount = discountSum.reduce((a, b) => a + b, 0);
    return totalDiscount;
  };

  calcFinalCartTotal = (price, quantity) => {
    let allPrices = price.map((item) => item.price);
    let discountVal = this.calcDiscount(price);
    let typeDiscount = this.calcTypeDiscount(price);
    let sum = 0;
    for (let i = 0; i < allPrices.length; i++) {
      sum += allPrices[i] * quantity[i];
    }
    return sum - discountVal - typeDiscount;
  };

  calcTypeDiscount(price) {
    let allPrices = price.map((item) => item.price);
    let fictionDiscount = price.map((item, index) => {
      if (item.type === "fiction") {
        return (15 / 100) * allPrices[index];
      }
    });

    for (let i = 0; i < fictionDiscount.length; i++) {
      if (fictionDiscount[i] === undefined) {
        fictionDiscount.splice(i, 1, 0);
      }
    }
    let totalFictionDiscount = fictionDiscount.reduce((a, b) => a + b, 0);
    return totalFictionDiscount;
  }

  totalCartItems = (items) => {
    let totalItems = items.reduce((a, b) => a + b, 0);
    return totalItems;
  };

  totalCartValue = (price, quantity) => {
    let allPrices = price.map((item) => item.price);
    let sum = 0;
    for (let i = 0; i < allPrices.length; i++) {
      sum += allPrices[i] * quantity[i];
    }
    return sum;
  };

  componentDidMount() {
    let getCartData = localStorage.getItem("cartData");
    let getItemCount = localStorage.getItem("quantity");
    this.setState({ cartData: JSON.parse(getCartData) });
    this.setState({ itemCount: JSON.parse(getItemCount) });
  }
  componentDidUpdate() {}
  render() {
    return (
      <div className="container">
        <div className="row" style={{ marginTop: "5vh" }}>
          <div className="col-md-1 col-sm-1 ">
            {" "}
            <i class="fa fa-chevron-left" style={{ padding: "10px" }}></i>
          </div>
          <div className="col-md-8 col-sm-8">
            <h3 style={{ textAlign: "left" }}>Order Summary</h3>
          </div>
          <div className="col-md-3 col-sm-3">
            <button
              type="button"
              className="btn refreshBtn"
              onClick={this.refresh}
            >
              Reload<i class="fa fa-refresh" style={{ padding: "4px" }}></i>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="container col-md-8 col-sm-12">
            <table className="table cartDataTable">
              <thead>
                <th>Items({this.state.cartData.length})</th>
                <th>Qty</th>
                <th>Price</th>
              </thead>
              <tbody className="table-borderless">
                {this.state.cartData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="border-right border-bottom border-left border-top">
                        <img src={item.img_url}></img> {item.name}
                        <button
                          className="btn btn-default"
                          style={{ float: "right" }}
                          onClick={() => this.DeleteItem(index, item.name)}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                      <td className="add_delete">
                        <button
                          className="btn btn-default"
                          onClick={() => this.DecreaseItem(index)}
                        >
                          <i className="fa fa-minus"></i>
                        </button>
                        <div className="quantity">
                          {this.state.itemCount[index]}
                        </div>
                        <button
                          className="btn btn-default"
                          onClick={() => this.IncrementItem(index)}
                        >
                          <i className="fa fa-plus" aria-hidden="true" />
                        </button>
                      </td>

                      <td>${item.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card col-md-4 col-sm-12 totalCart">
            <div className="card-body totalCart-body">
              <h5 className="card-title">Total</h5>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      Items({this.totalCartItems(this.state.itemCount)})
                    </td>
                    <td>
                      :$
                      {this.totalCartValue(
                        this.state.cartData,
                        this.state.itemCount
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Discount</td>
                    <td>
                      :-$
                      {this.calcDiscount(
                        this.state.cartData,
                        this.state.itemCount
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>Type Discount</td>
                    <td>:-${this.calcTypeDiscount(this.state.cartData)}</td>
                  </tr>
                  <tr style={{ background: "gainsboro" }}>
                    <td style={{ textAlign: "left" }}>Total</td>
                    <td>
                      :$
                      {this.calcFinalCartTotal(
                        this.state.cartData,
                        this.state.itemCount
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
