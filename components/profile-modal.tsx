"use client"

import { useState, useEffect } from "react"
import { X, User, MapPin, Gift, CreditCard, Save, Star, Coins, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserProfile } from "@/lib/types"

const DISTRICTS = [
  "Адмиралтейский район",
  "Василеостровский район",
  "Выборгский район",
  "Калининский район",
  "Кировский район",
  "Красногвардейский район",
  "Красносельский район",
  "Московский район",
  "Невский район",
  "Петроградский район",
  "Приморский район",
  "Фрунзенский район",
  "Центральный район",
]

interface ProfileModalProps {
  phone: string
  onClose: () => void
  onSave: (profile: UserProfile) => void
}

export function ProfileModal({ phone, onClose, onSave }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>({
    phone,
    additionalPhone: "",
    name: "",
    street: "",
    building: "",
    buildingSection: "",
    apartment: "",
    entrance: "",
    floor: "",
    intercom: "",
    district: "",
    deliveryComment: "",
    loyaltyPoints: 0,
    totalSpent: 0,
  })

  const [activeTab, setActiveTab] = useState<"profile" | "loyalty">("profile")

  useEffect(() => {
    const saved = localStorage.getItem(`profile_${phone}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.address && !parsed.street) {
        parsed.street = parsed.address
        delete parsed.address
      }
      setProfile({ ...profile, ...parsed })
    }
  }, [phone])

  const handleSave = () => {
    localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
    onSave(profile)
    onClose()
  }

  const loyaltyLevel = profile.totalSpent >= 50000 ? "gold" : profile.totalSpent >= 20000 ? "silver" : "bronze"
  const loyaltyLevelName = loyaltyLevel === "gold" ? "Золотой" : loyaltyLevel === "silver" ? "Серебряный" : "Бронзовый"
  const cashbackPercent = loyaltyLevel === "gold" ? 7 : loyaltyLevel === "silver" ? 5 : 3

  const nextLevelSpent = loyaltyLevel === "gold" ? null : loyaltyLevel === "silver" ? 50000 : 20000
  const progressToNext = nextLevelSpent ? Math.min((profile.totalSpent / nextLevelSpent) * 100, 100) : 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full md:max-w-lg md:rounded-xl rounded-t-xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up-fade">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Личный кабинет</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Профиль
          </button>
          <button
            onClick={() => setActiveTab("loyalty")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "loyalty"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gift className="w-4 h-4 inline mr-2" />
            Бонусы
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "profile" ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile.name || "Гость"}</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Ваше имя</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Как к вам обращаться?"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Дополнительный телефон</h3>
                </div>
                <Input
                  value={profile.additionalPhone || ""}
                  onChange={(e) => setProfile({ ...profile, additionalPhone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Укажите, если хотите, чтобы курьер мог позвонить на другой номер
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Адрес доставки</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Район</label>
                    <Select
                      value={profile.district || ""}
                      onValueChange={(value) => setProfile({ ...profile, district: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите район" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Улица</label>
                    <Input
                      value={profile.street}
                      onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                      placeholder="ул. Примерная"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Дом</label>
                      <Input
                        value={profile.building}
                        onChange={(e) => setProfile({ ...profile, building: e.target.value })}
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Корпус</label>
                      <Input
                        value={profile.buildingSection || ""}
                        onChange={(e) => setProfile({ ...profile, buildingSection: e.target.value })}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Квартира</label>
                      <Input
                        value={profile.apartment}
                        onChange={(e) => setProfile({ ...profile, apartment: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Подъезд</label>
                      <Input
                        value={profile.entrance}
                        onChange={(e) => setProfile({ ...profile, entrance: e.target.value })}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Этаж</label>
                      <Input
                        value={profile.floor}
                        onChange={(e) => setProfile({ ...profile, floor: e.target.value })}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Домофон</label>
                      <Input
                        value={profile.intercom}
                        onChange={(e) => setProfile({ ...profile, intercom: e.target.value })}
                        placeholder="123#"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Комментарий к доставке</label>
                    <Textarea
                      value={profile.deliveryComment || ""}
                      onChange={(e) => setProfile({ ...profile, deliveryComment: e.target.value })}
                      placeholder="Например: домофон не работает, звоните по телефону"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl ${
                  loyaltyLevel === "gold"
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
                    : loyaltyLevel === "silver"
                      ? "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border border-gray-400/30"
                      : "bg-gradient-to-r from-orange-600/20 to-amber-700/20 border border-orange-600/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-6 h-6 ${
                        loyaltyLevel === "gold"
                          ? "text-yellow-500"
                          : loyaltyLevel === "silver"
                            ? "text-gray-400"
                            : "text-orange-600"
                      }`}
                    />
                    <span className="font-bold text-lg">{loyaltyLevelName} уровень</span>
                  </div>
                  <span className="text-sm font-medium">{cashbackPercent}% кэшбэк</span>
                </div>

                {nextLevelSpent && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">До следующего уровня</span>
                      <span className="font-medium">
                        {profile.totalSpent.toLocaleString()} / {nextLevelSpent.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          loyaltyLevel === "silver" ? "bg-yellow-500" : "bg-gray-400"
                        }`}
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ваши баллы</p>
                      <p className="text-2xl font-bold text-primary">{profile.loyaltyPoints}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">= {profile.loyaltyPoints} ₽</p>
                    <p className="text-xs text-muted-foreground">1 балл = 1 ₽</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Как работает программа лояльности</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Получайте {cashbackPercent}% баллами с каждого заказа
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Оплачивайте до 50% заказа баллами
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    Повышайте уровень и получайте больше кэшбэка
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Уровни программы</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-600 shrink-0" />
                    <span className="text-sm font-medium min-w-[90px]">Бронзовый</span>
                    <span className="text-sm text-muted-foreground">3% кэшбэк</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
                    <span className="text-sm font-medium min-w-[90px]">Серебряный</span>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">от 20 000 ₽ · 5%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-sm font-medium min-w-[90px]">Золотой</span>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">от 50 000 ₽ · 7%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Статистика</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Всего потрачено:{" "}
                  <span className="font-medium text-foreground">{profile.totalSpent.toLocaleString()} ₽</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  )
}
