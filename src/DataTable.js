import React, { Component } from 'react';
import {has, chunk, sortBy, pull, filter, isEqual} from 'lodash';
import './dataTable.css';
const defaultPageLimit = 5;

class DataTable extends Component {
  constructor(props){
    super(props)
    this.totalRows = this.props.content.length
    this.totalPages = Math.ceil(this.totalRows/defaultPageLimit)
    this.sortedColumns = []
    this.state = {
      pageLimit: defaultPageLimit,
      paginatedPages: chunk(this.props.content,defaultPageLimit),
      currentPage: 1
    }
  }

  componentDidMount = () => {
    this.updatePaginatedPages()
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
      if(!isEqual(this.props.content,nextProps.content)) {
        this.updatePaginatedPages(nextProps.content)
      }
  }

  updatePaginatedPages = (updatedPages) => {
    let paginatedPages = chunk(updatedPages ? updatedPages : this.props.content,this.state.pageLimit)
    // console.log(`chunks of size ${this.state.pageLimit}`,paginatedPages);
    paginatedPages.unshift({})
    this.setState({
      paginatedPages: paginatedPages
    })
  }

  updatePageLimit = (value) => {
    value = parseInt(value,10)
    if(isNaN(value) || value === '' || value <= 0 || value > this.totalRows) value = defaultPageLimit
    this.setState({
      pageLimit: value
    },() => {
      this.updatePaginatedPages()
      this.totalPages = Math.ceil(this.totalRows/this.state.pageLimit)
    })
  }

  updateCurrentPage = (value) => {
    value = parseInt(value,10)
    if(isNaN(value) || value === '' || value <= 0 || value > this.totalPages) value = 1
    this.setState({
      currentPage: value
    })
  }

  sortColumn = (column) => {
    if(this.sortedColumns.indexOf(column) < 0) {
      this.sortedColumns.push(column)
    } else {
      pull(this.sortedColumns,column)
    }
    // console.log(`Before sorting on ${this.sortedColumns}:`,this.props.content);
    let sortedData = sortBy(this.props.content,this.sortedColumns)
    // console.log(`After sorting on ${this.sortedColumns}:`,sortedData);
    this.updatePaginatedPages(sortedData)
  }

  setSearchColumn = (event) => {
    this.column = event.target.value
    let headers = this.getKeys()
    //To match columnFormat and actual header casing
    this.column = headers[headers.indexOf(this.column)]
  }

  searchTable = (event) => {
    if(this.column === undefined) return
    let query = event.target.value
    let searchString = {}
    if(this.props.columnFormat[this.column] && this.props.columnFormat[this.column].toLowerCase() === 'number') {
      query = parseFloat(query,10)
    }
    searchString[this.column] = query
    // console.log('searchString:',searchString)
    let filteredData = filter(this.props.content, searchString)
    // console.log('filteredData:',filteredData);
    if(filteredData.length!==0) {
      this.updatePaginatedPages(filteredData)
    } else {
      //to be optimized
      this.updatePaginatedPages()
    }
  }

  getKeys = () => {
    return Object.keys(this.props.content[0]);
  }

  getHeader = () => {
    var keys = this.getKeys();
    return keys.map((key, index)=>{
      return <th key={key} onClick={() => this.sortColumn(key)}>
        {key.toUpperCase()}
        {(this.sortedColumns.indexOf(key.toString()) >= 0)?<span>&#9650;</span>:''}
      </th>
    })
  }

  getRowsData = () => {
    let currentPageRow = this.state.paginatedPages[this.state.currentPage]
    //When rows per page update makes the current page invalid
    if(currentPageRow === undefined) currentPageRow = this.state.paginatedPages[1]
    var keys = this.getKeys();
    // console.log(currentPageRow);
    return currentPageRow.map((row, index)=>{
      return <tr key={index}><RenderRow data={row} keys={keys} columnFormat={this.props.columnFormat}/></tr>
    })
  }

  render(){
    return(
      <div>
        <div id="pagination">
          <table>
            <tbody>
            <tr>
              <td>
                <span id="pageNo">Page:<span>{this.state.currentPage}/{this.totalPages}</span></span>
              </td>
              <td>
                <span id="rowsPerPage">
                  <label>Per Page&nbsp;
                    <input type="number" onChange={(e)=>this.updatePageLimit(e.target.value)} max={this.totalRows} min="1" value={this.state.pageLimit}/>
                  </label>
                </span>
              </td>
              <td>
                <span id="goToPage">
                  <label>Go To Page&nbsp;
                    <input type="number" onChange={(e)=>this.updateCurrentPage(e.target.value)} max={this.totalPages} min="1"/>
                  </label>
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div id="searchTable">
          <label>Search By:</label>
          <select onChange={this.setSearchColumn}>
            <option disabled selected>Select column</option>
            { this.getKeys().map((key,index)=>{
              return <option key={index}>{key}</option>
            })}
          </select>&nbsp;
          <input type="text" onChange={this.searchTable} placeholder="Enter data to search"/>
        </div>
        <table id="dataTable">
          <thead>
            <tr>{this.getHeader()}</tr>
          </thead>
          <tbody>
            {this.getRowsData()}
          </tbody>
        </table>
      </div>
    )
  }
}

const RenderRow = (props) =>{
  return props.keys.map((key, index)=>{
    if(has(props.columnFormat,key)){
      return <RenderCell format={props.columnFormat[key]} keyValue={`${props.data[key]}_${index}`} key={`${props.data[key]}_${index}`} value={props.data[key]} />
    }else{
      return <RenderCell format={0} keyValue={`${props.data[key]}_${index}`} key={`${props.data[key]}_${index}`} value={props.data[key]}/>
    }
  })
}

const RenderCell = (props) => {
  switch(props.format){
    case 'checkbox':
      return <td key={props.keyValue}><RenderCheckbox value={props.value}/></td>
    case 'text':
      return <td key={props.keyValue}><RenderTextbox value={props.value}/></td>
    default:
    return <td key={props.keyValue}>{props.value}</td>
  }
}

const RenderCheckbox = (props) => {
  return <input type="checkbox" checked={(props.value === 'true')?true:false} readOnly/>
}

const RenderTextbox = (props) => {
  return <input type="text" value={props.value} readOnly/>
}

export default DataTable;
