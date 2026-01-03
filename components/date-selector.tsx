"use client"

import { cn } from "@/lib/utils"

interface DateSelectorProps {
  selectedDate: number
  onSelectDate: (date: number) => void
}

export function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const dates = [
    { day: 1, weekday: "ПН", date: "20.01" },
    { day: 2, weekday: "ВТ", date: "21.01" },
    { day: 3, weekday: "СР", date: "22.01" },
    { day: 4, weekday: "ЧТ", date: "23.01" },
    { day: 5, weekday: "ПТ", date: "24.01" },
    { day: 6, weekday: "СБ", date: "25.01", disabled: true },
    { day: 7, weekday: "ВС", date: "26.01" },
  ]

  return (
    <div className="px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((item) => (
          <button
            key={item.day}
            onClick={() => !item.disabled && onSelectDate(item.day)}
            disabled={item.disabled}
            className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all",
              selectedDate === item.day && !item.disabled
                ? "bg-primary border-primary text-primary-foreground shadow-md"
                : item.disabled
                  ? "bg-muted border-border text-muted-foreground opacity-50 cursor-not-allowed"
                  : "bg-card border-border text-foreground hover:border-primary/50",
            )}
          >
            <span className="text-xs font-medium mb-0.5">{item.weekday}</span>
            <span className="text-sm font-semibold">{item.date}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
