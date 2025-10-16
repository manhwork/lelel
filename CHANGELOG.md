# Changelog

## [1.3.2] - 2025-10-16

### ✨ Tính năng mới - Auto Features

-   **Auto-Test: Giả lập admin tự động sau 5 giây**

    -   Sau khi post comment, server tự động giả lập admin xem comment
    -   Sử dụng `http.request` để simulate admin behavior
    -   Log chi tiết vào console: admin viewing, XSS detection, stolen cookies
    -   Không cần đăng nhập admin thủ công để test XSS

-   **Auto-Reset: Tự động xóa XSS comments khi về trang chính**
    -   Khi truy cập `/`, server kiểm tra và xóa comments có XSS payload
    -   Phát hiện: `<script>`, `<img>`, `<svg>`, `onerror`
    -   Tự động khôi phục 4 comments mặc định (bao gồm FLAG)
    -   Tránh bị redirect liên tục, dễ dàng reset lab

### 📚 Tài liệu mới

-   **AUTO-TEST.md** - Hướng dẫn chi tiết Auto-Test và Auto-Reset

    -   Cách hoạt động của từng tính năng
    -   Server logs và flow diagram
    -   Test commands
    -   Customize options

-   **test-auto.sh** - Script test tự động toàn bộ flow
    -   Login → Post XSS → Auto-test → Auto-reset
    -   Visual progress với countdown
    -   Hướng dẫn check server logs

### 🔄 Cập nhật

-   **server.js**
    -   `/api/comment` - Thêm auto-test simulation sau 5s
    -   `/` route - Thêm auto-reset logic
-   **Docs** - Cập nhật AUTO-TEST.md, test-auto.sh

## [1.3.1] - 2025-10-16

### ✨ Tính năng mới - Stored XSS + Session Hijacking

-   **Thêm lỗ hổng Stored XSS vào Authentication Bypass Lab**
    -   Comments không được sanitize → Stored XSS
    -   Template render HTML thô (<%- %>) thay vì escape (<%= %>)
    -   API `/api/steal` để nhận stolen cookies
    -   Log stolen cookies vào server console và database
    -   Kết hợp Authentication Bypass + XSS → Session Hijacking

### 📚 Tài liệu mới

-   **XSS-DEMO.md** - Hướng dẫn chi tiết XSS + Session Hijacking

    -   Kịch bản tấn công từng bước
    -   5+ XSS payloads mẫu
    -   Demo với curl
    -   Cách phòng chống

-   **XSS-TEST.sh** - Script test tự động XSS

### 🔄 Cập nhật

-   **Template** - Render HTML thô để có lỗ hổng XSS
-   **Server** - API `/api/steal` để nhận cookies
-   **Docs** - Cập nhật AUTH-GUIDE.md và README.md

## [1.3.0] - 2025-10-16

### ✨ Tính năng mới - Authentication Bypass Lab

-   **Lab Authentication Bypass mới** (`/lab/auth`)
    -   Hệ thống login với form đăng nhập
    -   Cookie lưu username:password dạng plaintext (lỗ hổng)
    -   Bảng tin comments với chức năng post comment
    -   Bypass authentication để đăng nhập admin
    -   Gợi ý chi tiết về cách khai thác

### 🔄 Cập nhật

-   **Server (`server.js`)**

    -   Thêm middleware `cookie-parser`
    -   Thêm route `/lab/auth` cho Authentication Bypass Lab
    -   API `/api/login` - đăng nhập với lỗ hổng cookie
    -   API `/api/comment` - post comment
    -   API `/api/logout` - đăng xuất
    -   Thêm bảng `comments` trong database

-   **Frontend**

    -   Tạo template `auth-lab.ejs` với form login
    -   CSS cho login form, comments section
    -   Hiển thị comments với phân biệt admin
    -   Cập nhật trang chủ: Lab Authentication Bypass active

-   **Tài liệu**
    -   Thêm `AUTH-GUIDE.md` - Hướng dẫn chi tiết Authentication Bypass
    -   Cập nhật `README.md`, `QUICKSTART.md`

### 🚩 FLAG mới

-   `FLAG{4uth_Byp4ss_C00k13_H4ck}`

### 📦 Dependencies

-   Thêm `cookie-parser` v1.4.6

## [1.2.0] - 2025-10-16

### ✨ Tính năng mới - Command Injection Lab

-   **Lab Command Injection mới** (`/lab/cmdi`)
    -   Công cụ ping network với lỗ hổng command injection
    -   Hiển thị command đang thực thi
    -   File bí mật `secret.txt` để khai thác
    -   Gợi ý chi tiết về cách khai thác và phòng chống

### 🔄 Cập nhật

-   **Server (`server.js`)**

    -   Thêm route `/lab/cmdi` cho Command Injection Lab
    -   Thêm API `/api/ping` với lỗ hổng command injection
    -   Import `child_process.exec` để thực thi command

-   **Frontend**

    -   Tạo template `cmdi-lab.ejs` cho giao diện lab
    -   Thêm CSS cho command output (terminal style)
    -   Cập nhật trang chủ: Lab Command Injection đã active

-   **Tài liệu**
    -   Thêm `CMDI-GUIDE.md` - Hướng dẫn chi tiết Command Injection
    -   Thêm `secret.txt` - File bí mật chứa FLAG
    -   Cập nhật `README.md`, `QUICKSTART.md`, `INFO.txt`

### 🚩 FLAG mới

-   `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

## [1.1.0] - 2025-10-16

### ✨ Tính năng mới

-   **Hiển thị tất cả posts ngay khi vào trang SQL Injection Lab**
    -   Khi truy cập `/lab/sqli`, trang sẽ hiển thị sẵn tất cả title từ bảng posts
    -   Không cần phải search mới thấy dữ liệu
    -   Dễ dàng quan sát và so sánh khi thực hiện SQL injection

### 🔄 Cập nhật

-   **Server (`server.js`)**

    -   Route `/lab/sqli` giờ query database và truyền danh sách posts vào template
    -   Sử dụng `db.all()` để lấy tất cả posts

-   **Template (`sqli-lab.ejs`)**
    -   Hiển thị danh sách posts ban đầu bằng EJS template
    -   JavaScript vẫn cập nhật kết quả khi người dùng search

### 📚 Tài liệu

-   Cập nhật `README.md` với tính năng mới
-   Cập nhật `DEMO.md` với hướng dẫn chi tiết
-   Thêm bước 2 "Xem danh sách posts" trong hướng dẫn

## [1.0.0] - 2025-10-16

### 🎉 Phát hành đầu tiên

-   Trang chủ hiển thị danh sách lab
-   SQL Injection Lab với lỗ hổng cố tình
-   Database SQLite với 3 bảng: posts, users, secret
-   API search không filter (vulnerable)
-   Giao diện đẹp với CSS hiện đại
-   Hướng dẫn chi tiết
