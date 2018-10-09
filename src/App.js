import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      dane: [],
      startDate: "",
      endDate: "",
      maxDate: new Date().toJSON().slice(0, 10),
      sortedPrice: [],
      sortedDate: [],
      togglePrice: false,
      toggleDate: false,
      maxValue: "",
      maxValueDate: "",
      minValue: "",
      minValueDate: "",
      median: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getGoldRate = async e => {
    e.preventDefault();

    const { startDate, endDate } = this.state;

    const api_call = await fetch(
      `http://api.nbp.pl/api/cenyzlota/${startDate}/${endDate}/`
    );

    const data = await api_call.json();

    const maxValue = Math.max(...data.map(o => o.cena));
    const maxValueDate = data.find(o => {
      return o.cena === maxValue;
    });
    const minValue = Math.min(...data.map(o => o.cena));
    const minValueDate = data.find(o => {
      return o.cena === minValue;
    });

    let median = function(array) {
      array.sort(function(a, b) {
        return a.cena - b.cena;
      });
      var mid = array.length / 2;
      return mid % 1
        ? array[mid - 0.5].cena
        : (array[mid - 1].cena + array[mid].cena) / 2;
    };

    this.setState({
      dane: data,
      maxValue: maxValue,
      minValue: minValue,
      maxValueDate: maxValueDate.data,
      minValueDate: minValueDate.data,
      median: median(data)
    });

    console.log(this.state.median);
  };

  sortByPrice(arr) {
    let { togglePrice } = this.state;
    const sortedPrice = arr.sort((a, b) => {
      return togglePrice ? b.cena > a.cena : b.cena < a.cena;
    });
    this.setState({ dane: sortedPrice, togglePrice: !togglePrice });
  }

  sortByDate(arr) {
    let { toggleDate } = this.state;
    const sortedDate = arr.sort((a, b) => {
      let c = new Date(a.data);
      let d = new Date(b.data);
      return toggleDate ? c > d : c < d;
    });
    this.setState({ dane: sortedDate, toggleDate: !toggleDate });
  }

  render() {
    const { dane } = this.state;
    const mappedData = dane.map(data => {
      return (
        <tr>
          <td>{data.data}</td>
          <td>{data.cena}</td>
        </tr>
      );
    });

    return (
      <div className="App">
        <header className="App-header">Gold rate</header>
        <p>Wybierz zakres dat:</p>
        <input
          type="date"
          value={this.state.startDate}
          max={this.state.maxDate}
          onChange={this.onChange}
          name="startDate"
        />
        <input
          type="date"
          value={this.state.endDate}
          min={this.state.startDate}
          max={this.state.maxDate}
          onChange={this.onChange}
          name="endDate"
        />
        <button onClick={this.getGoldRate}>Pobierz</button>

        {this.state.dane.length !== 0 && (
          <div>
            <p>
              <button onClick={() => this.sortByDate(this.state.dane)}>
                sort by date
              </button>
              <button onClick={() => this.sortByPrice(this.state.dane)}>
                sort by price
              </button>
            </p>
            <table>
              <thead>
                <tr>
                  <th>DATA</th>
                  <th>CENA</th>
                </tr>
              </thead>
              <tbody>{mappedData}</tbody>
            </table>
          </div>
        )}

        {this.state.maxValue && (
          <p>
            Największa wartość to: {this.state.maxValue} zł z dnia:{" "}
            {this.state.maxValueDate}
          </p>
        )}
        {this.state.minValue && (
          <p>
            Najmniejsza wartość to: {this.state.minValue} zł z dnia:{" "}
            {this.state.minValueDate}
          </p>
        )}
        {this.state.median && <p>Mediana to: {this.state.median} zł</p>}
      </div>
    );
  }
}

export default App;
