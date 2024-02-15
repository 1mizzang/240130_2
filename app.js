const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001;

// CORS 미들웨어 사용
app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'archive'
});

// 데이터베이스 연결
connection.connect();

app.post('/submit', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO Untitled (title, content) VALUES (?, ?)';
  connection.query(query, [title, content], (error, results, fields) => {
    console.log(query);
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ success: false, message: 'Error inserting data' });
    }
    res.json({ success: true, message: 'Data inserted successfully', insertId: results.insertId });
  });
});

// 전체 불러오기 + SELECT * FROM Untitled WHERE title LIKE '%사용자입력%';
app.get('/', (req, res) => {
  const { search } = req.query;

  let query;
  if (search) {
    query = 'SELECT * FROM Untitled WHERE title LIKE ?';
  } else {
    query = 'SELECT * FROM Untitled';
  }
  connection.query(query, search ? [`%${search}%`] : [], (error, results) => {
    console.log("실행된 쿼리: ", query);
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ success: false, message: 'Error fetching data' });
    }

    res.json({ success: true, message: 'Data retrieved successfully', data: results });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
