# 🏗️ Architecture Guide

Tài liệu chi tiết về kiến trúc và cấu trúc của Security Lab.

## 📁 Cấu Trúc Dự Án

```
lelel/
├── src/                          # Source code (cấu trúc mới)
│   ├── config/                   # Cấu hình
│   │   ├── database.js          # Database configuration
│   │   └── constants.js         # Constants và settings
│   ├── controllers/             # Business logic
│   │   ├── HomeController.js    # Trang chủ
│   │   ├── SQLIController.js    # SQL Injection lab
│   │   ├── AuthController.js    # Authentication lab
│   │   ├── CMDIController.js    # Command Injection lab
│   │   ├── CommentController.js # Comments management
│   │   └── ExploitController.js # Exploit endpoints
│   ├── models/                  # Data models
│   │   ├── Post.js             # Posts model
│   │   ├── User.js             # Users model
│   │   └── Comment.js          # Comments model
│   ├── routes/                  # Route definitions
│   │   └── index.js            # All routes
│   ├── middleware/              # Middleware functions
│   │   └── security.js         # Security middleware
│   ├── services/                # Business services
│   │   └── BrowserAutomationService.js # Chrome automation
│   └── app.js                   # Main application class
├── views/                       # EJS templates
│   ├── index.ejs               # Homepage
│   ├── sqli-lab.ejs            # SQL Injection lab
│   ├── auth-lab.ejs            # Authentication lab
│   └── cmdi-lab.ejs            # Command Injection lab
├── public/                      # Static assets
│   └── css/
│       └── style.css           # Stylesheet
├── docs/                        # Documentation
│   ├── guides/                 # User guides
│   ├── labs/                   # Lab documentation
│   ├── api/                    # API reference
│   └── examples/               # Code examples
├── server.js                    # Legacy server (cấu trúc cũ)
├── server-new.js               # New server (cấu trúc mới)
├── browser-automation.js       # Chrome automation module
├── lab.db                      # SQLite database
├── secret.txt                  # Secret file for CMDI lab
└── package.json                # Dependencies
```

## 🔄 Kiến Trúc MVC

### Model Layer

-   **Post.js**: Quản lý dữ liệu posts
-   **User.js**: Quản lý users và authentication
-   **Comment.js**: Quản lý comments và XSS detection

### View Layer

-   **EJS Templates**: Render HTML với data từ controllers
-   **Static Assets**: CSS, JavaScript, images

### Controller Layer

-   **HomeController**: Xử lý trang chủ và auto-reset
-   **SQLIController**: Xử lý SQL Injection lab
-   **AuthController**: Xử lý authentication và session
-   **CMDIController**: Xử lý Command Injection lab
-   **CommentController**: Xử lý comments và XSS automation
-   **ExploitController**: Xử lý exploit endpoints

## 🗄️ Database Schema

### Bảng `posts`

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);
```

### Bảng `users`

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT
);
```

### Bảng `secret`

```sql
CREATE TABLE secret (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flag TEXT NOT NULL,
    description TEXT
);
```

### Bảng `comments`

```sql
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Database Configuration

```javascript
// src/config/database.js
class Database {
    connect()           // Kết nối SQLite
    initDatabase()      // Khởi tạo tables và seed data
    getCount(table)     // Đếm records trong table
    getDb()            // Lấy database instance
    close()            // Đóng connection
}
```

### Constants

```javascript
// src/config/constants.js
const PORT = 3000;
const COOKIE_MAX_AGE = 900000;
const XSS_PATTERNS = ['<script', '<img', '<svg', 'onerror', 'javascript:'];
const DEFAULT_COMMENTS = [...];
```

## 🛡️ Security Features

### XSS Detection

```javascript
// Tự động phát hiện XSS patterns
const hasXSSPayload = XSS_PATTERNS.some((pattern) => comment.includes(pattern));
```

### Auto-Reset

```javascript
// Reset comments khi về trang chủ
if (xssComments.length > 0) {
    await Comment.resetToDefault();
}
```

### Suspicious Activity Logging

```javascript
// Log các request đáng ngờ
const suspiciousPatterns = [
    /<script/i,
    /union.*select/i,
    /drop.*table/i,
    /exec\(/i,
    /system\(/i,
];
```

## 🌐 Browser Automation

### Chrome Auto-Login Flow

```javascript
1. Detect XSS payload in comment
2. Wait 3 seconds
3. Launch Chrome browser
4. Navigate to /lab/auth
5. Login as admin (admin/admin123)
6. View comments page
7. XSS payload executes
8. Take screenshot
9. Close browser after 5 seconds
```

### Error Handling

-   Browser initialization failures
-   Login timeouts
-   Navigation errors
-   Screenshot failures
-   Graceful shutdown

## 🔄 Request Flow

### SQL Injection Lab

```
1. GET /lab/sqli
2. HomeController.lab() → Post.getAll()
3. Render sqli-lab.ejs with posts data
4. User searches → GET /api/search
5. SQLIController.search() → Post.search()
6. Return JSON with results and query
```

### Authentication Bypass Lab

```
1. GET /lab/auth
2. AuthController.lab() → Check cookie
3. If authenticated → Comment.getAll()
4. Render auth-lab.ejs with comments
5. User posts comment → POST /api/comment
6. CommentController.create() → Comment.create()
7. If XSS detected → BrowserAutomationService
```

### Command Injection Lab

```
1. GET /lab/cmdi
2. CMDIController.lab() → Render cmdi-lab.ejs
3. User pings → POST /api/ping
4. CMDIController.ping() → exec(command)
5. Return command output
```

## 🚀 Performance Considerations

### Database

-   SQLite cho development/testing
-   Prepared statements cho security
-   Connection pooling (nếu cần scale)

### Browser Automation

-   Headless mode cho production
-   Timeout handling
-   Resource cleanup
-   Process management

### Caching

-   Static assets caching
-   Database query optimization
-   Response compression

## 🔧 Development vs Production

### Development

```javascript
// Headless: false - Hiển thị browser
// Debug logging enabled
// Auto-reload enabled
// Detailed error messages
```

### Production

```javascript
// Headless: true - Ẩn browser
// Minimal logging
// Error handling
// Security headers
```

## 📊 Monitoring & Logging

### Application Logs

-   Server startup/shutdown
-   Database operations
-   Security events
-   Browser automation

### Security Logs

-   Suspicious activity
-   XSS attempts
-   Authentication bypasses
-   Command injections

### Performance Metrics

-   Response times
-   Database query times
-   Browser automation duration
-   Memory usage

## 🔄 Migration Guide

### Từ Cấu Trúc Cũ Sang Mới

1. **Backup**: Sao lưu `server.js` cũ
2. **Test**: Chạy `server-new.js`
3. **Verify**: Kiểm tra tất cả tính năng
4. **Replace**: Thay thế nếu ổn định
5. **Cleanup**: Xóa code cũ không cần thiết

### Breaking Changes

-   Import paths thay đổi
-   Controller structure mới
-   Service layer được tách riêng
-   Configuration centralized

---

**Version**: 2.0.0  
**Last Updated**: 2025-01-16  
**Architecture**: MVC + Service Layer
