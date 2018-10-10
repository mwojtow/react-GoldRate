import React, { Component } from "react";

class Sort extends Component {
  render() {
    return (
      <div className="sort__box">
        <span>sortowanie</span>
        <button className="btn" onClick={this.props.sortByDate}>
          DATA
        </button>
        <button className="btn" onClick={this.props.sortByPrice}>
          CENA
        </button>
      </div>
    );
  }
}
export default Sort;
