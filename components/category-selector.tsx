
"use client"

import { useState, useEffect } from "react"
import { Plus, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CategorySelectorProps {
  type: 'item' | 'supplier'
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CategorySelector({ type, value, onValueChange, placeholder }: CategorySelectorProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategoryValue, setNewCategoryValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [type])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryValue.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          value: newCategoryValue.trim()
        }),
      })

      if (response.ok) {
        await fetchCategories()
        onValueChange(newCategoryValue.trim())
        setNewCategoryValue("")
        setIsAddDialogOpen(false)
      } else if (response.status === 409) {
        alert('Category already exists')
      } else {
        alert('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Failed to add category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory()
    }
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="flex-1 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
          <SelectValue placeholder={placeholder || `Select ${type} category`} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.value}>
              {category.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="px-3 border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Add New {type === 'item' ? 'Item' : 'Supplier'} Category
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={`Enter ${type} category name`}
              value={newCategoryValue}
              onChange={(e) => setNewCategoryValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewCategoryValue("")
                }}
                className="border-slate-200"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryValue.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-4 w-4 mr-1" />
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
