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


// ==========================================
// 4. THỰC HIỆN CRUD CHO ĐỐI TƯỢNG STUDENT
// ==========================================

// --- 1. READ (Lấy toàn bộ danh sách Sinh viên) ---
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Student');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- 2. CREATE (Thêm mới một Sinh viên) ---
app.post('/api/students', async (req, res) => {
    const { student_id, full_name, email, phone } = req.body;
    
    if (!student_id || !full_name) {
        return res.status(400).json({ success: false, message: 'Thiếu mã SV hoặc họ tên!' });
    }

    try {
        const sql = 'INSERT INTO Student (student_id, full_name, email, phone) VALUES (?, ?, ?, ?)';
        await pool.query(sql, [student_id, full_name, email, phone]);
        res.status(201).json({ success: true, message: 'Thêm sinh viên thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- 3. UPDATE (Cập nhật thông tin Sinh viên theo mã ID) ---
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, email, phone } = req.body;

    try {
        const sql = 'UPDATE Student SET full_name = ?, email = ?, phone = ? WHERE student_id = ?';
        const [result] = await pool.query(sql, [full_name, email, phone, id]);
        
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
        const sql = 'DELETE FROM Student WHERE student_id = ?';
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên để xóa!' });
        }
        res.status(200).json({ success: true, message: `Đã xóa sinh viên ${id} thành công!` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});