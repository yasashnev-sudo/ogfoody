"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Menu,
  X,
  Info,
  MessageCircle,
  Phone,
  FileText,
  HelpCircle,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TermsModal } from "@/components/terms-modal"

interface AppMenuProps {
  userPhone: string
}

type MenuSection = "main" | "about" | "support" | "faq" | "delivery" | "chat"

export function AppMenu({ userPhone }: AppMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [section, setSection] = useState<MenuSection>("main")
  const [showTerms, setShowTerms] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Здравствуйте! Чем могу помочь?", isUser: false },
  ])
  const [chatInput, setChatInput] = useState("")

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages((prev) => [
      ...prev,
      { text: chatInput, isUser: true },
      { text: "Спасибо за сообщение! Оператор ответит в ближайшее время.", isUser: false },
    ])
    setChatInput("")
  }

  const handleBack = () => {
    setSection("main")
  }

  const faqs = [
    {
      q: "Как работает доставка на 2 дня?",
      a: "Мы доставляем еду вечером, и она рассчитана на 2 дня. Вы получаете свежие блюда, которые хранятся в холодильнике.",
    },
    {
      q: "Можно ли изменить заказ?",
      a: "Заказ можно изменить до дня доставки. В день доставки изменения недоступны.",
    },
    {
      q: "Как отменить заказ?",
      a: "Откройте заказ в календаре и нажмите 'Отменить заказ'. Отмена доступна до дня доставки.",
    },
    {
      q: "Почему некоторые блюда недоступны?",
      a: "Меню обновляется еженедельно. Некоторые блюда могут быть временно недоступны.",
    },
  ]

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors font-black"
      >
        <Menu className="w-5 h-5 text-black stroke-[2.5px]" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false)
              setSection("main")
            }}
          />

          {/* Slide-in menu */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white border-l-2 border-black shadow-brutal animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-[#9D00FF] text-white p-4 flex items-center justify-between border-b-2 border-black">
                <div className="flex items-center gap-3">
                  {section !== "main" && (
                    <Button
                      onClick={handleBack}
                      className="w-8 h-8 bg-white border-2 border-white rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors -ml-2"
                    >
                      <ChevronRight className="w-4 h-4 text-black rotate-180 stroke-[2.5px]" />
                    </Button>
                  )}
                  <h2 className="text-lg font-black">
                    {section === "main" && "Меню"}
                    {section === "about" && "О нас"}
                    {section === "support" && "Контакты"}
                    {section === "faq" && "Частые вопросы"}
                    {section === "delivery" && "Доставка"}
                    {section === "chat" && "Чат поддержки"}
                  </h2>
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    setSection("main")
                  }}
                  className="w-8 h-8 bg-white border-2 border-white rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors"
                >
                  <X className="w-4 h-4 text-black stroke-[2.5px]" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {section === "main" && (
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 p-4 mb-2 bg-white border-2 border-black rounded-lg shadow-brutal">
                      <div className="w-12 h-12 bg-[#9D00FF] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal overflow-hidden">
                        <img 
                          src="/OGFooDY логотип.png" 
                          alt="OGFooDY Logo" 
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="font-black text-lg text-black">OGFooDY</p>
                        <p className="text-xs text-black/70">домашняя еда на каждый день</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSection("about")}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <Info className="w-5 h-5 text-[#9D00FF] stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-black">О нас</p>
                        <p className="text-sm text-black/70">Наша история и ценности</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                    </button>

                    <button
                      onClick={() => setSection("delivery")}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <MapPin className="w-5 h-5 text-green-600 stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-black">Доставка</p>
                        <p className="text-sm text-black/70">Зоны и время доставки</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                    </button>

                    <button
                      onClick={() => setSection("faq")}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <HelpCircle className="w-5 h-5 text-amber-600 stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-black">Частые вопросы</p>
                        <p className="text-sm text-black/70">Ответы на популярные вопросы</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                    </button>

                    <button
                      onClick={() => setSection("chat")}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <MessageCircle className="w-5 h-5 text-blue-600 stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-black">Чат поддержки</p>
                        <p className="text-sm text-black/70">Напишите нам</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                    </button>

                    <button
                      onClick={() => setSection("support")}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                    >
                      <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <Phone className="w-5 h-5 text-[#9D00FF] stroke-[2.5px]" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-black text-black">Контакты</p>
                        <p className="text-sm text-black/70">Телефон и email</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-black stroke-[2.5px]" />
                    </button>

                    <div className="pt-4 border-t-2 border-black mt-4">
                      <button
                        onClick={() => setShowTerms(true)}
                        className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors"
                      >
                        <div className="w-10 h-10 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                          <FileText className="w-5 h-5 text-black stroke-[2.5px]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-black text-black">Пользовательское соглашение</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {section === "about" && (
                  <div className="p-4 space-y-4">
                    <div className="rounded-lg border-2 border-black overflow-hidden shadow-brutal">
                      <img
                        src="/cozy-home-kitchen-with-chef-cooking.jpg"
                        alt="Наша кухня"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-black text-black">OGFooDY — это про заботу</h3>
                    <p className="text-black/70 leading-relaxed">
                      Мы готовим еду как для своей семьи. Каждое блюдо создается из свежих продуктов нашими опытными
                      поварами с многолетним стажем. OGFooDY — это домашняя еда на каждый день без хлопот.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white border-2 border-black rounded-lg p-4 text-center shadow-brutal">
                        <p className="text-2xl font-black text-[#9D00FF]">5+</p>
                        <p className="text-sm text-black/70">лет опыта</p>
                      </div>
                      <div className="bg-white border-2 border-black rounded-lg p-4 text-center shadow-brutal">
                        <p className="text-2xl font-black text-[#9D00FF]">1000+</p>
                        <p className="text-sm text-black/70">довольных клиентов</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm text-black/70">4.9 на Яндекс.Картах</span>
                    </div>
                  </div>
                )}

                {section === "delivery" && (
                  <div className="p-4 space-y-4">
                    <div className="bg-white border-2 border-black rounded-lg p-4 flex items-start gap-3 shadow-brutal">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5 stroke-[2.5px]" />
                      <div>
                        <p className="font-black text-black">Время доставки</p>
                        <p className="text-sm text-black/70">Вечером с 17:00 до 22:00</p>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-black rounded-lg p-4 shadow-brutal">
                      <p className="font-black text-black mb-2">Зона доставки</p>
                      <p className="text-sm text-black/70">
                        Доставляем по всей Москве в пределах МКАД. Доставка за МКАД до 10 км — бесплатно.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="font-black text-black">Как это работает</p>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#9D00FF] border-2 border-black rounded-lg text-white flex items-center justify-center text-sm font-black shrink-0 shadow-brutal">
                          1
                        </div>
                        <p className="text-sm text-black/70 pt-1">Выбираете дату и собираете заказ на 2 дня</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#9D00FF] border-2 border-black rounded-lg text-white flex items-center justify-center text-sm font-black shrink-0 shadow-brutal">
                          2
                        </div>
                        <p className="text-sm text-black/70 pt-1">
                          Мы готовим и привозим вечером выбранного дня
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-[#9D00FF] border-2 border-black rounded-lg text-white flex items-center justify-center text-sm font-black shrink-0 shadow-brutal">
                          3
                        </div>
                        <p className="text-sm text-black/70 pt-1">Наслаждаетесь домашней едой 2 дня</p>
                      </div>
                    </div>
                  </div>
                )}

                {section === "faq" && (
                  <div className="p-4 space-y-3">
                    {faqs.map((faq, i) => (
                      <div key={i} className="bg-white border-2 border-black rounded-lg p-4 shadow-brutal">
                        <p className="font-black text-black mb-2">{faq.q}</p>
                        <p className="text-sm text-black/70">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section === "support" && (
                  <div className="p-4 space-y-4">
                    <a href="tel:+74951234567" className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors">
                      <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <Phone className="w-6 h-6 text-[#9D00FF] stroke-[2.5px]" />
                      </div>
                      <div>
                        <p className="font-black text-black">+7 (495) 123-45-67</p>
                        <p className="text-sm text-black/70">Ежедневно с 9:00 до 21:00</p>
                      </div>
                    </a>

                    <a href="mailto:hello@switch-food.ru" className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-lg shadow-brutal hover:bg-[#FFEA00] transition-colors">
                      <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                        <MessageCircle className="w-6 h-6 text-[#9D00FF] stroke-[2.5px]" />
                      </div>
                      <div>
                        <p className="font-black text-black">hello@switch-food.ru</p>
                        <p className="text-sm text-black/70">Ответим в течение часа</p>
                      </div>
                    </a>

                    <div className="pt-4">
                      <p className="text-sm font-black text-black mb-3">Мы в соцсетях</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors font-black text-black"
                        >
                          <span className="text-lg">TG</span>
                        </button>
                        <button
                          type="button"
                          className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors font-black text-black"
                        >
                          <span className="text-lg">VK</span>
                        </button>
                        <button
                          type="button"
                          className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFEA00] transition-colors font-black text-black"
                        >
                          <span className="text-lg">WA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {section === "chat" && (
                  <div className="flex flex-col h-[calc(100vh-120px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 border-2 border-black shadow-brutal ${
                              msg.isUser ? "bg-[#9D00FF] text-white" : "bg-white text-black"
                            }`}
                          >
                            <p className="text-sm font-medium">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t-2 border-black bg-white">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Напишите сообщение..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1 border-2 border-black rounded-lg"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="w-10 h-10 bg-[#FFEA00] border-2 border-black rounded-lg flex items-center justify-center shadow-brutal hover:bg-[#FFF033] transition-colors"
                        >
                          <Send className="w-4 h-4 text-black stroke-[2.5px]" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  )
}
