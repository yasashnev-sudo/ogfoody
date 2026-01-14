"use client"

import { useState, useEffect, useRef } from "react"
import { X, User, MapPin, Gift, Save, Star, Coins, Phone, CheckCircle2 } from "lucide-react"
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
  userProfile?: UserProfile | null // Добавлен для синхронизации баллов
  isCheckoutFlow?: boolean // Флаг что это оформление заказа (нельзя закрыть)
}

export function ProfileModal({ phone, onClose, onSave, userProfile, isCheckoutFlow = false }: ProfileModalProps) {
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
  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const profileLoadedRef = useRef(false)

  // Синхронизация всех данных (включая ID!) с внешним userProfile
  useEffect(() => {
    if (userProfile) {
      console.log("🔄 Синхронизация: userProfile.id =", userProfile.id, "тип =", typeof userProfile.id)
      setProfile((prev) => {
        const updated = {
          ...prev,
          id: userProfile.id, // ВАЖНО: копируем ID!
          name: userProfile.name || prev.name,
          street: userProfile.street || prev.street,
          building: userProfile.building || prev.building,
          buildingSection: userProfile.buildingSection || prev.buildingSection,
          apartment: userProfile.apartment || prev.apartment,
          entrance: userProfile.entrance || prev.entrance,
          floor: userProfile.floor || prev.floor,
          intercom: userProfile.intercom || prev.intercom,
          district: userProfile.district || prev.district,
          deliveryComment: userProfile.deliveryComment || prev.deliveryComment,
          additionalPhone: userProfile.additionalPhone || prev.additionalPhone,
          loyaltyPoints: userProfile.loyaltyPoints || 0,
          totalSpent: userProfile.totalSpent || 0,
        }
        console.log("✅ После синхронизации: profile.id =", updated.id, "тип =", typeof updated.id)
        
        // ✅ ИСПРАВЛЕНО 2026-01-14: Сохраняем исходный профиль для отслеживания изменений
        if (!profileLoadedRef.current) {
          setInitialProfile({ ...updated })
          profileLoadedRef.current = true
        }
        
        return updated
      })
    }
  }, [userProfile])

  useEffect(() => {
    const loadProfile = async () => {
      // Сначала загружаем из localStorage
      const saved = localStorage.getItem(`profile_${phone}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.address && !parsed.street) {
          parsed.street = parsed.address
          delete parsed.address
        }
        setProfile((prev) => ({ ...prev, ...parsed }))
      }

      // Затем загружаем актуальные данные из базы данных
      try {
        const { fetchUserByPhone } = await import("@/lib/nocodb")
        const dbUser = await fetchUserByPhone(phone)
        if (dbUser) {
          // NocoDB возвращает данные с обоими вариантами названий колонок
          const loyaltyPointsRaw = dbUser.loyalty_points !== undefined 
            ? dbUser.loyalty_points 
            : (dbUser["Loyalty Points"] !== undefined ? dbUser["Loyalty Points"] : 0)
          const totalSpentRaw = dbUser.total_spent !== undefined 
            ? dbUser.total_spent 
            : (dbUser["Total Spent"] !== undefined ? dbUser["Total Spent"] : 0)
          
          // Используем Id из dbUser - fetchUserByPhone уже возвращает User ID
          console.log("✅ Загружен профиль из базы данных:", {
            userId: dbUser.Id,
            loyaltyPointsRaw,
            totalSpentRaw,
            allKeys: Object.keys(dbUser).filter(k => k.includes("oyalty") || k.includes("pent") || k.includes("Loyalty") || k.includes("Spent") || k.includes("User ID")),
          })
          
          setProfile((prev) => {
            // ВАЖНО: Сохраняем prev.id если dbUser.Id невалиден (NaN, null, undefined)
            const validDbId = dbUser.Id && !isNaN(dbUser.Id) ? dbUser.Id : null
            const finalId = validDbId || prev.id
            
            console.log("🔄 loadProfile: dbUser.Id =", dbUser.Id, "validDbId =", validDbId, "prev.id =", prev.id, "finalId =", finalId)
            
            const updatedProfile = {
              ...prev,
              id: finalId,
              name: dbUser.name || dbUser["Name"] || prev.name,
              phone: dbUser.phone || dbUser["Phone"] || prev.phone,
              additionalPhone: dbUser.additional_phone || dbUser["Additional Phone"] || prev.additionalPhone,
              street: dbUser.street || dbUser["Street"] || prev.street,
              building: dbUser.building || dbUser["Building"] || prev.building,
              buildingSection: dbUser.building_section || dbUser["Building Section"] || prev.buildingSection,
              apartment: dbUser.apartment || dbUser["Apartment"] || prev.apartment,
              entrance: dbUser.entrance || dbUser["Entrance"] || prev.entrance,
              floor: dbUser.floor || dbUser["Floor"] || prev.floor,
              intercom: dbUser.intercom || dbUser["Intercom"] || prev.intercom,
              district: dbUser.district || dbUser["District"] || prev.district,
              deliveryComment: dbUser.delivery_comment || dbUser["Delivery Comment"] || prev.deliveryComment,
              loyaltyPoints: typeof loyaltyPointsRaw === 'number' 
                ? loyaltyPointsRaw 
                : parseInt(String(loyaltyPointsRaw)) || 0,
              totalSpent: typeof totalSpentRaw === 'number'
                ? totalSpentRaw
                : parseFloat(String(totalSpentRaw)) || 0,
            }
            
            // ✅ ИСПРАВЛЕНО 2026-01-14: Сохраняем исходный профиль для отслеживания изменений
            if (!profileLoadedRef.current) {
              setInitialProfile({ ...updatedProfile })
              profileLoadedRef.current = true
            }
            
            return updatedProfile
          })
        }
      } catch (error) {
        console.error("Ошибка при загрузке профиля из базы данных:", error)
      }
    }

    loadProfile()
  }, [phone])

  // ✅ ИСПРАВЛЕНО 2026-01-14: Проверка наличия изменений
  const hasChanges = () => {
    if (!initialProfile) return false
    
    // Сравниваем только редактируемые поля (исключаем loyaltyPoints и totalSpent)
    const editableFields: (keyof UserProfile)[] = [
      'name', 'street', 'building', 'buildingSection', 'apartment',
      'entrance', 'floor', 'intercom', 'district', 'deliveryComment', 'additionalPhone'
    ]
    
    return editableFields.some(field => {
      const current = profile[field] || ""
      const initial = initialProfile[field] || ""
      return String(current).trim() !== String(initial).trim()
    })
  }

  const handleSave = () => {
    // Валидация для оформления заказа
    if (isCheckoutFlow) {
      if (!profile.name?.trim()) {
        alert("Пожалуйста, укажите ваше имя")
        return
      }
      if (!profile.street?.trim()) {
        alert("Пожалуйста, укажите улицу")
        return
      }
      if (!profile.building?.trim()) {
        alert("Пожалуйста, укажите номер дома")
        return
      }
    }
    
    console.log("💾 ProfileModal.handleSave: ID =", profile.id, "тип =", typeof profile.id)
    console.log("💾 ProfileModal.handleSave: profile =", JSON.stringify(profile, null, 2))
    
    localStorage.setItem(`profile_${phone}`, JSON.stringify(profile))
    onSave(profile)
    
    // ✅ ИСПРАВЛЕНО 2026-01-14: Показываем сообщение об успехе только если были изменения
    if (!isCheckoutFlow && hasChanges()) {
      setShowSuccessMessage(true)
      // Закрываем модалку через 1.5 секунды после показа сообщения
      setTimeout(() => {
        onClose()
      }, 1500)
    } else if (!isCheckoutFlow) {
      // Если изменений нет, закрываем сразу
      onClose()
    }
    // Если isCheckoutFlow, модалка закроется автоматически после оформления заказа
  }

  const totalSpent = profile.totalSpent || 0
  const loyaltyPoints = profile.loyaltyPoints || 0
  
  const loyaltyLevel = totalSpent >= 50000 ? "gold" : totalSpent >= 20000 ? "silver" : "bronze"
  const loyaltyLevelName = loyaltyLevel === "gold" ? "Золотой" : loyaltyLevel === "silver" ? "Серебряный" : "Бронзовый"
  const cashbackPercent = loyaltyLevel === "gold" ? 7 : loyaltyLevel === "silver" ? 5 : 3

  const nextLevelSpent = loyaltyLevel === "gold" ? null : loyaltyLevel === "silver" ? 50000 : 20000
  const remainingToNextLevel = nextLevelSpent ? nextLevelSpent - totalSpent : 0
  const progressToNext = nextLevelSpent ? Math.min((totalSpent / nextLevelSpent) * 100, 100) : 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full md:max-w-lg md:rounded-xl rounded-t-xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up-fade">
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white">
          <h2 className="text-2xl font-black">
            {isCheckoutFlow ? "Заполните данные для доставки" : "Личный кабинет"}
          </h2>
          {!isCheckoutFlow && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg border-2 border-black shadow-brutal btn-press hover:bg-[#FFEA00] transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
          )}
        </div>

        {isCheckoutFlow && (
          <div className="px-4 py-3 bg-blue-50 border-b-2 border-black">
            <p className="text-sm text-blue-900">
              <strong>📦 Оформление заказа:</strong> Заполните имя и адрес доставки, чтобы завершить оформление
            </p>
          </div>
        )}

        {!isCheckoutFlow && (
          <div className="flex border-b-2 border-black">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 text-sm font-black transition-all ${
                activeTab === "profile"
                  ? "text-black bg-white border-b-4 border-[#9D00FF]"
                  : "text-muted-foreground hover:text-black hover:bg-white/50"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" strokeWidth={3} />
              Профиль
            </button>
            <button
              onClick={() => setActiveTab("loyalty")}
              className={`flex-1 py-4 text-sm font-black transition-all ${
                activeTab === "loyalty"
                  ? "text-black bg-white border-b-4 border-[#9D00FF]"
                  : "text-muted-foreground hover:text-black hover:bg-white/50"
              }`}
            >
              <Gift className="w-4 h-4 inline mr-2" strokeWidth={3} />
              Бонусы
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {showSuccessMessage ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center border-4 border-black shadow-brutal">
                <CheckCircle2 className="w-10 h-10 text-white stroke-[3px]" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-black mb-2">Профиль сохранен!</h3>
                <p className="text-base text-gray-700">Ваши данные успешно обновлены</p>
              </div>
            </div>
          ) : activeTab === "profile" ? (
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

              {isCheckoutFlow && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-medium text-blue-900">
                    <span className="text-red-600 font-bold">*</span> — обязательные поля для доставки
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1.5">
                  {isCheckoutFlow && <span className="text-red-600 mr-1">*</span>}
                  Ваше имя
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder=""
                  className={isCheckoutFlow && !profile.name ? 'border-red-300' : ''}
                />
                {isCheckoutFlow && !profile.name && (
                  <p className="text-xs text-red-600 mt-1">Обязательное поле</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Дополнительный телефон</h3>
                </div>
                <Input
                  value={profile.additionalPhone || ""}
                  onChange={(e) => setProfile({ ...profile, additionalPhone: e.target.value })}
                  placeholder=""
                />
                <p className="text-xs text-muted-foreground mt-1">
                  По желанию. Укажите, если хотите, чтобы курьер мог позвонить на другой номер
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Адрес доставки</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1.5">
                      {isCheckoutFlow && <span className="text-red-600 mr-1">*</span>}
                      Район
                    </label>
                    <Select
                      value={profile.district || ""}
                      onValueChange={(value) => setProfile({ ...profile, district: value })}
                    >
                      <SelectTrigger className={isCheckoutFlow && !profile.district ? 'border-red-300' : ''}>
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
                    {isCheckoutFlow && !profile.district && (
                      <p className="text-xs text-red-600 mt-1">Обязательное поле</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5">
                      {isCheckoutFlow && <span className="text-red-600 mr-1">*</span>}
                      Улица
                    </label>
                    <Input
                      value={profile.street}
                      onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                      placeholder=""
                      className={isCheckoutFlow && !profile.street ? 'border-red-300' : ''}
                    />
                    {isCheckoutFlow && !profile.street && (
                      <p className="text-xs text-red-600 mt-1">Обязательное поле</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-bold mb-1.5">
                        {isCheckoutFlow && <span className="text-red-600 mr-1">*</span>}
                        Дом
                      </label>
                      <Input
                        value={profile.building}
                        onChange={(e) => setProfile({ ...profile, building: e.target.value })}
                        placeholder=""
                        className={isCheckoutFlow && !profile.building ? 'border-red-300' : ''}
                      />
                      {isCheckoutFlow && !profile.building && (
                        <p className="text-xs text-red-600 mt-1">Обязательно</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Корпус</label>
                      <Input
                        value={profile.buildingSection || ""}
                        onChange={(e) => setProfile({ ...profile, buildingSection: e.target.value })}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Квартира</label>
                      <Input
                        value={profile.apartment}
                        onChange={(e) => setProfile({ ...profile, apartment: e.target.value })}
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Подъезд</label>
                      <Input
                        value={profile.entrance}
                        onChange={(e) => setProfile({ ...profile, entrance: e.target.value })}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Этаж</label>
                      <Input
                        value={profile.floor}
                        onChange={(e) => setProfile({ ...profile, floor: e.target.value })}
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Домофон</label>
                      <Input
                        value={profile.intercom}
                        onChange={(e) => setProfile({ ...profile, intercom: e.target.value })}
                        placeholder=""
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
              {/* Карточка уровня в brutal стиле */}
              <div
                className={`p-6 rounded-xl border-2 border-black shadow-brutal ${
                  loyaltyLevel === "gold"
                    ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                    : loyaltyLevel === "silver"
                      ? "bg-gradient-to-br from-[#C0C0C0] to-[#808080]"
                      : "bg-gradient-to-br from-[#CD7F32] to-[#8B4513]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Star
                      className="w-8 h-8 text-white drop-shadow-[2px_2px_0px_#000000]"
                      strokeWidth={3}
                    />
                    <span className="font-black text-2xl text-white drop-shadow-[2px_2px_0px_#000000]">
                      {loyaltyLevelName} уровень
                    </span>
                  </div>
                  <span className="text-xl font-black text-black bg-white px-3 py-1 rounded-lg border-2 border-black shadow-brutal">
                    {cashbackPercent}% кэшбэк
                  </span>
                </div>

                {nextLevelSpent && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-white drop-shadow-[1px_1px_0px_#000000]">До следующего уровня</span>
                      <span className="font-black text-white drop-shadow-[1px_1px_0px_#000000]">
                        {remainingToNextLevel.toLocaleString()} / {nextLevelSpent.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="h-3 bg-white rounded-lg overflow-hidden border-2 border-black">
                      <div
                        className={`h-full transition-all ${
                          loyaltyLevel === "silver" 
                            ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500]" 
                            : "bg-gradient-to-r from-[#C0C0C0] to-[#808080]"
                        }`}
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Карточка баллов в brutal стиле */}
              <div className="p-6 bg-gradient-to-br from-[#9D00FF] to-[#7000CC] rounded-xl border-2 border-black shadow-brutal">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-black shadow-brutal">
                      <Coins className="w-8 h-8 text-[#9D00FF]" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/80">Ваши баллы</p>
                      <p className="text-4xl font-black text-white drop-shadow-[2px_2px_0px_#000000]">
                        {loyaltyPoints.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right bg-white px-4 py-2 rounded-lg border-2 border-black">
                    <p className="text-sm font-black text-[#9D00FF]">= {loyaltyPoints.toLocaleString()} ₽</p>
                    <p className="text-xs font-bold text-black">1 балл = 1 ₽</p>
                  </div>
                </div>
              </div>

              {/* Как работает программа */}
              <div className="p-6 bg-[#FFEA00] rounded-xl border-2 border-black shadow-brutal">
                <h4 className="font-black text-lg mb-4 text-black">Как работает программа лояльности</h4>
                <ul className="space-y-3 text-sm font-bold text-black">
                  <li className="flex items-start gap-3">
                    <span className="text-[#9D00FF] font-black text-lg">1.</span>
                    Получайте {cashbackPercent}% баллами с каждого заказа
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#9D00FF] font-black text-lg">2.</span>
                    Оплачивайте до 50% заказа баллами
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#9D00FF] font-black text-lg">3.</span>
                    Повышайте уровень и получайте больше кэшбэка
                  </li>
                </ul>
              </div>

              {/* Уровни программы */}
              <div className="p-6 bg-white rounded-xl border-2 border-black shadow-brutal">
                <h4 className="font-black text-lg mb-4 text-black">Уровни программы</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#CD7F32] border-2 border-black shrink-0" />
                    <span className="text-sm font-black min-w-[110px] text-black">Бронзовый</span>
                    <span className="text-sm font-bold text-black">3% кэшбэк</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#C0C0C0] border-2 border-black shrink-0" />
                    <span className="text-sm font-black min-w-[110px] text-black">Серебряный</span>
                    <span className="text-sm font-bold text-black whitespace-nowrap">от 20 000 ₽ · 5%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#FFD700] border-2 border-black shrink-0" />
                    <span className="text-sm font-black min-w-[110px] text-black">Золотой</span>
                    <span className="text-sm font-bold text-black whitespace-nowrap">от 50 000 ₽ · 7%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t-2 border-black p-4">
          <button
            onClick={handleSave}
            disabled={!isCheckoutFlow && !hasChanges()}
            className={`w-full py-4 px-6 font-black text-lg rounded-xl border-2 border-black shadow-brutal btn-press transition-all ${
              !isCheckoutFlow && !hasChanges()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                : "bg-[#FFEA00] hover:bg-[#FFF033] text-black"
            }`}
          >
            {isCheckoutFlow ? (
              <>
                <CheckCircle2 className="w-5 h-5 inline mr-2" strokeWidth={3} />
                Оформить заказ
              </>
            ) : (
              <>
                <Save className="w-5 h-5 inline mr-2" strokeWidth={3} />
                Сохранить
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

