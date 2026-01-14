"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface CancelPaymentDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}

export function CancelPaymentDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}: CancelPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center border-4 border-black shadow-brutal">
              <AlertTriangle className="w-8 h-8 text-yellow-600 stroke-[3px]" />
            </div>
          </div>
          <DialogTitle className="text-xl font-black text-black mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4 gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 sm:flex-none min-w-[120px] bg-white hover:bg-gray-50 text-black border-2 border-black font-black shadow-brutal brutal-hover"
          >
            Нет
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 sm:flex-none min-w-[120px] bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black font-black shadow-brutal brutal-hover"
          >
            Да
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
