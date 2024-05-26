import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jsonData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'bib', direction: 'ascending' });

  const fetchData = async () => {
    try {
      // Fetching data from the local JSON file
      const response = await fetch('/MarathonResults.json');

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parsing JSON data
      const data = await response.json();
      // Set data to state
      setData(data.results.athletes);
     
    } catch (error) {
      // Catch and set any errors
      setError(error.message);
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    const table = document.getElementById('athleteTable');
    const rows = table.querySelectorAll('tr');
    let csvContent = '';

    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols).map(col => col.innerText).join(',');
      csvContent += rowData + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'race_results.csv');
    a.click();
  };

  const sortByColumn = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedData = [...jsonData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
    setSortConfig({ key, direction });
  }

  return (
    <div className="App">
      <h1>Race Results</h1>
      <table id="athleteTable" >
        <thead>
          <tr>
            <th>Rank <span className="up-arrow" onClick={() => sortByColumn('rank')}></span></th>
            <th>Full Name</th>
            <th>Finish Time</th>
            <th>Country Code</th>
            <th>Bib Number <span className="up-arrow" onClick={() => sortByColumn('bibnumber')}></span></th>
          </tr>
        </thead>
        <tbody>
        {jsonData.map((athlete) => (
            <tr key={athlete.athleteid}>
              <td>{athlete.rank}</td>
              <td>{athlete.firstname + ' ' + athlete.surname}</td>
              <td>{athlete.finishtime}</td>
              <td>{athlete.flag}</td>
              <td>{athlete.bibnumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <div className='bottomButton'>
        <button className="exportCSV" onClick={exportToCSV} id="export-csv">Download CSV</button>
      </div>
    </div>
  );
}

export default App;
