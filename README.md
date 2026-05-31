# SQL_TEST# STUDENTSREG CRUD API

## Giới thiệu

Đây là project xây dựng RESTful API quản lý sinh viên sử dụng:

- Node.js
- ExpressJS
- MySQL
- Thunder Client

Project thực hiện đầy đủ các chức năng CRUD (Create, Read, Update, Delete) trên bảng STUDENT trong cơ sở dữ liệu STUDENTSREG.

---

## Công nghệ sử dụng

- Node.js
- ExpressJS
- MySQL2
- dotenv
- Thunder Client

---

## Cấu trúc Database

Bảng STUDENT:

| Tên cột | Kiểu dữ liệu |
|----------|-------------|
| SID | VARCHAR(10) |
| SNAME | VARCHAR(30) |
| EMAIL | VARCHAR(30) |
| Tutor_Id | VARCHAR(10) |

---

## Cài đặt

### Clone project

```bash
git clone https://github.com/TranNgocMinh24100190/SQL_TEST.git
cd SQL_TEST
```

### Cài đặt thư viện

```bash
npm install
```

### Tạo file .env

```env
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=STUDENTSREG
```

### Chạy chương trình

```bash
node server.js
```

Server chạy tại:

```txt
http://localhost:3000
```

---

# API Endpoints

## 1. Kiểm tra kết nối Database

### Request

```http
GET /api/dbconnection
```

### Response

```json
{
  "success": true
}
```

---

## 2. Lấy danh sách sinh viên

### Request

```http
GET /api/students
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "student_id": "1000",
      "full_name": "Abdul Basit Chaudhry",
      "email": "abc@abc.com",
      "tutor_id": "1003"
    }
  ]
}
```

---

## 3. Lấy thông tin sinh viên theo ID

### Request

```http
GET /api/students/1000
```

### Response

```json
{
  "success": true,
  "data": {
    "student_id": "1000",
    "full_name": "Abdul Basit Chaudhry",
    "email": "abc@abc.com",
    "tutor_id": "1003"
  }
}
```

---

## 4. Thêm sinh viên

### Request

```http
POST /api/students
```

### Body

```json
{
  "student_id": "1013",
  "full_name": "Test Student",
  "email": "test@test.com",
  "tutor_id": "1000"
}
```

### Response

```json
{
  "success": true,
  "message": "Thêm sinh viên thành công!"
}
```

---

## 5. Cập nhật sinh viên

### Request

```http
PUT /api/students/1013
```

### Body

```json
{
  "full_name": "Updated Student",
  "email": "updated@test.com",
  "tutor_id": "1001"
}
```

### Response

```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công!"
}
```

---

## 6. Xóa sinh viên

### Request

```http
DELETE /api/students/1013
```

### Response

```json
{
  "success": true,
  "message": "Đã xóa sinh viên 1013 thành công!"
}
```

---

# Kiểm thử

Các API đã được kiểm thử bằng Thunder Client trong Visual Studio Code:

- GET
- POST
- PUT
- DELETE

Kết quả trả về đúng theo yêu cầu CRUD.

---

# Tác giả

**Trần Ngọc Minh - 24100190**

Môn học: Thiết kế WEB nâng cao

GitHub Repository:

https://github.com/TranNgocMinh24100190/SQL_TEST