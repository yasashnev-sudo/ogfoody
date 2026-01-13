"use client"

import { CheckCircle2, Coins, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessOrderDialogProps {
  open: boolean
  onClose: () => void
  loyaltyPointsEarned?: number
  loyaltyPointsUsed?: number
  loyaltyPointsStatus?: "pending" | "earned"
  loyaltyPointsMessage?: string
}

export function SuccessOrderDialog({ open, onClose, loyaltyPointsEarned, loyaltyPointsUsed, loyaltyPointsStatus, loyaltyPointsMessage }: SuccessOrderDialogProps) {
  // Не рендерим компонент если диалог закрыт
  if (!open) return null
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center border-4 border-black shadow-brutal">
              <CheckCircle2 className="w-10 h-10 text-white stroke-[3px]" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-black mb-2 text-center">
            Спасибо за ваш заказ!
          </DialogTitle>
          <div className="text-base text-gray-700 leading-relaxed">
            {(loyaltyPointsEarned && loyaltyPointsEarned > 0) || (loyaltyPointsUsed && loyaltyPointsUsed > 0) ? (
              <div className="space-y-3 flex flex-col items-center">
                <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/30 w-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Coins className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Списанные баллы */}
                    {/* ✅ ИСПРАВЛЕНО 2026-01-13: Показываем только если баллы действительно были списаны (не 0 и не undefined) */}
                    {loyaltyPointsUsed !== undefined && loyaltyPointsUsed !== null && loyaltyPointsUsed > 0 && (
                      <div className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-3">
                        <div className="text-center">
                          <p className="text-xs text-red-700 mb-1 font-semibold">Списано</p>
                          <p className="text-2xl font-black text-red-600">-{loyaltyPointsUsed}</p>
                          <p className="text-xs text-red-600 mt-1">баллов</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Начисленные баллы */}
                    {loyaltyPointsEarned && loyaltyPointsEarned > 0 && (
                      <div className="w-full">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-1">
                            {loyaltyPointsStatus === 'pending' ? 'К начислению' : 'Начислено'}
                          </p>
                          <p className="text-3xl font-black text-primary">+{loyaltyPointsEarned}</p>
                          <p className="text-sm text-muted-foreground mt-1">баллов</p>
                          
                          {loyaltyPointsStatus === 'pending' && (
                            <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                              <div className="flex gap-2 items-center justify-center text-center">
                                <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <p className="text-sm text-blue-900">
                                  Баллы будут начислены на следующий день после доставки
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto min-w-[120px] bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black font-black shadow-brutal brutal-hover"
          >
            Отлично!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

