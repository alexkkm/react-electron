import React, { useState } from 'react';
import './Table.css';

const Table = () => {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const addRow = () => {
        setRows([...rows, { id: rows.length, data: Array(columns.length).fill('') }]);
    };

    const addColumn = () => {
        setColumns([...columns, { id: columns.length, name: `Column ${columns.length + 1}` }]);
        // Update existing rows to add an empty cell for the new column
        setRows(rows.map(row => ({ ...row, data: [...row.data, ''] })));
    };

    const handleChange = (rowIndex, columnIndex, value) => {
        const newRows = [...rows];
        newRows[rowIndex].data[columnIndex] = value;
        setRows(newRows);
    };

    const deleteCell = (rowIndex, columnIndex) => {
        const newRows = [...rows];
        newRows[rowIndex].data[columnIndex] = undefined; // Mark the cell as deleted
        setRows(newRows);

        // Remove row if all cells are deleted
        if (newRows[rowIndex].data.every(cell => cell === undefined)) {
            newRows.splice(rowIndex, 1);
        }

        // Remove column if all cells in that column are deleted
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            if (newRows.every(row => row.data[colIndex] === undefined)) {
                setColumns(columns.filter((_, index) => index !== colIndex));
                newRows.forEach(row => row.data.splice(colIndex, 1)); // Remove the column data from each row
                break; // Exit loop after removing the column
            }
        }

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
                                            <button className="delete-button" onClick={() => deleteCell(rowIndex, colIndex)}>Delete Cell</button>
                                        </>
                                    ) : null} {/* Render nothing if the cell is deleted */}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-container">
                <button className="table-button" onClick={addRow}>Add Row</button>
                <button className="table-button" onClick={addColumn}>Add Column</button>
            </div>
        </div>
    );
};

export default Table;