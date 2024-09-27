import React, { useState } from 'react';
import './Table.css';

const Table = () => {

    // Notes: we store all the data in the rows array, and we store the column names in the columns array
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const addRow = () => {
        // create a new row with: an id, an empty data array with the same length as the number of columns.
        // and add the new row to the rows array
        setRows([...rows, { id: rows.length, data: Array(columns.length).fill('') }]);
    };

    const addColumn = () => {
        // Add a new column to the columns array with: an id and a name "Column x", where x is the new column number
        setColumns([...columns, { id: columns.length, name: `Column ${columns.length + 1}` }]);
        // Update existing rows by: adding an empty cell in each rows to represent the cell of the new column
        setRows(rows.map(row => ({ ...row, data: [...row.data, ''] })));
    };

    // Update the value of a cell
    const handleChange = (rowIndex, columnIndex, value) => {
        // copy the "rows" array once and update the "value" of the cell of the selected "rowIndex" and "columnIndex"
        const newRows = [...rows];
        newRows[rowIndex].data[columnIndex] = value;
        // update the "rows" array with the new value
        setRows(newRows);
    };

    const deleteCell = (rowIndex, columnIndex) => {
        // copy the "rows" array once and mark the cell of the selected "rowIndex" and "columnIndex" as deleted
        const newRows = [...rows];
        newRows[rowIndex].data[columnIndex] = undefined; // Mark the cell as deleted
        // update the "rows" array with the new value
        setRows(newRows);

        // Remove row if all cells are deleted
        if (newRows[rowIndex].data.every(cell => cell === undefined)) {
            newRows.splice(rowIndex, 1);
        }

        // Remove column if all cells in that column are deleted, and update the column names according to the order of the remaining columns
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            if (newRows.every(row => row.data[colIndex] === undefined)) {
                // Update the columns by filtering out the deleted column
                const updatedColumns = columns.filter((_, index) => index !== colIndex);
                setColumns(updatedColumns); // Set the updated columns

                // Remove the column data from each row
                newRows.forEach(row => row.data.splice(colIndex, 1));

                // Update the column names
                const renamedColumns = updatedColumns.map((_, index) => ({
                    id: index,
                    name: `Column ${index + 1}`,
                }));
                setColumns(renamedColumns); // Update the columns with new names

                break; // Exit loop after removing the column
            }
        }

        // update the "rows" array with the new value
        setRows(newRows);
    };

    return (
        <div className="Table">
            <table>
                <thead>
                    <tr>
                        <th colSpan={columns.length + 1} style={{ textAlign: 'center' }}>Table of Example</th> {/* Title spanning all columns */}
                    </tr>
                    <tr>
                        <th style={{ borderColor: '#00f0ff' }}>Row</th> {/* Added Row Header */}
                        {columns.map((col, index) => (
                            <th key={index} style={{ borderColor: '#00f0ff' }}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                            <td style={{ borderColor: '#00f0ff' }}>{`Row ${rowIndex + 1}`}</td> {/* Row Number */}
                            {row.data.map((cell, colIndex) => (
                                <td key={colIndex} style={{ borderColor: '#00f0ff' }}>
                                    {cell !== undefined ? ( // Only render the cell if it is defined
                                        <>
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                                style={{ borderColor: '#00f0ff' }}
                                            />
                                            <button className="delete-button" onClick={() => deleteCell(rowIndex, colIndex)}>Delete</button>
                                        </>
                                    ) : null} {/* Render nothing if the cell is deleted */}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-container">
                <Button className="table-button" label={"Add Row"} onClick={addRow} />
                <Button className="table-button" label={"Add Column"} onClick={addColumn} />
            </div>
        </div>
    );
};

export default Table;


const Button = ({ label, onClick }) => {
    return (
        <div className="Button">
            <button className="button" onClick={onClick}>
                {label}
            </button>
        </div>
    );
};