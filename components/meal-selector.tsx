"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Info, Plus, Check, UtensilsCrossed, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Meal, PortionSize, getMealPrice, getMealWeight } from "@/lib/types"
import { MealDetailModal } from "./meal-detail-modal"
import { MealGridSkeleton } from "@/components/meal-card-skeleton"

const adaptGarnishToMeal = (garnish: any): Meal => {
  return {
    ...garnish,
    ingredients: garnish.ingredients || "",
    description: garnish.description || "",
    prices: garnish.prices,
    weights: garnish.weights,
  } as Meal
}

// Define a local type that covers all possibilities
export type CombinedSelection = {
  breakfast?: Meal | null
  salad?: Meal | null
  soup?: Meal | null
  main?: Meal | null
}

interface MealSelectorProps {
  personNumber: number
  dayNumber: number
  selectedMeals: CombinedSelection
  onUpdate: (selection: CombinedSelection) => void
  mealsData: Record<string, Meal[]>
  headerPrefix?: string
  activeSectionId?: string | null
  onSectionChange?: (sectionId: string | null) => void
  instanceId?: string
  onMealSelected?: () => void
  disabled?: boolean
  onBlockedAction?: () => void
  isLoading?: boolean
}

const PORTION_LABELS: Record<PortionSize, string> = {
  single: "Стандартная",
  medium: "Двойная",
  large: "Тройная",
}

