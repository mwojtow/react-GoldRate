import React, { Component } from "react";

class Table extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>DATA</th>
            <th>CENA (zł)</th>
          </tr>
        </thead>
        <tbody>{this.props.dataRows}</tbody>
      </table>
    );
  }
}
export default Table;
