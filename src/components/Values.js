import React, { Component } from "react";

class Values extends Component {
  render() {
    return (
      <div className="value__container">
        {this.props.maxValue && (
          <div className="value__box">
            <div className="value value__header">MAX</div>
            <div className="value value__price">{this.props.maxValue} zł</div>
            <div className="value value__date">{this.props.maxValueDate}</div>
          </div>
        )}
        {this.props.minValue && (
          <div className="value__box">
            <div className="value value__header">MIN</div>
            <div className="value value__price">{this.props.minValue} zł</div>
            <div className="value value__date">{this.props.minValueDate}</div>
          </div>
        )}
        {this.props.median && (
          <div className="value__box">
            <div className="value value__header">MEDIANA</div>
            <div className="value value__price">{this.props.median} zł</div>
          </div>
        )}
      </div>
    );
  }
}
export default Values;
