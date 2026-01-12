"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, Phone, MessageSquare } from "lucide-react"
import { TermsModal } from "@/components/terms-modal"

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onLogin: (phone: string) => void | Promise<void>
  redirectAfterLogin?: "checkout" | null
}

type AuthStep = "phone" | "code"
type AuthMethod = "sms" | "call"

export function AuthModal({ open, onClose, onLogin, redirectAfterLogin }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [authMethod, setAuthMethod] = useState<AuthMethod>("sms")
  const [countdown, setCountdown] = useState(0)
  const [generatedCode, setGeneratedCode] = useState("")
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    console.log("🔐 AuthModal: open изменился на", open)
    if (open) {
      console.log("✅ AuthModal: открываем модальное окно, сбрасываем состояние")
      setStep("phone")
      setCode("")
    }
  }, [open])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 1) return digits
    if (digits.length <= 4) return `+7 (${digits.slice(1)}`
    if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`
    if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!value.startsWith("+7") && value.length > 0) {
      value = "+7" + value.replace(/\D/g, "")
    }
    setPhone(formatPhone(value))
  }

  const getCleanPhone = () => {
    return phone.replace(/\D/g, "")
  }

  const handleSendCode = (method: AuthMethod) => {
    const cleanPhone = getCleanPhone()
    if (cleanPhone.length !== 11) {
      return
    }

    setAuthMethod(method)
    const newCode = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedCode(newCode)

    // Демо-код в консоль для разработки
    console.log(`🔐 Демо-код для ${phone}: ${newCode}`)

    setStep("code")
    setCountdown(60)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code === generatedCode) {
      const cleanPhone = getCleanPhone()
      localStorage.setItem(`user_${cleanPhone}`, JSON.stringify({ phone: cleanPhone }))
      
      // Закрываем модальное окно СРАЗУ
      onClose()
      
      // Выполняем вход (анимация будет на главной странице)
      await Promise.resolve(onLogin(cleanPhone))
    } else {
      console.log("❌ Неверный код")
      setCode("")
    }
  }

  const handleResendCode = (method: AuthMethod) => {
    if (countdown > 0) return
    handleSendCode(method)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-lg font-medium">
              {step === "phone" ? "Вход в аккаунт" : "Введите код"}
            </DialogTitle>
            <DialogDescription>
              {step === "phone"
                ? redirectAfterLogin === "checkout"
                  ? "Для оформления заказа войдите в аккаунт"
                  : "Введите номер телефона для входа или регистрации"
                : authMethod === "sms"
                  ? `Код отправлен на ${phone}`
                  : `Ожидайте звонок на ${phone}`}
            </DialogDescription>
          </DialogHeader>

          {step === "phone" ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="text-lg tracking-wide"
                  data-testid="auth-phone-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleSendCode("sms")}
                  className="w-full"
                  disabled={getCleanPhone().length !== 11}
                  data-testid="auth-send-sms-btn"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  СМС-код
                </Button>
                <Button
                  onClick={() => handleSendCode("call")}
                  variant="outline"
                  className="w-full"
                  disabled={getCleanPhone().length !== 11}
                  data-testid="auth-send-call-btn"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Звонок
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{" "}
                <button type="button" onClick={() => setShowTerms(true)} className="text-primary hover:underline">
                  условиями использования
                </button>{" "}
                сервиса
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4 pt-2">
              {/* Демо-код (пока СМС не подключены) */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <p className="text-xs text-yellow-800 mb-1">🔧 Режим разработки</p>
                <p className="text-sm font-medium text-yellow-900">Демо-код: <span className="text-2xl font-bold tracking-wider">{generatedCode}</span></p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">{authMethod === "sms" ? "Код из СМС" : "Последние 4 цифры номера"}</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="____"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="text-2xl text-center tracking-[0.5em] font-mono"
                  maxLength={4}
                  autoFocus
                  data-testid="auth-code-input"
                />
              </div>

              <Button type="submit" className="w-full" disabled={code.length !== 4} data-testid="auth-verify-btn">
                Подтвердить
              </Button>

              <div className="flex flex-col items-center gap-2">
                {countdown > 0 ? (
                  <span className="text-sm text-muted-foreground">Повторная отправка через {countdown} сек</span>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleResendCode("sms")}
                      className="text-sm text-primary hover:underline"
                    >
                      Отправить СМС
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResendCode("call")}
                      className="text-sm text-primary hover:underline"
                    >
                      Позвонить
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep("phone")
                    setCode("")
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Изменить номер
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  )
}
