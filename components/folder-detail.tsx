"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  FileText,
  Link,
  CalendarIcon,
  Pin,
  ExternalLink,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react"

interface FolderItem {
  id: number
  type: "note" | "link" | "task"
  title: string
  content?: string
  description?: string
  url?: string
  completed?: boolean
  priority?: string
  category?: string
  pinned?: boolean
  createdAt: string
}

interface FolderDetailProps {
  folder: {
    id: number
    name: string
    description: string
    itemCount: number
  }
  onBack: () => void
  onUpdateFolder: (folder: any) => void
}

export function FolderDetail({ folder, onBack, onUpdateFolder }: FolderDetailProps) {
  const [items, setItems] = useState<FolderItem[]>([
    {
      id: 1,
      type: "note",
      title: "Interview Questions - React",
      content: "Common React interview questions and answers...",
      category: "Interview Prep",
      pinned: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      type: "link",
      title: "System Design Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "Learn how to design large-scale systems",
      category: "Study",
      createdAt: "2024-01-14",
    },
    {
      id: 3,
      type: "task",
      title: "Practice coding problems",
      completed: false,
      priority: "high",
      createdAt: "2024-01-16",
    },
  ])

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    type: "note" as "note" | "link" | "task",
    title: "",
    content: "",
    description: "",
    url: "",
    priority: "medium",
  })

  const handleAddItem = () => {
    if (newItem.title) {
      const item: FolderItem = {
        id: Date.now(),
        type: newItem.type,
        title: newItem.title,
        createdAt: new Date().toISOString().split("T")[0],
        ...(newItem.type === "note" && { content: newItem.content, pinned: false }),
        ...(newItem.type === "link" && { url: newItem.url, description: newItem.description }),
        ...(newItem.type === "task" && { completed: false, priority: newItem.priority }),
      }

      setItems([item, ...items])
      setNewItem({
        type: "note",
        title: "",
        content: "",
        description: "",
        url: "",
        priority: "medium",
      })
      setIsAddingItem(false)

      // Update folder item count
      onUpdateFolder({ ...folder, itemCount: items.length + 1 })
    }
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    onUpdateFolder({ ...folder, itemCount: items.length - 1 })
  }

  const toggleTaskComplete = (id: number) => {
    setItems(
      items.map((item) => (item.id === id && item.type === "task" ? { ...item, completed: !item.completed } : item)),
    )
  }

  const toggleNotePin = (id: number) => {
    setItems(items.map((item) => (item.id === id && item.type === "note" ? { ...item, pinned: !item.pinned } : item)))
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />
      case "link":
        return <Link className="h-4 w-4" />
      case "task":
        return <CalendarIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Folders
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{folder.name}</h1>
          <p className="text-muted-foreground">{folder.description}</p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to Folder</DialogTitle>
              <DialogDescription>Add a note, link, or task to this folder</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-type">Type</Label>
                <Select value={newItem.type} onValueChange={(value: any) => setNewItem({ ...newItem, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="item-title">Title</Label>
                <Input
                  id="item-title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title..."
                />
              </div>

              {newItem.type === "note" && (
                <div>
                  <Label htmlFor="item-content">Content</Label>
                  <Textarea
                    id="item-content"
                    value={newItem.content}
                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    placeholder="Write your note content..."
                    rows={4}
                  />
                </div>
              )}

              {newItem.type === "link" && (
                <>
                  <div>
                    <Label htmlFor="item-url">URL</Label>
                    <Input
                      id="item-url"
                      type="url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-description">Description</Label>
                    <Textarea
                      id="item-description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Brief description..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              {newItem.type === "task" && (
                <div>
                  <Label htmlFor="item-priority">Priority</Label>
                  <Select
                    value={newItem.priority}
                    onValueChange={(value) => setNewItem({ ...newItem, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getItemIcon(item.type)}
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                  {item.pinned && <Pin className="h-3 w-3 text-orange-500" />}
                </div>
                <div className="flex items-center gap-1">
                  {item.type === "note" && (
                    <Button variant="ghost" size="sm" onClick={() => toggleNotePin(item.id)}>
                      <Pin className={`h-3 w-3 ${item.pinned ? "text-orange-500" : "text-muted-foreground"}`} />
                    </Button>
                  )}
                  {item.type === "task" && (
                    <Button variant="ghost" size="sm" onClick={() => toggleTaskComplete(item.id)}>
                      {item.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardTitle className={`text-lg ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.type === "note" && item.content && (
                <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
              )}

              {item.type === "link" && (
                <div className="space-y-2">
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  <Button variant="outline" size="sm" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Visit Link
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
              )}

              {item.type === "task" && item.priority && (
                <Badge
                  variant={
                    item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {item.priority} priority
                </Badge>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">{item.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items in this folder</h3>
          <p className="text-muted-foreground mb-4">Start organizing by adding notes, links, or tasks</p>
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      )}
    </div>
  )
}
