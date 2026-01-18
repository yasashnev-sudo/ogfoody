#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir("/Users/sergejasasnev/Downloads/my-project (1)")

print("🚀 Начало деплоя...")
print("")

# 1. Git commit и push
print("📤 Коммит и push изменений...")
subprocess.run(["git", "add", "components/payment-modal.tsx", "app/api/payments/yookassa/create/route.ts"], check=False)
subprocess.run(["git", "commit", "-m", "Исправлены ошибки виджета YooKassa и добавлена поддержка платформ"], check=False)
result = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)

print("")
print("📥 Деплой на сервер...")

# 2. Деплой через expect
subprocess.run(["/usr/bin/expect", "deploy-to-production.expect"])

print("")
print("✅ Деплой завершен!")
