# 📂 Danh Sách File Dự Án

## 🔧 Core Files

| File | Mô tả | Dung lượng |
|------|-------|-----------|
| `server.js` | Server Express chính với lỗ hổng | ~6 KB |
| `package.json` | Dependencies và scripts | ~0.5 KB |
| `.gitignore` | Git ignore patterns | ~0.1 KB |

## 🗄️ Database & Secrets

| File | Mô tả | Dung lượng |
|------|-------|-----------|
| `lab.db` | SQLite database | ~20 KB |
| `secret.txt` | File bí mật (Command Injection) | ~1 KB |

## 🎨 Templates (views/)

| File | Mô tả | Dung lượng |
|------|-------|-----------|
| `index.ejs` | Trang chủ - danh sách lab | ~2.5 KB |
| `sqli-lab.ejs` | Lab SQL Injection | ~4 KB |
| `cmdi-lab.ejs` | Lab Command Injection | ~4.5 KB |

## 💅 Styles (public/css/)

| File | Mô tả | Dung lượng |
|------|-------|-----------|
| `style.css` | CSS chính cho toàn bộ app | ~12 KB |

## 📚 Documentation

| File | Mô tả | Dung lượng |
|------|-------|-----------|
| `README.md` | Tài liệu chính | ~8 KB |
| `DEMO.md` | Hướng dẫn SQL Injection | ~7 KB |
| `CMDI-GUIDE.md` | Hướng dẫn Command Injection | ~6 KB |
| `QUICKSTART.md` | Bắt đầu nhanh | ~3 KB |
| `CHANGELOG.md` | Lịch sử thay đổi | ~2 KB |
| `SUMMARY.md` | Tóm tắt dự án | ~5 KB |
| `INFO.txt` | Thông tin tổng quan (ASCII) | ~2.5 KB |
| `TEST.md` | Test cases | ~4 KB |
| `FILES.md` | File này | ~1 KB |

## 📊 Tổng kết

- **Tổng số file code:** 8 files
- **Tổng số file docs:** 9 files
- **Tổng dung lượng:** ~88 KB (không tính node_modules)
- **Language:** JavaScript (Node.js), HTML, CSS
- **Framework:** Express.js
- **Database:** SQLite3

## 🗂️ Cấu trúc thư mục

```
lelel/
├── 📄 server.js
├── 📄 package.json
├── 📄 .gitignore
├── 🗄️ lab.db
├── 🚩 secret.txt
│
├── 📁 views/
│   ├── index.ejs
│   ├── sqli-lab.ejs
│   └── cmdi-lab.ejs
│
├── 📁 public/
│   └── css/
│       └── style.css
│
├── 📁 node_modules/ (gitignored)
│
└── 📚 docs/
    ├── README.md
    ├── DEMO.md
    ├── CMDI-GUIDE.md
    ├── QUICKSTART.md
    ├── CHANGELOG.md
    ├── SUMMARY.md
    ├── INFO.txt
    ├── TEST.md
    └── FILES.md
```

## 🎯 File quan trọng nhất

1. **server.js** - Core logic
2. **views/sqli-lab.ejs** - SQL Injection UI
3. **views/cmdi-lab.ejs** - Command Injection UI
4. **README.md** - Documentation
5. **secret.txt** - Target file

## 📝 Ghi chú

- Tất cả file đều có encode UTF-8
- Code style: 4 spaces indent
- Tài liệu viết bằng Tiếng Việt
- Comments trong code bằng Tiếng Việt

---

**Last updated:** 2025-10-16
