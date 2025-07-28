"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, isSameDay } from "date-fns"

interface Task {
  id: number
  title: string
  completed: boolean
  date: Date
  priority: string
}

interface CalendarViewProps {
  tasks: Task[]
  onAddTask: (date: Date) => void
  onTaskClick: (task: Task) => void
}

export function CalendarView({ tasks, onAddTask, onTaskClick }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewDate, setViewDate] = useState<Date>(new Date())

  const tasksForSelectedDate = tasks.filter((task) => isSameDay(task.date, selectedDate))

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.date, date))
  }

  const getDayContent = (date: Date) => {
    const dayTasks = getTasksForDate(date)
    if (dayTasks.length === 0) return null

    return (
      <div className="flex flex-col items-center">
        <span>{date.getDate()}</span>
        <div className="flex gap-1 mt-1">
          {dayTasks.slice(0, 3).map((task, index) => (
            <div
              key={task.id}
              className={`w-1.5 h-1.5 rounded-full ${
                task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
          ))}
          {dayTasks.length > 3 && <span className="text-xs text-muted-foreground">+{dayTasks.length - 3}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(viewDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewDate(new Date())}>
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={viewDate}
              onMonthChange={setViewDate}
              className="w-full"
              components={{
                Day: ({ date, ...props }) => {
                  // Ensure date is properly defined before using it
                  if (!date) return null

                  return (
                    <div className="relative w-full h-full p-1">
                      <button
                        {...props}
                        className="w-full h-full min-h-[2.5rem] flex flex-col items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        {getDayContent(date) || <span>{date.getDate()}</span>}
                      </button>
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{format(selectedDate, "MMM dd, yyyy")}</CardTitle>
              <Button size="sm" onClick={() => onAddTask(selectedDate)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tasks for this day</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => onAddTask(selectedDate)}
                >
                  Add a task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-medium text-green-600">{tasks.filter((t) => t.completed).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium text-orange-600">{tasks.filter((t) => !t.completed).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <span className="font-medium text-red-600">
                  {tasks.filter((t) => t.priority === "high" && !t.completed).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
