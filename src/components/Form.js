import React, { Component } from "react";

class Form extends Component {
  render() {
    return (
      <div>
        <p>Wybierz zakres dat:</p>
        <input
          className="input--date"
          type="date"
          value={this.props.startDate}
          min={this.props.minApiDate}
          max={this.props.maxDate}
          onChange={this.props.onChange}
          name="startDate"
        />
        <input
          className="input--date"
          type="date"
          value={this.props.endDate}
          min={this.props.startDate}
          max={this.props.maxDate}
          onChange={this.props.onChange}
          name="endDate"
        />
        <button className="btn" onClick={this.props.getGoldRate}>
          Pobierz
        </button>
      </div>
    );
  }
}
export default Form;
