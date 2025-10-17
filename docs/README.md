# 📚 Security Lab Documentation

Chào mừng đến với tài liệu hướng dẫn Security Lab! Đây là bộ tài liệu đầy đủ để học và thực hành các kỹ thuật bảo mật web.

## 🗂️ Cấu Trúc Tài Liệu

### 📖 [Hướng Dẫn Cơ Bản](./guides/)

-   [Quick Start](./guides/quickstart.md) - Bắt đầu nhanh với Security Lab
-   [Installation](./guides/installation.md) - Cài đặt và cấu hình
-   [Architecture](./guides/architecture.md) - Kiến trúc hệ thống

### 🧪 [Security Labs](./labs/)

-   [SQL Injection Lab](./labs/sql-injection.md) - Thực hành SQL Injection
-   [Command Injection Lab](./labs/command-injection.md) - Thực hành Command Injection
-   [Authentication Bypass Lab](./labs/authentication-bypass.md) - Thực hành vượt qua xác thực
-   [XSS Lab](./labs/xss.md) - Thực hành Cross-Site Scripting

### 🔧 [API Reference](./api/)

-   [REST API](./api/rest-api.md) - Tài liệu API endpoints
-   [Database Schema](./api/database-schema.md) - Cấu trúc database
-   [Configuration](./api/configuration.md) - Cấu hình hệ thống

### 💡 [Examples](./examples/)

-   [Basic Exploits](./examples/basic-exploits.md) - Các exploit cơ bản
-   [Advanced Techniques](./examples/advanced-techniques.md) - Kỹ thuật nâng cao
-   [Defense Strategies](./examples/defense-strategies.md) - Chiến lược phòng thủ

### 📝 [Changelog](./changelog/)

-   [Version History](./changelog/versions.md) - Lịch sử phiên bản
-   [Feature Updates](./changelog/features.md) - Cập nhật tính năng

## 🚀 Bắt Đầu Nhanh

1. **Cài đặt**: Xem [Installation Guide](./guides/installation.md)
2. **Chạy server**: `npm start` hoặc `node server-new.js`
3. **Truy cập**: http://localhost:3000
4. **Bắt đầu lab**: Chọn lab từ trang chủ

## 🎯 Mục Tiêu Học Tập

### SQL Injection

-   Hiểu cách hoạt động của SQL Injection
-   Thực hành Union-based attacks
-   Học cách phòng chống

### Command Injection

-   Khai thác lỗ hổng command injection
-   Sử dụng command chaining
-   Bypass input validation

### Authentication Bypass

-   Phát hiện lỗ hổng cookie không an toàn
-   Session hijacking với XSS
-   Privilege escalation

### XSS (Cross-Site Scripting)

-   Stored XSS attacks
-   Cookie stealing
-   Session hijacking

## ⚠️ Lưu Ý Quan Trọng

-   **CHỈ SỬ DỤNG TRONG MÔI TRƯỜNG LAB**
-   Không thử trên hệ thống thực tế
-   Mục đích giáo dục và học tập
-   Tất cả lỗ hổng đều được thiết kế cố tình

## 🛠️ Tech Stack

-   **Backend**: Node.js + Express
-   **Database**: SQLite3
-   **Template**: EJS
-   **Frontend**: HTML, CSS, JavaScript
-   **Automation**: Puppeteer (Chrome)

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting](./guides/troubleshooting.md)
2. Xem [FAQ](./guides/faq.md)
3. Tạo issue trên GitHub

---

**Version**: 2.0.0  
**Last Updated**: 2025-01-16  
**Maintainer**: Security Lab Team
