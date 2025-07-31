"use client"

import { useEffect, useState } from "react"
import { InventoryList } from "@/components/inventory-list"
import { toast } from "sonner" // or your preferred toast library

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch inventory items on load
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/items")
        const data = await res.json()
        setItems(data)
      } catch (err) {
        console.error("Error fetching items", err)
        toast.error("Failed to load inventory.")
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleStockAction = async (item: any, action: string) => {
    const newQuantity = action === "in" ? item.quantity + 1 : item.quantity - 1

    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item, quantity: newQuantity }),
      })

      if (!res.ok) throw new Error("Update failed")

      const updatedItem = await res.json()
      setItems((prev) =>
        prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
      )

      toast.success(`Stock ${action === "in" ? "increased" : "decreased"} successfully!`)
    } catch (err) {
      console.error(err)
      toast.error("Stock update failed.")
    }
  }

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-center text-slate-500">Loading inventory...</p>
      ) : (
        <InventoryList items={items} onStockAction={handleStockAction} />
      )}
    </div>
  )
}
