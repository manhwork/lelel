# 🎉 Dự Án Security Lab - HOÀN THÀNH

## ✅ Tổng Quan

**Version:** 1.3.0  
**Ngày hoàn thành:** 16/10/2025  
**Số lượng labs:** 3 labs  
**Tổng số FLAGS:** 3 flags  

## 🔬 Danh Sách Labs

| # | Lab | URL | FLAG |
|---|-----|-----|------|
| 1 | SQL Injection | `/lab/sqli` | `FLAG{SQL_1nj3ct10n_M4st3r}` |
| 2 | Command Injection | `/lab/cmdi` | `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}` |
| 3 | Authentication Bypass | `/lab/auth` | `FLAG{4uth_Byp4ss_C00k13_H4ck}` |

## 🚀 Quick Start

```bash
# Cài đặt
npm install

# Khởi động
npm start

# Truy cập
http://localhost:3000
```

## 🎯 Khai Thác Nhanh

### Lab 1: SQL Injection
```sql
' UNION SELECT id, flag FROM secret--
```

### Lab 2: Command Injection
```bash
8.8.8.8; cat secret.txt
```

### Lab 3: Authentication Bypass
```
1. Login: user1 / password1
2. F12 → Cookies → Sửa auth = admin:admin123
3. Refresh → Xem FLAG
```

## 📊 Thống Kê

### Code
- **Files:** 8 files
- **Templates:** 4 views (index + 3 labs)
- **Backend:** Node.js + Express
- **Database:** SQLite3
- **CSS:** 540+ lines

### Documentation
- **Files:** 10 files
- **Tổng:** ~50+ pages
- **Ngôn ngữ:** Tiếng Việt
- **Format:** Markdown + TXT

### Database
- **Tables:** 4 bảng (posts, users, secret, comments)
- **Data:** 16 records
- **FLAGS:** 3 flags

## 📁 Cấu Trúc

```
lelel/
├── server.js (6KB)
├── package.json
├── lab.db
├── secret.txt
│
├── views/ (4 templates)
│   ├── index.ejs
│   ├── sqli-lab.ejs
│   ├── cmdi-lab.ejs
│   └── auth-lab.ejs
│
├── public/css/
│   └── style.css (18KB)
│
└── docs/ (10 files)
    ├── README.md
    ├── DEMO.md
    ├── CMDI-GUIDE.md
    ├── AUTH-GUIDE.md
    ├── QUICKSTART.md
    ├── CHANGELOG.md
    ├── SUMMARY.md
    ├── INFO.txt
    ├── TEST.md
    └── FINAL-SUMMARY.md
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js + Express 4.x |
| Database | SQLite3 |
| Template | EJS |
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Cookie | cookie-parser |

## 🔒 Lỗ Hổng Được Thực Hành

### 1. SQL Injection
- **Lỗ hổng:** Query không được sanitize
- **Kỹ thuật:** Union-based SQL Injection
- **Khai thác:** UNION SELECT để lấy data từ bảng khác
- **Phòng chống:** Prepared Statements

### 2. Command Injection
- **Lỗ hổng:** exec() với user input
- **Kỹ thuật:** Command chaining (`;`, `&&`, `||`)
- **Khai thác:** Thực thi lệnh tùy ý trên server
- **Phòng chống:** execFile() + input validation

### 3. Authentication Bypass
- **Lỗ hổng:** Cookie lưu plaintext credentials
- **Kỹ thuật:** Cookie manipulation
- **Khai thác:** Giả mạo cookie để đăng nhập admin
- **Phòng chống:** Session/JWT + httpOnly cookie

## 📖 Tài Liệu

### Guides (Hướng dẫn chi tiết)
1. **DEMO.md** - SQL Injection (200+ lines)
2. **CMDI-GUIDE.md** - Command Injection (250+ lines)
3. **AUTH-GUIDE.md** - Authentication Bypass (280+ lines)

### Quick References
- **README.md** - Tổng quan dự án
- **QUICKSTART.md** - Bắt đầu nhanh
- **INFO.txt** - Thông tin tổng quan (ASCII)

### Meta
- **CHANGELOG.md** - Lịch sử phát triển
- **SUMMARY.md** - Tóm tắt dự án
- **TEST.md** - Test cases

## 🧪 Testing

Tất cả labs đã được test và hoạt động:

```bash
# Test Suite
✅ SQL Injection - FLAG retrieved
✅ Command Injection - FLAG retrieved  
✅ Authentication Bypass - FLAG retrieved
✅ Login API - Working
✅ Comment API - Working
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "ejs": "^3.1.9",
  "cookie-parser": "^1.4.6"
}
```

## 🎨 Features

### Giao Diện
- ✅ Responsive design
- ✅ Modern gradient UI
- ✅ Terminal-style output
- ✅ Form validation
- ✅ Cookie management

### Chức Năng
- ✅ 3 vulnerable labs
- ✅ Live query/command display
- ✅ Comment system
- ✅ Login/Logout
- ✅ Hints & guides

### Bảo Mật (Educational)
- ✅ Intentional vulnerabilities
- ✅ Security explanations
- ✅ Prevention methods
- ✅ Best practices

## 🏆 Achievement

- [x] 3/3 Labs hoàn thành
- [x] 10 tài liệu đầy đủ
- [x] 3 FLAGS ẩn
- [x] Giao diện đẹp
- [x] Code clean & organized
- [x] Tested & working

## 📝 Credits

**Developed for:** Educational purposes only  
**Language:** Vietnamese  
**License:** MIT  

---

## 🚩 ALL FLAGS

```
FLAG{SQL_1nj3ct10n_M4st3r}
FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
FLAG{4uth_Byp4ss_C00k13_H4ck}
```

---

**🎉 Project Complete!** Ready to hack (responsibly)! 🎉
