"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { File, Folder, Plus, ChevronRight, FolderPlus, FilePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  isEditing: boolean
  parentId: string | null
  isOpen?: boolean
}

export default function FileExplorer() {
  const [items, setItems] = useState<FileItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: "Root" }])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastClickTimeRef = useRef<{ id: string; time: number } | null>(null)

  // Focus input when creating or editing
  useEffect(() => {
    const editingItem = items.find((item) => item.isEditing)
    if (editingItem && inputRef.current) {
      inputRef.current.focus()
      // Place cursor at the end of the text
      const length = editingItem.name.length
      inputRef.current.setSelectionRange(length, length)
    }
  }, [items])

  const addItem = (type: "file" | "folder") => {
    const newItem: FileItem = {
      id: Date.now().toString(),
      name: "",
      type,
      isEditing: true,
      parentId: currentFolder,
      isOpen: false,
    }

    setItems((prev) => [...prev, newItem])
    setSelectedItem(newItem.id)
  }

  const updateItemName = (id: string, name: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)))
  }

  const finishEditing = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: false, name: item.name.trim() || `New ${item.type}` } : item,
      ),
    )
  }

  const startEditing = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isEditing: true } : item)))
    setSelectedItem(id)
  }

  const deleteItem = (id: string) => {
    // Delete the item and all its children recursively
    const itemsToDelete = getItemAndAllChildren(id)
    setItems((prev) => prev.filter((item) => !itemsToDelete.includes(item.id)))

    if (selectedItem && itemsToDelete.includes(selectedItem)) {
      setSelectedItem(null)
    }

    // If we're deleting the current folder, go back to parent
    if (currentFolder === id) {
      const item = items.find((i) => i.id === id)
      if (item) {
        navigateToFolder(item.parentId)
      }
    }
  }

  const getItemAndAllChildren = (id: string): string[] => {
    const result = [id]
    const children = items.filter((item) => item.parentId === id)

    children.forEach((child) => {
      result.push(...getItemAndAllChildren(child.id))
    })

    return result
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      finishEditing(id)
    }
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId)

    // Update breadcrumbs
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: "Root" }])
    } else {
      const path = []
      let currentId = folderId

      // Build path from current folder up to root
      while (currentId !== null) {
        const folder = items.find((item) => item.id === currentId)
        if (folder) {
          path.unshift({ id: folder.id, name: folder.name })
          currentId = folder.parentId
        } else {
          break
        }
      }

      // Add root at the beginning
      setBreadcrumbs([{ id: null, name: "Root" }, ...path])
    }
  }

  const handleItemClick = (item: FileItem) => {
    // Handle selection (single click)
    setSelectedItem(item.id)

    // Check for double click
    const now = Date.now()
    const lastClick = lastClickTimeRef.current

    if (lastClick && lastClick.id === item.id && now - lastClick.time < 500) {
      // Double click detected
      if (item.type === "folder") {
        navigateToFolder(item.id)
      }
      // Reset last click
      lastClickTimeRef.current = null
    } else {
      // Record this click for potential double-click detection
      lastClickTimeRef.current = { id: item.id, time: now }
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()

    // Only set drop target if it's a folder and not the dragged item itself
    const targetItem = items.find((item) => item.id === id)
    if (targetItem && targetItem.type === "folder" && id !== draggedItem) {
      setDropTarget(id)
    }
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()

    const sourceId = e.dataTransfer.getData("text/plain")
    const targetItem = items.find((item) => item.id === targetId)

    // Only allow dropping into folders
    if (targetItem && targetItem.type === "folder" && sourceId !== targetId) {
      // Prevent dropping a parent folder into its child
      if (isDescendantOf(targetId, sourceId)) {
        return
      }

      // Move the item
      setItems((prev) => prev.map((item) => (item.id === sourceId ? { ...item, parentId: targetId } : item)))
    }

    setDraggedItem(null)
    setDropTarget(null)
  }

  // Check if targetId is a descendant of sourceId
  const isDescendantOf = (targetId: string, sourceId: string): boolean => {
    let current = targetId

    while (current !== null) {
      if (current === sourceId) return true

      const item = items.find((item) => item.id === current)
      if (!item) break

      current = item.parentId || ""
    }

    return false
  }

  const currentItems = items.filter((item) => item.parentId === currentFolder)

  return (
    <div className="w-full h-full max-w-xs mx-auto shadow-sm overflow-hidden border-r">
      <div className="p-2 border-b bg-muted/30">
        <div className="flex gap-1 mb-3 justify-center">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => addItem("file")} className="rounded-xl bg-transparent cursor-default border-none hover:bg-muted/50">
                  <FilePlus className="h-3.5 w-3.5 absolute" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 text-white">
                <p>Add File</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => addItem("folder")} className="rounded-xl bg-transparent cursor-default border-none hover:bg-muted/50">
                  <FolderPlus className="h-3.5 w-3.5 absolute" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 text-white">
                <p>Add Folder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center text-xs text-muted-foreground justify-center">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 mx-1" />}
              <button
                className={cn(
                  "hover:underline transition-colors",
                  index === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => navigateToFolder(crumb.id)}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 min-h-[831px] max-h-[831px] bg-muted/30">
        {currentItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            {currentFolder === null
              ? "No files or folders. Add one to get started."
              : "This folder is empty. Add files or folders here."}
          </div>
        ) : (
          <ul className="space-y-1 flex flex-col ">
            {currentItems.map((item) => (
              <ContextMenu key={item.id}>
                <ContextMenuTrigger>
                  <li
                    className={cn(
                      "flex items-center py-1 px-3 rounded-lg text-start transition-all",
                      selectedItem === item.id ? "bg-primary/10" : "hover:bg-muted/50",
                      item.isEditing ? "bg-muted" : "",
                      dropTarget === item.id ? "bg-blue-100 dark:bg-blue-900/30" : "",
                    )}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => {
                      if (item.type === "folder") {
                        navigateToFolder(item.id)
                      }
                    }}
                    draggable={!item.isEditing}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item.id)}
                  >
                    {item.type === "file" ? (
                      <File className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    ) : (
                      <Folder className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0" />
                    )}

                    {item.isEditing ? (
                      <div className="flex-1">
                        <Input
                          ref={inputRef}
                          value={item.name}
                          onChange={(e) => updateItemName(item.id, e.target.value)}
                          onBlur={() => finishEditing(item.id)}
                          onKeyDown={(e) => handleKeyDown(e, item.id)}
                          placeholder={`New ${item.type}`}
                          className="h-5 py-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <span className="flex-1 truncate text-sm">{item.name}</span>
                    )}
                  </li>
                </ContextMenuTrigger>
                <ContextMenuContent className="bg-zinc-900 rounded-xl">
                  {item.type === "folder" && (
                    <>
                      <ContextMenuItem onClick={() => navigateToFolder(item.id)} className="rounded-lg">Open</ContextMenuItem>
                      <ContextMenuItem
                      className="rounded-lg"
                        onClick={() => {
                          setCurrentFolder(item.id)
                          addItem("file")
                        }}
                      >
                        Add File
                      </ContextMenuItem>
                      <ContextMenuItem
                      className="rounded-lg"
                        onClick={() => {
                          setCurrentFolder(item.id)
                          addItem("folder")
                        }}
                      >
                        Add Folder
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}
                  <ContextMenuItem onClick={() => startEditing(item.id)} className="rounded-lg">Rename</ContextMenuItem>
                  <ContextMenuItem
                    className="text-red-400 focus:text-destructive rounded-lg"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

