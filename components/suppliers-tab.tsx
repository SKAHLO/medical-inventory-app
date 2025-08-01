"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Star, Plus } from "lucide-react"
import { AddSupplierDialog } from "@/components/add-supplier-dialog"

interface SuppliersTabProps {
  suppliers: any[]
  onAddSupplier: (supplier: any) => void
}

export function SuppliersTab({ suppliers, onAddSupplier }: SuppliersTabProps) {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suppliers</h2>
          <p className="text-slate-600">Manage your supplier relationships</p>
        </div>
        <Button
          onClick={() => setIsAddSupplierOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <Card
          key={supplier.id}
          className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-slate-900 text-lg font-bold">{supplier.name}</CardTitle>
                <Badge className="mt-2 bg-emerald-100 text-emerald-800 border-emerald-200 border font-medium">
                  {supplier.category}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 font-medium">Rating</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-lg font-bold text-slate-900 ml-1">{supplier.rating}</span>
                  <span className="text-slate-500 ml-1">/5</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-700">
                <div className="p-1.5 bg-slate-100 rounded-lg mr-3">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                </div>
                {supplier.phone}
              </div>
              <div className="flex items-center text-sm text-slate-700">
                <div className="p-1.5 bg-slate-100 rounded-lg mr-3">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                </div>
                {supplier.email}
              </div>
              <div className="flex items-start text-sm text-slate-700">
                <div className="p-1.5 bg-slate-100 rounded-lg mr-3 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <span>{supplier.address}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Products Supplied</span>
                <span className="font-bold text-slate-900">{supplier.productsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-600 font-medium">Last Order</span>
                <span className="font-bold text-slate-900">{supplier.lastOrder}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      <AddSupplierDialog
        open={isAddSupplierOpen}
        onOpenChange={setIsAddSupplierOpen}
        onAddSupplier={onAddSupplier}
      />
    </div>
  )
}
