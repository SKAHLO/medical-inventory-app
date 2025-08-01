"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StockTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onUpdateStock: (itemId: number, quantity: number, type: string, notes: string) => void
}

export function StockTransactionDialog({ open, onOpenChange, item, onUpdateStock }: StockTransactionDialogProps) {
  const [transactionType, setTransactionType] = useState("in")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!item || !quantity) return

    onUpdateStock(Number(item.id), Number.parseInt(quantity), transactionType, notes)
    setQuantity("")
    setNotes("")
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 text-xl font-bold">Stock Transaction</DialogTitle>
          <DialogDescription className="text-slate-600">Update stock levels for {item.name}</DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-600">{item.category}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">
                Current: {item.quantity} {item.unit}
              </p>
              <p className="text-sm text-slate-600">
                Min: {item.min_stock} {item.unit}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label className="text-slate-700 font-medium">Transaction Type</Label>
            <RadioGroup value={transactionType} onValueChange={setTransactionType}>
              <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="in" id="stock-in" />
                <Label htmlFor="stock-in" className="flex items-center cursor-pointer text-slate-700">
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                  Stock In (Add inventory)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg hover:bg-red-50 transition-colors">
                <RadioGroupItem value="out" id="stock-out" />
                <Label htmlFor="stock-out" className="flex items-center cursor-pointer text-slate-700">
                  <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                  Stock Out (Remove inventory)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-slate-700 font-medium">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Enter quantity in ${item.unit}`}
              required
              min="1"
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-700 font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this transaction..."
              rows={3}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {transactionType === "out" && Number.parseInt(quantity) > item.quantity && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                Warning: This will result in negative stock. Current stock: {item.quantity} {item.unit}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                transactionType === "in"
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
              }
            >
              {transactionType === "in" ? "Add Stock" : "Remove Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