const CompactMealCard = ({
  meal,
  isSelected,
  onSelect,
  selectedPortion = "single",
  onPortionChange,
  disabled = false,
  onImageClick,
  isHighlighted = false,
  onBlockedAction,
}: {
  meal: Meal
  isSelected: boolean
  onSelect: (portion: PortionSize) => void
  selectedPortion?: PortionSize
  onPortionChange?: (size: PortionSize) => void
  disabled?: boolean
  onImageClick?: () => void
  isHighlighted?: boolean
  onBlockedAction?: () => void
}) => {
  const [showPortions, setShowPortions] = useState(false)
  const [currentPortion, setCurrentPortion] = useState<PortionSize>(selectedPortion)
  const hasMultiplePortions = (meal.prices?.medium && meal.prices.medium > 0) || (meal.prices?.large && meal.prices.large > 0)
  const price = getMealPrice(meal, currentPortion)
  const weight = getMealWeight(meal, currentPortion)

  useEffect(() => {
    setCurrentPortion(selectedPortion)
  }, [selectedPortion])

  const handlePortionSelect = (portion: PortionSize) => {
    setCurrentPortion(portion)
    onPortionChange?.(portion)
    setShowPortions(false)
  }

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl transition-all flex flex-col h-full group overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-brutal brutal-hover",
        isSelected ? "ring-4 ring-primary" : "",
        isHighlighted && "ring-4 ring-primary z-20",
        disabled && "opacity-50",
      )}
      style={{ 
        scrollMarginTop: '100px',
        transition: 'all 0.4s ease-out'
      }}
    >
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent w-full skew-x-[-20deg]"
          />
        )}
      </AnimatePresence>
      <div 
        className="relative aspect-square w-full cursor-pointer bg-white rounded-t-xl overflow-hidden" 
        onClick={() => onImageClick?.()}
      >
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <UtensilsCrossed className="w-8 h-8 opacity-20" />
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onImageClick?.()
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100 brutal-hover"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="p-1.5 sm:p-4 flex flex-col flex-1">
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
          <h4 className="font-semibold text-xs sm:text-base leading-tight line-clamp-2" title={meal.name}>
            {meal.name}
          </h4>
        </div>

        <div className="mt-auto space-y-1.5 sm:space-y-3">
          {hasMultiplePortions ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPortions(!showPortions)
                }}
                className={cn(
                  "w-full flex items-center justify-between bg-white border-2 border-black hover:bg-[#FFEA00] text-xs sm:text-sm px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg transition-colors font-bold shadow-[2px_2px_0px_0px_#000000] sm:shadow-brutal brutal-hover",
                  showPortions && "bg-[#FFEA00]",
                )}
              >
                <span className="font-semibold flex items-center gap-1 sm:gap-1.5 text-foreground text-xs sm:text-sm">
                  {PORTION_LABELS[currentPortion]}
                  <ChevronDown className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform", showPortions && "rotate-180")} />
                </span>
              </button>

              {showPortions && (
                <div className="absolute bottom-full left-0 mb-1 w-full bg-white border-2 border-black rounded-xl shadow-brutal z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                  {(["single", "medium", "large"] as PortionSize[]).map((p) => {
                    if (p !== "single" && (!meal.prices?.[p] || meal.prices[p] === 0)) return null
                    return (
                      <button
                        key={p}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePortionSelect(p)
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors font-bold brutal-hover",
                          currentPortion === p
                            ? "bg-[#9D00FF] text-white"
                            : "hover:bg-[#FFEA00]/20 text-black",
                        )}
                      >
                        <span>{PORTION_LABELS[p]}</span>
                        {currentPortion === p && <Check className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : null}

          <div className="flex items-end justify-between pt-0.5 sm:pt-1 gap-1.5 sm:gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-xs text-muted-foreground font-medium mb-0.5">{weight} г</span>
              <span className="font-bold text-sm sm:text-lg leading-none">{price} ₽</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                if (disabled && onBlockedAction) {
                  onBlockedAction()
                  return
                }
                onSelect(currentPortion)
              }}
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_#000000] sm:shadow-brutal shrink-0 border-2 border-black brutal-hover",
                isSelected
                  ? "bg-[#9D00FF] text-white"
                  : "bg-white text-black hover:bg-[#FFEA00]",
              )}
            >
              {isSelected ? <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MealSectionComponent = ({
  title,
  meals,
  selectedMeal,
  onMealSelect,
  colorClass,
  isOpen,
  onToggle,
  id,
  headerPrefix,
  extraHeaderContent,
  highlightedMealId,
  disabled = false,
  onBlockedAction,
}: {
  title: string
  meals: Meal[]
  selectedMeal: (Meal & { portion?: PortionSize }) | null | undefined
  onMealSelect: (meal: Meal | null, portion?: PortionSize) => void
  colorClass: string
  isOpen: boolean
  onToggle: () => void
  id: string
  headerPrefix?: string
  extraHeaderContent?: React.ReactNode
  highlightedMealId?: string | null
  disabled?: boolean
  onBlockedAction?: () => void
}) => {
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <div 
      className="bg-white rounded-lg border-2 border-black overflow-visible shadow-brutal" 
      id={id}
      style={{ scrollMarginTop: '10px' }}
    >
      <div className={cn(
          "w-full p-2 sm:p-4 select-none cursor-pointer transition-colors sticky top-0 z-30 bg-white",
          isOpen ? "border-b-2 border-black" : "hover:bg-[#FFEA00]",
          "first:rounded-t-lg rounded-lg",
          isOpen && "rounded-b-none",
          "active:translate-x-[1px] active:translate-y-[1px]"
        )}
        onClick={handleToggle}
        role="button"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-2 self-stretch rounded-sm shrink-0 border-2 border-black", colorClass)} />
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {headerPrefix && isOpen && <p className="text-[10px] uppercase tracking-wider text-black/70 font-black mb-0.5">{headerPrefix}</p>}
            <div className="flex items-baseline gap-2">
              <h3 className="font-black text-base leading-tight text-black">{title}</h3>
              {!isOpen && selectedMeal && (
                <span className="text-[10px] text-black/70 font-black whitespace-nowrap">
                  {getMealWeight(selectedMeal, selectedMeal.portion || "single")} г
                </span>
              )}
            </div>
            
            {!isOpen && (
              selectedMeal ? (
                <div className="mt-1 pr-2">
                  <p className="text-sm text-black/70 line-clamp-2 leading-tight font-medium">
                    {selectedMeal.name}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-black/50 mt-0.5 font-medium">Не выбрано</p>
              )
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
              {!isOpen && selectedMeal && (
                 <span className="text-sm font-black leading-none bg-[#9D00FF] text-white px-2 py-1.5 rounded-lg border-2 border-black shadow-brutal">
                    {getMealPrice(selectedMeal, selectedMeal.portion || "single")} ₽
                 </span>
              )}
              
              {extraHeaderContent && (
                 <div 
                   className="flex items-center"
                   onClick={(e) => e.stopPropagation()}
                 >
                    {extraHeaderContent}
                 </div>
              )}
              
              <div className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black hover:bg-[#FFEA00] transition-colors bg-white shadow-[2px_2px_0px_0px_#000000] sm:shadow-brutal brutal-hover cursor-pointer">
                <ChevronDown className={cn("w-5 h-5 text-black transition-transform duration-200 stroke-[2.5px]", isOpen && "rotate-180")} />
              </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-1.5 py-1.5 sm:p-4 pt-0 border-t-2 border-black">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1.5 sm:pt-4">
              {meals.map((meal) => (
                <div key={meal.id} className="h-full" id={`${id}-meal-${meal.id}`}>
                  <CompactMealCard
                    meal={meal}
                    isSelected={selectedMeal?.id === meal.id}
                    isHighlighted={highlightedMealId === String(meal.id)}
                    selectedPortion={selectedMeal?.id === meal.id ? selectedMeal.portion : "single"}
                    onPortionChange={(p) => {
                      if (selectedMeal?.id === meal.id) onMealSelect(meal, p)
                    }}
                    onSelect={(p) => {
                      if (selectedMeal?.id === meal.id) onMealSelect(null)
                      else onMealSelect(meal, p)
                    }}
                    onImageClick={() => setDetailMeal(meal)}
                    disabled={disabled}
                    onBlockedAction={onBlockedAction}
                  />
                </div>
              ))}
            </div>
        </div>
      )}
      
      {detailMeal && (
        <MealDetailModal
            meal={detailMeal}
            isOpen={!!detailMeal}
            onClose={() => setDetailMeal(null)}
            selectedPortion={selectedMeal?.id === detailMeal.id ? selectedMeal?.portion : "single"}
            onSelect={(m, p) => {
                if (disabled && onBlockedAction) {
                  onBlockedAction()
                  setDetailMeal(null)
                  return
                }
                onMealSelect(m, p)
                setDetailMeal(null)
            }}
        />
      )}
    </div>
  )
}

export function MealSelector({
  personNumber,
  dayNumber,
  selectedMeals = {}, 
  onUpdate,
  mealsData,
  headerPrefix,
  activeSectionId,
  onSectionChange,
  instanceId = "default",
  onMealSelected,
  disabled = false,
  onBlockedAction,
  isLoading = false,
}: MealSelectorProps) {
  const [internalOpenSection, setInternalOpenSection] = useState<string | null>(null)
  const lastActiveId = useRef<string | null>(null)
  const [highlightedMealId, setHighlightedMealId] = useState<string | null>(null)
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null)
  const type = "daily"
  
  const isControlled = activeSectionId !== undefined
  const openSection = isControlled ? null : internalOpenSection 

  const getSectionId = (section: string) => `section-${section}-${personNumber}-${dayNumber}-${type}-${instanceId}`

  const isSectionOpen = (section: string) => {
    if (isControlled) {
      return activeSectionId === getSectionId(section)
    }
    return internalOpenSection === section
  }

  const setSectionOpen = (section: string | null) => {
    if (isControlled && onSectionChange) {
      onSectionChange(section ? getSectionId(section) : null)
    } else {
      setInternalOpenSection(section)
    }
  }

  // Централизованная прокрутка
  useEffect(() => {
    const currentId = isControlled ? activeSectionId : internalOpenSection;
    
    // Определяем, что нужно прокрутить
    const targetId = currentId || lastActiveId.current;
    
    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      
      lastActiveId.current = currentId;
      return () => clearTimeout(timer);
    }
  }, [activeSectionId, internalOpenSection, isControlled]);
  
  const safeMealsData = mealsData || {}

  const breakfast = safeMealsData["breakfast"] || []
  const salads = safeMealsData["salad"] || []
  const soups = safeMealsData["soup"] || []
  const mains = safeMealsData["main"] || []
  const garnishes = safeMealsData["garnish"] || []
  
  const [isGarnishVisible, setIsGarnishVisible] = useState(false)

  // Sync prop changes
  useEffect(() => {
    if (!selectedMeals) return;

    if (selectedMeals.main?.needsGarnish && !selectedMeals.main?.garnish) {
        setIsGarnishVisible(true)
    } else if (selectedMeals.main?.garnish) {
        setIsGarnishVisible(true)
    }
  }, [selectedMeals])

  const toggleSection = (section: string) => {
    // Разрешаем открытие секций даже для заблокированных заказов (только просмотр)
    const isOpen = isSectionOpen(section)
    setSectionOpen(isOpen ? null : section)
  }

  const handleMainSelect = (selectedMain: Meal | null, currentSelection: CombinedSelection) => {
     if (!selectedMain) {
         onUpdate({ ...currentSelection, main: null })
         setIsGarnishVisible(false)
         return
     }

     if (selectedMain.needsGarnish && garnishes.length > 0) {
        onUpdate({ ...currentSelection, main: { ...selectedMain, portion: "single", garnish: null } })
        setIsGarnishVisible(true)
     } else {
        setIsGarnishVisible(false)
        onUpdate({ ...currentSelection, main: { ...selectedMain, portion: "single", garnish: null } })
     }
  }

  const handleAutoSelect = (category: 'breakfast' | 'salad' | 'soup' | 'main') => {
      if (disabled && onBlockedAction) {
        onBlockedAction()
        return
      }
      // Force scroll reset by clearing active element focus if needed
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

      let list: Meal[] = []
      if (category === 'breakfast') list = breakfast
      else if (category === 'salad') list = salads
      else if (category === 'soup') list = soups
      else if (category === 'main') list = mains

      // Блюда уже отфильтрованы по неделе в API, просто берем случайное
      if (list.length > 0) {
          const random = list[Math.floor(Math.random() * list.length)]
          
          if (category === 'main') {
              const needsGarnish = random.needsGarnish && garnishes.length > 0
              const wasClosed = !isSectionOpen('main')

              onUpdate({
                  ...selectedMeals,
                  main: { ...random, portion: "single", garnish: null }
              })

              if (wasClosed) setSectionOpen('main');

              setTimeout(() => {
                  const sectionId = getSectionId(category)
                  const elementId = `${sectionId}-meal-${random.id}`
                  const el = document.getElementById(elementId)
                  if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      
                      // Magic highlight after scroll is mostly done
                      setTimeout(() => {
                          setHighlightedMealId(String(random.id))
                          setTimeout(() => setHighlightedMealId(null), 1500)
                      }, 600)
                  }
              }, 400)

              if (needsGarnish) {
                  setTimeout(() => {
                      setSectionOpen("garnish")
                  }, wasClosed ? 3500 : 2500)
              } else {
                  setIsGarnishVisible(false)
                  setSectionOpen(null)
                  if (onMealSelected) {
                      onMealSelected()
                  }
              }
          } else {
              const wasClosed = !isSectionOpen(category)
              onUpdate({
                  ...selectedMeals,
                  [category]: { ...random, portion: "single" }
              })

              if (wasClosed) setSectionOpen(category);
              
              setTimeout(() => {
                  const sectionId = getSectionId(category)
                  const elementId = `${sectionId}-meal-${random.id}`
                  const el = document.getElementById(elementId)
                  if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      
                      // Magic highlight
                      setTimeout(() => {
                        setHighlightedMealId(String(random.id))
                        setTimeout(() => setHighlightedMealId(null), 1500)
                      }, 600)
                  }
              }, 400)

              if (onMealSelected) onMealSelected()
          }
      }
  }

  const handleAutoSelectGarnish = () => {
    if (disabled && onBlockedAction) {
      onBlockedAction()
      return
    }
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    
    // Гарниры уже отфильтрованы по неделе в API
    if (garnishes.length > 0) {
      const randomGarnish = garnishes[Math.floor(Math.random() * garnishes.length)]
      if (selectedMeals.main) {
        onUpdate({
          ...selectedMeals,
          main: { ...selectedMeals.main, garnish: { ...adaptGarnishToMeal(randomGarnish), portion: "single" } },
        })
        
        const scrollGarnish = () => {
            const sectionId = garnishSectionId
            const elementId = `${sectionId}-inner-meal-${randomGarnish.id}`
            const el = document.getElementById(elementId)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        };

        setTimeout(() => {
            scrollGarnish()
            setTimeout(() => {
              setHighlightedMealId(String(randomGarnish.id))
              setTimeout(() => setHighlightedMealId(null), 1500)
            }, 600)
        }, 400);

        if (onMealSelected) {
          onMealSelected()
        } else {
          setSectionOpen(null)
        }
      }
    }
  }

  const garnishSectionId = `section-garnish-${personNumber}-${dayNumber}-${type}-${instanceId}`

  const AutoButton = ({ onClick }: { onClick: () => void }) => (
      <div className="py-2">
        <Button 
          onClick={(e) => { 
            if (disabled && onBlockedAction) {
              onBlockedAction()
              return
            }
            e.stopPropagation(); 
            e.preventDefault();
            onClick(); 
          }} 
          className="h-9 w-9 rounded-lg p-0 flex items-center justify-center bg-white border-2 border-black hover:bg-[#FFEA00] text-black transition-colors shadow-[2px_2px_0px_0px_#000000] sm:shadow-brutal brutal-hover"
          title="Выбрать случайно"
        >
          <Wand2 className="w-4 h-4 stroke-[2.5px]" />
        </Button>
      </div>
  )

  // Показываем skeleton при загрузке
  if (isLoading) {
    return (
      <div className="space-y-3 pb-4">
        <MealGridSkeleton count={3} className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4" />
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-4">
      {breakfast.length > 0 && (
        <MealSectionComponent
          id={getSectionId('breakfast')}
          title="Завтрак"
          meals={breakfast}
          selectedMeal={selectedMeals.breakfast}
          onMealSelect={(selected, portion) => {
            if (disabled && onBlockedAction) {
              onBlockedAction()
              return
            }
            onUpdate({ ...selectedMeals, breakfast: selected ? { ...selected, portion: portion || "single" } : null })
            if (selected && onMealSelected) onMealSelected()
          }}
          colorClass="bg-[#FFEA00]"
          isOpen={isSectionOpen("breakfast")}
          onToggle={() => toggleSection("breakfast")}
          headerPrefix={headerPrefix}
          extraHeaderContent={<AutoButton onClick={() => handleAutoSelect('breakfast')} />}
          highlightedMealId={highlightedMealId}
          disabled={disabled}
          onBlockedAction={onBlockedAction}
        />
      )}

      {salads.length > 0 && (
        <MealSectionComponent
          id={getSectionId('salad')}
          title="Салат"
          meals={salads}
          selectedMeal={selectedMeals.salad}
          onMealSelect={(selected, portion) => {
            if (disabled && onBlockedAction) {
              onBlockedAction()
              return
            }
            onUpdate({ ...selectedMeals, salad: selected ? { ...selected, portion: portion || "single" } : null })
            if (selected && onMealSelected) onMealSelected()
          }}
          colorClass="bg-green-500"
          isOpen={isSectionOpen("salad")}
          onToggle={() => toggleSection("salad")}
          headerPrefix={headerPrefix}
          extraHeaderContent={<AutoButton onClick={() => handleAutoSelect('salad')} />}
          highlightedMealId={highlightedMealId}
          disabled={disabled}
          onBlockedAction={onBlockedAction}
        />
      )}

      {soups.length > 0 && (
        <MealSectionComponent
          id={getSectionId('soup')}
          title="Суп"
          meals={soups}
          selectedMeal={selectedMeals.soup}
          onMealSelect={(selected, portion) => {
            if (disabled && onBlockedAction) {
              onBlockedAction()
              return
            }
            onUpdate({ ...selectedMeals, soup: selected ? { ...selected, portion: portion || "single" } : null })
            if (selected && onMealSelected) onMealSelected()
          }}
          colorClass="bg-orange-400"
          isOpen={isSectionOpen("soup")}
          onToggle={() => toggleSection("soup")}
          headerPrefix={headerPrefix}
          extraHeaderContent={<AutoButton onClick={() => handleAutoSelect('soup')} />}
          highlightedMealId={highlightedMealId}
          disabled={disabled}
          onBlockedAction={onBlockedAction}
        />
      )}

      {mains.length > 0 && (
        <MealSectionComponent
          id={getSectionId('main')}
          title="Горячее"
          meals={mains}
          selectedMeal={selectedMeals.main}
          onMealSelect={(selected, portion) => {
            if (disabled && onBlockedAction) {
              onBlockedAction()
              return
            }
            if (!selected) {
              handleMainSelect(null, selectedMeals)
            } else {
              if (selectedMeals.main?.id === selected.id) {
                onUpdate({
                  ...selectedMeals,
                  main: { ...selectedMeals.main, portion: portion || "single" },
                })
              } else {
                handleMainSelect(selected, selectedMeals)
                if (!selected.needsGarnish && onMealSelected) {
                   onMealSelected()
                }
              }
            }
          }}
          colorClass="bg-red-500"
          isOpen={isSectionOpen("main")}
          onToggle={() => toggleSection("main")}
          headerPrefix={headerPrefix}
          extraHeaderContent={<AutoButton onClick={() => handleAutoSelect('main')} />}
          highlightedMealId={highlightedMealId}
          disabled={disabled}
          onBlockedAction={onBlockedAction}
        />
      )}

      {isGarnishVisible && garnishes.length > 0 && (
        <div id={garnishSectionId}>
          <div className="mt-3">
            <MealSectionComponent
              id={`${garnishSectionId}-inner`}
                title="Выберите гарнир"
                meals={garnishes.map(adaptGarnishToMeal)}
                selectedMeal={
                  selectedMeals.main?.garnish
                    ? { ...adaptGarnishToMeal(selectedMeals.main.garnish), portion: selectedMeals.main.garnish.portion }
                    : null
                }
                colorClass="bg-orange-500"
                isOpen={isSectionOpen("garnish")}
                onToggle={() => toggleSection("garnish")}
                extraHeaderContent={<AutoButton onClick={handleAutoSelectGarnish} />}
                onMealSelect={(meal, portion) => {
                  if (disabled && onBlockedAction) {
                    onBlockedAction()
                    return
                  }
                  if (selectedMeals.main) {
                    if (meal) {
                      onUpdate({
                        ...selectedMeals,
                        main: {
                          ...selectedMeals.main,
                          garnish: { ...meal, portion: portion || "single" } as any, 
                        },
                      })
                      if (onMealSelected) {
                        onMealSelected()
                      } else {
                        setSectionOpen(null)
                      }
                    } else {
                      onUpdate({
                        ...selectedMeals,
                        main: { ...selectedMeals.main, garnish: null },
                      })
                    }
                  }
                }}
                highlightedMealId={highlightedMealId}
                disabled={disabled}
                onBlockedAction={onBlockedAction}
              />
            </div>
          </div>
        )}

      {detailMeal && (
        <MealDetailModal
          meal={detailMeal}
          isOpen={!!detailMeal}
          onClose={() => setDetailMeal(null)}
          selectedPortion="single"
          onSelect={(m, p) => {
            setDetailMeal(null)
          }}
        />
      )}
    </div>
  )
}
