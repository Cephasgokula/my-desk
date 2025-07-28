"use client"

import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Home,
  FileText,
  Link,
  CalendarIcon,
  Folder,
  Plus,
  Search,
  Pin,
  ExternalLink,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Settings,
  BookmarkPlus,
  CalendarPlus,
  FolderPlus,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { SearchModal } from "./search-modal"
import { CalendarView } from "./calendar-view"
import { FolderDetail } from "./folder-detail"
import ReactMarkdown from "react-markdown"
import { AuthModal } from "./auth-modal"

// Mock data
const mockNotes = [
  {
    id: 1,
    title: "DSA - Binary Trees",
    content: "Tree traversal algorithms: inorder, preorder, postorder...",
    category: "DSA",
    pinned: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "OS - Process Management",
    content: "Process states, scheduling algorithms, context switching...",
    category: "OS",
    pinned: false,
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    title: "DBMS - Normalization",
    content: "1NF, 2NF, 3NF, BCNF forms and their applications...",
    category: "DBMS",
    pinned: true,
    createdAt: "2024-01-13",
  },
]

const mockLinks = [
  { id: 1, title: "LeetCode", url: "https://leetcode.com", description: "Practice coding problems", category: "Study" },
  { id: 2, title: "GitHub", url: "https://github.com", description: "Code repositories", category: "Daily Use" },
  {
    id: 3,
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "Web development reference",
    category: "Study",
  },
]

const mockTasks = [
  { id: 1, title: "Complete React project", completed: false, date: new Date(), priority: "high" },
  { id: 2, title: "Study for OS exam", completed: true, date: new Date(), priority: "medium" },
  { id: 3, title: "Review DSA concepts", completed: false, date: new Date(), priority: "low" },
]

