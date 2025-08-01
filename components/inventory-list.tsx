"use client"

import { useState } from "react"
import { MoreHorizontal, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InventoryListProps {
  items: any[]
  onStockAction: (item: any, action: string) => void
}

export function InventoryList({ items, onStockAction }: InventoryListProps) {
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStockStatus = (item) => {
    if (parseInt(item.quantity) === 0)
      return { status: "out", color: "bg-red-100 text-red-800 border-red-200", label: "Out of Stock" }
    if (parseInt(item.quantity) <= parseInt(item.min_stock))
      return { status: "low", color: "bg-amber-100 text-amber-800 border-amber-200", label: "Low Stock" }
    return { status: "good", color: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "In Stock" }
  }

  const getCategoryColor = (category) => {
    const colors = {
      Antibiotics: "bg-purple-100 text-purple-800 border-purple-200",
      "Pain Relief": "bg-rose-100 text-rose-800 border-rose-200",
      Vitamins: "bg-orange-100 text-orange-800 border-orange-200",
      "First Aid": "bg-teal-100 text-teal-800 border-teal-200",
      Equipment: "bg-slate-100 text-slate-800 border-slate-200",
    }
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200"
  }

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <CardTitle className="text-slate-900 text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5 text-slate-600" />
          Inventory Items
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 py-4">Item Details</TableHead>
                <TableHead className="font-semibold text-slate-700">Category</TableHead>
                <TableHead className="font-semibold text-slate-700">Stock</TableHead>
                <TableHead className="font-semibold text-slate-700">Price</TableHead>
                <TableHead className="font-semibold text-slate-700">Supplier</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                const stockStatus = getStockStatus(item)
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 text-base">{item.name}</p>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        {item.batchNumber && <p className="text-xs text-slate-500">Batch: {item.batchNumber}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(item.category)} border font-medium`}>{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-xs text-slate-500">
                          Min: {item.minStock} {item.unit}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-900">${parseFloat(item.price).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">per {item.unit}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-slate-900 font-medium">{item.supplier}</p>
                      <p className="text-xs text-slate-500">{item.location}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} border font-medium`}>
                        {stockStatus.status === "low" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200 shadow-lg">
                          <DropdownMenuItem onClick={() => onStockAction(item, "in")} className="hover:bg-emerald-50">
                            <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                            Stock In
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStockAction(item, "out")} className="hover:bg-red-50">
                            <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                            Stock Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
