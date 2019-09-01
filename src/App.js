import React, { Component } from 'react'
import Papa from 'papaparse'
import './dataTable.css'
import DataTable from './DataTable'
const columnFormat = {Region:'text',Order_Shipped:'checkbox'}

class App extends Component {
  constructor(props){
    super(props);
    this.state={}
  }

  readCSVInput = () => {
    let dataInput = document.getElementById('dataInput')
    Papa.parse(dataInput.files[0],
      {
        complete: (results, file) => {
          // console.log("CSV Data:", results.data);
          this.setState({tableData: results.data})
        },
        skipEmptyLines: true,
        header: true
      }
    )
  }

  render() {
    return (
      <div className="App">
        <p><input type="file" id="dataInput" name="dataInput" accept=".csv" onChange={this.readCSVInput}/></p>
        {
          this.state.tableData &&
          <DataTable content={this.state.tableData} columnFormat={columnFormat}/>
        }
      </div>
    );
  }
}

export default App;
