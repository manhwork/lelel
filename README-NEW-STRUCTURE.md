# Security Lab - Cấu Trúc Mới

## Tổng Quan

Dự án đã được tái cấu trúc theo mô hình MVC và separation of concerns để dễ bảo trì và mở rộng.

## Cấu Trúc Thư Mục

```
src/
├── config/                 # Cấu hình ứng dụng
│   ├── database.js        # Cấu hình và quản lý database
│   └── constants.js       # Các hằng số và cấu hình
├── controllers/           # Controllers xử lý logic nghiệp vụ
│   ├── HomeController.js  # Controller cho trang chủ
│   ├── SQLIController.js  # Controller cho SQL Injection lab
│   ├── AuthController.js  # Controller cho Authentication lab
│   ├── CMDIController.js  # Controller cho Command Injection lab
│   ├── CommentController.js # Controller cho comments
│   └── ExploitController.js # Controller cho exploit endpoints
├── models/                # Models quản lý dữ liệu
│   ├── Post.js           # Model cho posts
│   ├── User.js           # Model cho users
│   └── Comment.js        # Model cho comments
├── routes/                # Định nghĩa routes
│   └── index.js          # Tất cả routes của ứng dụng
├── middleware/            # Middleware functions
│   └── security.js       # Middleware bảo mật và logging
├── services/              # Business logic services
│   └── BrowserAutomationService.js # Service cho browser automation
└── app.js                # Main application class
```

## Các Thành Phần Chính

### 1. Config Layer

-   **database.js**: Quản lý kết nối và khởi tạo database
-   **constants.js**: Chứa các hằng số và cấu hình

### 2. Model Layer

-   **Post.js**: Xử lý dữ liệu posts (có lỗ hổng SQL Injection cố tình)
-   **User.js**: Xử lý dữ liệu users và authentication
-   **Comment.js**: Xử lý dữ liệu comments và XSS detection

### 3. Controller Layer

-   **HomeController**: Xử lý trang chủ và auto-reset comments
-   **SQLIController**: Xử lý SQL Injection lab
-   **AuthController**: Xử lý Authentication lab
-   **CMDIController**: Xử lý Command Injection lab
-   **CommentController**: Xử lý comments và XSS automation
-   **ExploitController**: Xử lý các endpoint exploit

### 4. Service Layer

-   **BrowserAutomationService**: Quản lý browser automation cho XSS demo

### 5. Middleware Layer

-   **security.js**: Logging và security headers (cố tình không secure)

## Cách Sử Dụng

### Chạy với cấu trúc mới:

```bash
node server-new.js
```

### Chạy với cấu trúc cũ:

```bash
node server.js
```

## Lợi Ích Của Cấu Trúc Mới

1. **Separation of Concerns**: Mỗi thành phần có trách nhiệm riêng biệt
2. **Maintainability**: Dễ bảo trì và sửa lỗi
3. **Scalability**: Dễ mở rộng thêm tính năng mới
4. **Testability**: Dễ viết unit test cho từng component
5. **Readability**: Code dễ đọc và hiểu hơn
6. **Reusability**: Các component có thể tái sử dụng

## Migration Guide

Để chuyển từ cấu trúc cũ sang mới:

1. **Backup**: Sao lưu file `server.js` cũ
2. **Test**: Chạy `server-new.js` để kiểm tra
3. **Replace**: Thay thế `server.js` bằng `server-new.js` nếu ổn định
4. **Cleanup**: Xóa các file không cần thiết

## Security Notes

⚠️ **Lưu ý**: Các lỗ hổng bảo mật trong code là cố tình để phục vụ mục đích demo và học tập:

-   SQL Injection trong Post.search()
-   Command Injection trong CMDIController.ping()
-   XSS vulnerabilities trong comment system
-   Authentication bypass trong cookie handling
-   Thiếu security headers trong middleware

**KHÔNG sử dụng code này trong production!**
