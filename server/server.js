const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để nhận dữ liệu JSON từ request body (Postman gửi lên)
app.use(express.json());

// ==========================================
// 3. THỰC HIỆN KẾT NỐI CSDL (Hàm chung/Pool dùng chung)
// ==========================================
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test thử kết nối khi server chạy
pool.getConnection()
    .then(conn => {
        console.log('✅ Kết nối Database thành công!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database:', err.message);
        console.error(err);
    });
// --- TEST DATABASE CONNECTION ---
app.get('/api/dbconnection', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS connected');

        res.status(200).json({
            success: true,
            connected: true,
            result: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            connected: false,
            message: error.message
        });
    }
});

// ==========================================
// 4. THỰC HIỆN CRUD CHO ĐỐI TƯỢNG STUDENT
// ==========================================

// --- 1. READ (Lấy toàn bộ danh sách Sinh viên và lấy 1 sinh viên theo ID) ---
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM STUDENT');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM STUDENT WHERE SID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên!' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- 2. CREATE (Thêm mới một Sinh viên) ---
app.post('/api/students', async (req, res) => {
    const { student_id, full_name, email, tutor_id } = req.body;
    
    if (!student_id || !full_name) {
        return res.status(400).json({ success: false, message: 'Thiếu mã SV hoặc họ tên!' });
    }

    try {
        const sql = 'INSERT INTO STUDENT (SID, SNAME, EMAIL, Tutor_Id) VALUES (?, ?, ?, ?)';
        await pool.query(sql, [student_id, full_name, email, tutor_id]);
        res.status(201).json({ success: true, message: 'Thêm sinh viên thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- 3. UPDATE (Cập nhật thông tin Sinh viên theo mã ID) ---
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, email, tutor_id } = req.body;

    try {
        const sql = 'UPDATE STUDENT SET SNAME = ?, EMAIL = ?, Tutor_Id = ? WHERE SID = ?';
        const [result] = await pool.query(sql, [full_name, email, tutor_id, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên để cập nhật!' });
        }
        res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- 4. DELETE (Xóa sinh viên theo mã ID) ---
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        await pool.query( 'DELETE FROM STUDENT_ENROLEMENT WHERE SID = ?', [id] ); 
        const [result] = await pool.query( 'DELETE FROM STUDENT WHERE SID = ?', [id] ); 
        if (result.affectedRows === 0) { 
            return res.status(404).json({ 
                success: false, message: 'Không tìm thấy sinh viên để xóa!' }); 
            } 
            res.status(200).json({ success: true, message: `Đã xóa sinh viên ${id} thành công!` }); 
        } 
    catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});