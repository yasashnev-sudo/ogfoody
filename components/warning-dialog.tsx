"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react"

interface WarningDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  buttonText?: string
  variant?: "warning" | "error" | "info"
}

export function WarningDialog({
  open,
  onClose,
  title,
  description,
  buttonText = "Закрыть",
  variant = "warning",
}: WarningDialogProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "error":
        return {
          iconBg: "bg-white",
          iconColor: "text-red-600",
          borderColor: "border-black",
          Icon: AlertTriangle,
        }
      case "info":
        return {
          iconBg: "bg-white",
          iconColor: "text-[#9D00FF]",
          borderColor: "border-black",
          Icon: CheckCircle2,
        }
      default: // warning
        return {
          iconBg: "bg-white",
          iconColor: "text-yellow-600",
          borderColor: "border-black",
          Icon: Info,
        }
    }
  }

  const styles = getVariantStyles()
  const IconComponent = styles.Icon

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-lg ${styles.iconBg} flex items-center justify-center border-4 border-black shadow-brutal`}>
              <IconComponent className={`w-8 h-8 ${styles.iconColor} stroke-[3px]`} />
            </div>
          </div>
          <DialogTitle className="text-xl font-black text-black mb-2">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto min-w-[120px] bg-[#FFEA00] hover:bg-[#FFF033] text-black border-2 border-black font-black shadow-brutal brutal-hover"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

