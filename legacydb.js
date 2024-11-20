import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3000;

const dbConfig = {
    host: 'blitz.cs.niu.edu',
    user: 'student',
    password: 'student',
    database: 'csci467',
};

app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT * FROM parts');

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Legacy Database</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }
                    a {
                        color: blue;
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Parts Table</h1>
                <table>
                    <tr>${Object.keys(rows[0]).map(key => `<th>${key}</th>`).join('')}</tr>
                    ${rows.map(row => `
                        <tr>
                            ${Object.entries(row).map(([key, value]) => {
                                // Check if the key is 'pictureURL' and render as a clickable link
                                if (key === 'pictureURL') {
                                    return `<td><a href="${value}" target="_blank">${value}</a></td>`;
                                }
                                return `<td>${value}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
