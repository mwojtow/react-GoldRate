import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      dane: [],
      startDate: "",
      endDate: "",
      sortedPrice: [],
      sortedDate: [],
      toggle: false,
      toggleDate: false
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sortByPrice(arr) {
    console.log("sort by price");
    let { toggle } = this.state;
    const sortedPrice = arr.sort((a, b) => {
      return toggle ? b.cena > a.cena : b.cena < a.cena;
    });
    this.setState({ dane: sortedPrice, toggle: !toggle });
  }

  sortByDate(arr) {
    let { toggleDate } = this.state;
    const sortedDate = arr.sort((a, b) => {
      console.log("sort data");
      let c = new Date(a.data);
      let d = new Date(b.data);
      return toggleDate ? c > d : c < d;
    });
    this.setState({ dane: sortedDate, toggleDate: !toggleDate });
  }

  getGoldRate = async e => {
    e.preventDefault();

    const startDate = this.state.startDate;
    const endDate = this.state.endDate;

    const api_call = await fetch(
      `http://api.nbp.pl/api/cenyzlota/${startDate}/${endDate}/`
    );

    const data = await api_call.json();

    this.setState({ dane: data });
  };

  render() {
    const { dane } = this.state;
    const mappedData = dane.map(data => {
      return (
        <li>
          DATA: {data.data}
          CENA: {data.cena}
        </li>
      );
    });

    return (
      <div className="App">
        <header className="App-header">Gold rate</header>

        <input
          type="date"
          value={this.state.startDate}
          onChange={this.onChange}
          name="startDate"
        />
        <input
          type="date"
          value={this.state.endDate}
          onChange={this.onChange}
          name="endDate"
        />
        <button onClick={this.getGoldRate}>Pobierz</button>
        <p>{this.state.startDate}</p>
        <p>{this.state.endDate}</p>
        <button onClick={() => this.sortByDate(this.state.dane)}>
          sort by date
        </button>
        <button onClick={() => this.sortByPrice(this.state.dane)}>
          sort by price
        </button>
        <ul>{mappedData}</ul>
      </div>
    );
  }
}

export default App;
