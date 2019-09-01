This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

The package contains a reusable component (DataTable) for React that lets users manage and display tabular data from a CSV format in a
customized way.

## Running the example
- Clone the repo: `git clone https://github.com/bhushanbagwe/react-data-table.git`
- Install the dependencies: `npm install`
- Run the app with setup example: `npm start`
- Use the sample csv file from the root directory to upload: **1000 Sales Records.csv** 

## Pointers
- Only CSV format supported
- The component accepts an array of objects as data source ('content' prop). The example uses 'papaparse' module for csv parsing.
- Supported column types: number, text, checkbox
- Need to pass 'columnFormat' prop to define column types for visual changes.
- Column data sorting works by clicking on the header. Only ascending sort supported
- Search filtering works for exact match (case sensitive)
- Search filtering on column of type checkbox accepts values: true, false
