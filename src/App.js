import React, { Component } from "react";
import "./App.css";
import Form from "./components/Form";
import Sort from "./components/Sort";
import Table from "./components/Table";
import Values from "./components/Values";

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
      median: "",
      error: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getGoldRate = async e => {
    e.preventDefault();

    const { startDate, endDate } = this.state;

    if (endDate < startDate) {
      this.setState({
        error: "Błędny zakres dat!",
        dane: [],
        maxValue: "",
        minValue: "",
        median: ""
      });
    } else {
      const api_call = await fetch(
        `http://api.nbp.pl/api/cenyzlota/${startDate}/${endDate}/`
      );
      const data = await api_call.json();

      //finding max and min values
      const maxValue = Math.max(...data.map(o => o.cena));
      const maxValueDate = data.find(o => {
        return o.cena === maxValue;
      });
      const minValue = Math.min(...data.map(o => o.cena));
      const minValueDate = data.find(o => {
        return o.cena === minValue;
      });

      //counting median
      const medianF = function(arr) {
        arr.sort(function(a, b) {
          return a.cena - b.cena;
        });
        var mid = arr.length / 2;
        return mid % 1
          ? arr[mid - 0.5].cena
          : (arr[mid - 1].cena + arr[mid].cena) / 2;
      };
      let median = medianF(data).toFixed(2);

      //default sort by date
      let sortedDate = data.sort((a, b) => {
        let c = new Date(a.data).getTime();
        let d = new Date(b.data).getTime();
        return c > d ? 1 : -1;
      });

      this.setState({
        dane: sortedDate,
        maxValue: maxValue,
        minValue: minValue,
        maxValueDate: maxValueDate.data,
        minValueDate: minValueDate.data,
        median: median,
        error: ""
      });
    }
  };

  sortByPrice(arr) {
    let { togglePrice } = this.state;
    const sortedPrice = arr.sort((a, b) => {
      return togglePrice
        ? a.cena > b.cena
          ? 1
          : -1
        : a.cena < b.cena
          ? 1
          : -1;
    });
    this.setState({ dane: sortedPrice, togglePrice: !togglePrice });
  }

  sortByDate(arr) {
    let { toggleDate } = this.state;
    const sortedDate = arr.sort((a, b) => {
      let c = new Date(a.data).getTime();
      let d = new Date(b.data).getTime();
      return toggleDate ? (c > d ? 1 : -1) : c < d ? 1 : -1;
    });
    this.setState({ dane: sortedDate, toggleDate: !toggleDate });
  }

  render() {
    // api error '400 Bad Request - Przekroczony limit 93 dni / Limit of 93 days has been exceeded' fix
    let minApiDate = new Date();
    minApiDate.setMonth(minApiDate.getMonth() - 3);
    minApiDate = minApiDate.toJSON().slice(0, 10);

    const { dane } = this.state;
    const mappedData = dane.map((val, key) => {
      return (
        <tr key={key}>
          <td>{val.data}</td>
          <td>{val.cena}</td>
        </tr>
      );
    });

    return (
      <div className="App">
        <header className="App-header">Gold rate application</header>
        <div className="App-body">
          <Form
            startDate={this.state.startDate}
            minApiDate={minApiDate}
            maxDate={this.state.maxDate}
            onChange={this.onChange}
            endDate={this.state.endDate}
            getGoldRate={this.getGoldRate}
          />
          {this.state.dane.length !== 0 && (
            <div>
              <Sort
                sortByDate={() => this.sortByDate(this.state.dane)}
                sortByPrice={() => this.sortByPrice(this.state.dane)}
              />
              <Table dataRows={mappedData} />
            </div>
          )}

          {this.state.error && <p className="error__msg">{this.state.error}</p>}

          <Values
            maxValue={this.state.maxValue}
            maxValueDate={this.state.maxValueDate}
            minValue={this.state.minValue}
            minValueDate={this.state.minValueDate}
            median={this.state.median}
          />
        </div>
      </div>
    );
  }
}

export default App;