const mockFolders = [
  { id: 1, name: "Interview Prep", description: "Important notes and resources for interviews", itemCount: 5 },
  { id: 2, name: "Project Ideas", description: "Random thoughts and project concepts", itemCount: 3 },
  { id: 3, name: "Daily Reminders", description: "Things to remember daily", itemCount: 8 },
]

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<any>(null)
  const [editingNote, setEditingNote] = useState<any>(null)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "General" })
  const [newLink, setNewLink] = useState({ title: "", url: "", description: "", category: "General" })
  const [newTask, setNewTask] = useState({ title: "", priority: "medium", date: new Date() })
  const [newFolder, setNewFolder] = useState({ name: "", description: "" })
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [notes, setNotes] = useState(mockNotes)
  const [links, setLinks] = useState(mockLinks)
  const [tasks, setTasks] = useState(mockTasks)
  const [folders, setFolders] = useState(mockFolders)

  const categories = ["General", "DSA", "OS", "DBMS", "Web Dev", "Projects"]
  const linkCategories = ["General", "Study", "Daily Use", "Tools", "Reference"]

  // Add this at the top of the Dashboard component
  const [user, setUser] = useState<any>(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      setAuthOpen(true)
    }
  }, [])

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setAuthOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setAuthOpen(true)
  }

  // Notes CRUD
  const handleEditNote = (note: any) => {
    setEditingNote(note)
    setNewNote({ title: note.title, content: note.content, category: note.category })
    setIsAddingNote(true)
  }

  const handleUpdateNote = () => {
    if (editingNote && newNote.title && newNote.content) {
      setNotes(notes.map((note) => (note.id === editingNote.id ? { ...note, ...newNote } : note)))
      setEditingNote(null)
      setNewNote({ title: "", content: "", category: "General" })
      setIsAddingNote(false)
    } else {
      handleAddNote()
    }
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdAt: format(new Date(), "yyyy-MM-dd"),
      }
      setNotes([note, ...notes])
      setNewNote({ title: "", content: "", category: "General" })
      setIsAddingNote(false)
    }
  }

  // Links CRUD
  const handleEditLink = (link: any) => {
    setEditingLink(link)
    setNewLink({ title: link.title, url: link.url, description: link.description, category: link.category })
    setIsAddingLink(true)
  }

  const handleUpdateLink = () => {
    if (editingLink && newLink.title && newLink.url) {
      setLinks(links.map((link) => (link.id === editingLink.id ? { ...link, ...newLink } : link)))
      setEditingLink(null)
      setNewLink({ title: "", url: "", description: "", category: "General" })
      setIsAddingLink(false)
    } else {
      handleAddLink()
    }
  }

  const handleDeleteLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const link = {
        id: Date.now(),
        ...newLink,
      }
      setLinks([link, ...links])
      setNewLink({ title: "", url: "", description: "", category: "General" })
      setIsAddingLink(false)
    }
  }

  // Tasks CRUD
  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setNewTask({ title: task.title, priority: task.priority, date: task.date })
    setDate(task.date)
    setIsAddingTask(true)
  }

  const handleUpdateTask = () => {
    if (editingTask && newTask.title) {
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? { ...task, ...newTask, date: date || new Date() } : task)),
      )
      setEditingTask(null)
      setNewTask({ title: "", priority: "medium", date: new Date() })
      setIsAddingTask(false)
    } else {
      handleAddTask()
    }
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleAddTask = () => {
    if (newTask.title) {
      const task = {
        id: Date.now(),
        ...newTask,
      }
      setTasks([task, ...tasks])
      setNewTask({ title: "", priority: "medium", date: new Date() })
      setIsAddingTask(false)
    }
  }

  // Folders CRUD
  const handleDeleteFolder = (id: number) => {
    setFolders(folders.filter((folder) => folder.id !== id))
  }

  const handleUpdateFolder = (updatedFolder: any) => {
    setFolders(folders.map((folder) => (folder.id === updatedFolder.id ? updatedFolder : folder)))
  }

  const handleAddFolder = () => {
    if (newFolder.name) {
      const folder = {
        id: Date.now(),
        ...newFolder,
        itemCount: 0,
      }
      setFolders([folder, ...folders])
      setNewFolder({ name: "", description: "" })
      setIsAddingFolder(false)
    }
  }

  // Search functionality
  const handleSearchResult = (result: any) => {
    switch (result.type) {
      case "note":
        setActiveSection("notes")
        break
      case "link":
        setActiveSection("links")
        break
      case "task":
        setActiveSection("tasks")
        break
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results: any[] = []

    // Search notes
    mockNotes.forEach((note) => {
      if (
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ ...note, type: "note" })
      }
    })

    // Search links
    mockLinks.forEach((link) => {
      if (
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.description.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ ...link, type: "link" })
      }
    })

    // Search tasks
    mockTasks.forEach((task) => {
      if (task.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({ ...task, type: "task" })
      }
    })

    setSearchResults(results)
  }

  function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">MyDesk</span>
              <span className="text-xs text-muted-foreground">Productivity Hub</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "dashboard"}
                    onClick={() => setActiveSection("dashboard")}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "notes"} onClick={() => setActiveSection("notes")}>
                    <FileText className="h-4 w-4" />
                    <span>Notes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "links"} onClick={() => setActiveSection("links")}>
                    <Link className="h-4 w-4" />
                    <span>Links</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "tasks"} onClick={() => setActiveSection("tasks")}>
                    <CalendarIcon className="h-4 w-4" />
                    <span>Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "folders"} onClick={() => setActiveSection("folders")}>
                    <Folder className="h-4 w-4" />
                    <span>Folders</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/profile">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.name || "User"}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }

  function DashboardOverview() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your productivity overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notes.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Links</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
              <p className="text-xs text-muted-foreground">+1 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((task) => !task.completed).length}</div>
              <p className="text-xs text-muted-foreground">3 due today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Folders</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{folders.length}</div>
              <p className="text-xs text-muted-foreground">Well organized</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  {note.pinned && <Pin className="h-3 w-3 text-orange-500 mt-1 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{note.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {note.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {links.slice(0, 3).map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {link.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs mt-1"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  function NotesSection() {
    const togglePin = (id: number) => {
      setNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)))
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">Organize your thoughts and knowledge</p>
          </div>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
                <DialogDescription>
                  {editingNote ? "Update your note" : "Add a new note to your collection"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter note title..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newNote.category}
                    onValueChange={(value) => setNewNote({ ...newNote, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note content..."
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false)
                    setEditingNote(null)
                    setNewNote({ title: "", content: "", category: "General" })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateNote}>{editingNote ? "Update Note" : "Create Note"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {note.pinned && <Pin className="h-4 w-4 text-orange-500" />}
                      {note.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{note.category}</Badge>
                      <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePin(note.id)}>
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditNote(note)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function LinksSection() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Links</h1>
            <p className="text-muted-foreground">Your bookmarked resources and references</p>
          </div>
          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
                <DialogDescription>Save a useful link to your collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-title">Title</Label>
                  <Input
                    id="link-title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Enter link title..."
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="link-category">Category</Label>
                  <Select
                    value={newLink.category}
                    onValueChange={(value) => setNewLink({ ...newLink, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {linkCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="link-description">Description</Label>
                  <Textarea
                    id="link-description"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    placeholder="Brief description of the link..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLink(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLink}>Add Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Card key={link.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {link.title}
                    </CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {link.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Visit Link
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  function TasksSection() {
    const toggleTask = (id: number) => {
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily tasks and deadlines</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showCalendarView ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCalendarView(!showCalendarView)}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {showCalendarView ? "List View" : "Calendar View"}
            </Button>
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {showCalendarView ? (
          <CalendarView
            tasks={tasks}
            onAddTask={(date) => {
              setDate(date)
              setIsAddingTask(true)
            }}
            onTaskClick={(task) => handleEditTask(task)}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => toggleTask(task.id)}>
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{format(task.date, "MMM dd")}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a task to your schedule</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
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
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  function FoldersSection() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Folders</h1>
            <p className="text-muted-foreground">Organize your content into folders</p>
          </div>
          <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Organize your notes, links, and tasks</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                    placeholder="Enter folder name..."
                  />
                </div>
                <div>
                  <Label htmlFor="folder-description">Description</Label>
                  <Textarea
                    id="folder-description"
                    value={newFolder.description}
                    onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                    placeholder="Brief description of the folder..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingFolder(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFolder(folder)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{folder.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{folder.itemCount} items</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{folder.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderSection = () => {
    if (selectedFolder) {
      return (
        <FolderDetail
          folder={selectedFolder}
          onBack={() => setSelectedFolder(null)}
          onUpdateFolder={handleUpdateFolder}
        />
      )
    }

    switch (activeSection) {
      case "notes":
        return <NotesSection />
      case "links":
        return <LinksSection />
      case "tasks":
        return <TasksSection />
      case "folders":
        return <FoldersSection />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <main className="container py-6">
            {isSearching && searchResults.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Search Results</h2>
                {searchResults.map((result: any) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>
                        {result.type === "note" && <FileText className="mr-2 inline-block h-4 w-4" />}
                        {result.type === "link" && <Link className="mr-2 inline-block h-4 w-4" />}
                        {result.type === "task" && <CalendarIcon className="mr-2 inline-block h-4 w-4" />}
                        {result.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.type === "note" && <p>{result.content}</p>}
                      {result.type === "link" && <p>{result.description}</p>}
                      {result.type === "task" && <p>{result.priority}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isSearching ? (
              <div>No results found.</div>
            ) : (
              renderSection()
            )}
          </main>
        </div>
      </div>
      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        data={{ notes, links, tasks }}
        onSelectResult={handleSearchResult}
      />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onAuthSuccess={handleAuthSuccess} />
    </SidebarProvider>
  )
}
