"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
  File,
  Folder,
  Plus,
  ChevronRight,
  X,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowDownAZ,
  ArrowUpZA,
  Clock,
  SortAsc,
  Eye,
  EyeOff,
  Type,
  FilePlus,
  FolderPlus,
} from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FileItem = {
  id: string
  name: string
  type: "file" | "folder"
  isEditing: boolean
  parentId: string | null
  content?: string
  createdAt: number
}

type OpenFile = {
  id: string
  name: string
  content: string
  isDirty: boolean
}

type SortOption = "name-asc" | "name-desc" | "date-desc" | "date-asc"

export default function FileExplorerWithNotepad() {
  const [items, setItems] = useState<FileItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null; name: string }[]>([{ id: null, name: "Root" }])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit")
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [activeFontSize, setActiveFontSize] = useState<string>("normal")

  const inputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
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

  // Focus editor when opening a file
  useEffect(() => {
    if (activeFileId && editorRef.current && editorMode === "edit") {
      editorRef.current.focus()
    }
  }, [activeFileId, editorMode])

  const addItem = (type: "file" | "folder") => {
    const newItem: FileItem = {
      id: Date.now().toString(),
      name: "",
      type,
      isEditing: true,
      parentId: currentFolder,
      content: type === "file" ? "" : undefined,
      createdAt: Date.now(),
    }

    setItems((prev) => [...prev, newItem])
    setSelectedItem(newItem.id)
  }

  const updateItemName = (id: string, name: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)))

    // Update open file name if it's open
    setOpenFiles((prev) => prev.map((file) => (file.id === id ? { ...file, name } : file)))
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

    // Close any open files that are being deleted
    setOpenFiles((prev) => prev.filter((file) => !itemsToDelete.includes(file.id)))

    if (activeFileId && itemsToDelete.includes(activeFileId)) {
      setActiveFileId(openFiles.find((f) => !itemsToDelete.includes(f.id))?.id || null)
    }

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      return;
    }

    // Apply active formats before character is typed
    if (e.key.length === 1) { // Only for printable characters
      // Apply text formatting
      activeFormats.forEach(format => {
        document.execCommand(format.toLowerCase(), false);
      });

      // Apply font size if active
      if (activeHeading) {
        let fontSize;
        switch (activeHeading) {
          case "h1": fontSize = "7"; break;
          case "h2": fontSize = "6"; break;
          case "h3": fontSize = "5"; break;
          case "h4": fontSize = "4"; break;
          case "h5": fontSize = "3"; break;
          default: fontSize = "3";
        }
        document.execCommand('fontSize', false, fontSize);
      }
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
      } else if (item.type === "file") {
        openFile(item)
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

  // Notepad functions
  const openFile = (file: FileItem) => {
    // Check if file is already open
    if (!openFiles.some((f) => f.id === file.id)) {
      setOpenFiles((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
          content: file.content || "",
          isDirty: false,
        },
      ])
    }

    setActiveFileId(file.id)
    setEditorMode("edit") // Switch to edit mode when opening a file
  }

  const closeFile = (id: string) => {
    setOpenFiles((prev) => prev.filter((file) => file.id !== id))

    if (activeFileId === id) {
      // Set the next available file as active, or null if none
      const remainingFiles = openFiles.filter((file) => file.id !== id)
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null)
    }
  }

  const updateFileContent = (id: string, content: string) => {
    // Update open file
    setOpenFiles((prev) => prev.map((file) => (file.id === id ? { ...file, content, isDirty: true } : file)))
  }

  const saveFile = (id: string) => {
    const openFile = openFiles.find((file) => file.id === id)
    if (!openFile) return

    // Update the file content in items
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, content: openFile.content } : item)))

    // Mark file as not dirty
    setOpenFiles((prev) => prev.map((file) => (file.id === id ? { ...file, isDirty: false } : file)))
  }

  // Handle text change in the editor
  const handleEditorChange = (e?: React.FormEvent<HTMLDivElement> | null) => {
    if (activeFileId && editorRef.current) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const content = editorRef.current.innerHTML;
      
      updateFileContent(activeFileId, content);

      // Restore cursor position after content update
      if (range && selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        // Ensure formats are applied at cursor position for next character
        activeFormats.forEach(format => {
          if (!document.queryCommandState(format.toLowerCase())) {
            document.execCommand(format.toLowerCase(), false);
          }
        });
      }
    }
  }

  // Sort functions
  const handleSortChange = (option: SortOption) => {
    setSortOption(option)
  }

  // Get sorted items
  const getSortedItems = (items: FileItem[]): FileItem[] => {
    const itemsToSort = [...items]

    switch (sortOption) {
      case "name-asc":
        return itemsToSort.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return itemsToSort.sort((a, b) => b.name.localeCompare(a.name))
      case "date-desc":
        return itemsToSort.sort((a, b) => b.createdAt - a.createdAt)
      case "date-asc":
        return itemsToSort.sort((a, b) => a.createdAt - b.createdAt)
      default:
        return itemsToSort
    }
  }

  const currentItems = getSortedItems(items.filter((item) => item.parentId === currentFolder))
  const activeFile = openFiles.find((file) => file.id === activeFileId)

  // Text formatting functions
  const applyFormatting = (format: string) => {
    if (!editorRef.current || !activeFileId) return

    document.execCommand(format, false)
    handleEditorChange(null)
  }

  const applyAlignment = (alignment: string) => {
    if (!editorRef.current || !activeFileId) return

    document.execCommand("justifyLeft", false)
    document.execCommand("justifyCenter", false)
    document.execCommand("justifyRight", false)

    document.execCommand(alignment, false)
    handleEditorChange(null)
  }

  const handleFontSizeToggle = (size: string) => {
    let fontSize;
    switch (size) {
      case "h1":
        fontSize = "7";
        break;
      case "h2":
        fontSize = "6";
        break;
      case "h3":
        fontSize = "5";
        break;
      case "h4":
        fontSize = "4";
        break;
      case "h5":
        fontSize = "3";
        break;
      default:
        fontSize = "3";
    }
    document.execCommand("fontSize", false, fontSize);
    setActiveFontSize(size);
    handleEditorChange(null);
  }

  const handleFormatToggle = (formats: string[]) => {
    const selection = window.getSelection();
    if (!editorRef.current || !activeFileId) return;

    // Find formats to turn off and on
    const formatsToTurnOff = activeFormats.filter(f => !formats.includes(f));
    const formatsToTurnOn = formats.filter(f => !activeFormats.includes(f));

    // Save current selection if it exists
    const range = selection?.getRangeAt(0);

    // First turn off formats that were removed
    formatsToTurnOff.forEach(format => {
      document.execCommand(format.toLowerCase(), false);
    });

    // Then turn on new formats
    formatsToTurnOn.forEach(format => {
      document.execCommand(format.toLowerCase(), false);
    });

    // Update active formats state
    setActiveFormats(formats);

    // Restore selection if it existed
    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Trigger content update
    handleEditorChange();
  }

  const handleHeadingToggle = (size: string) => {
    if (!editorRef.current || !activeFileId) return;

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    // If the same size is clicked again, reset to normal
    if (activeHeading === size) {
      document.execCommand('removeFormat', false);
      setActiveHeading('');
    } else {
      // Apply new size
      let fontSize;
      switch (size) {
        case "h1": fontSize = "7"; break;
        case "h2": fontSize = "6"; break;
        case "h3": fontSize = "5"; break;
        case "h4": fontSize = "4"; break;
        case "h5": fontSize = "3"; break;
        default: fontSize = "3";
      }
      
      document.execCommand('fontSize', false, fontSize);
      setActiveHeading(size);
    }

    // Restore selection
    if (selection && range) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    handleEditorChange();
  }

  // Function to check current formatting
  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const newFormats = [];
    
    // Check if any text is selected
    if (selection.toString()) {
      if (document.queryCommandState('bold')) newFormats.push('bold');
      if (document.queryCommandState('italic')) newFormats.push('italic');
      if (document.queryCommandState('underline')) newFormats.push('underline');
    } else {
      // If no text is selected, keep existing formats for new text
      newFormats.push(...activeFormats);
    }

    setActiveFormats(newFormats);
  }

  // Add effect to update format state when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (editorRef.current && activeFileId) {
        updateActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [activeFileId]);

  return (
    <div className="w-full mx-auto border-r shadow-sm overflow-hidden flex flex-col md:flex-row h-[912px]">
      {/* File Explorer */}
      <div className="w-full max-w-xs border-r flex flex-col">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex gap-1 mb-3 justify-center">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => addItem("file")} className="bg-transparent border-none cursor-default hover:bg-zinc-800 rounded-xl">
                    <FilePlus className="h-3.5 w-3.5 absolute text-zinc-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white border border-zinc-700 font-body flex items-center">
                  <p>Add File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => addItem("folder")} className="bg-transparent border-none cursor-default hover:bg-zinc-800 rounded-xl">
                    <FolderPlus className="h-3.5 w-3.5 absolute text-zinc-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-white border border-zinc-700 font-body flex items-center">
                  <p>Add Folder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-transparent border-none cursor-default hover:bg-zinc-800 rounded-xl">
                        <SortAsc className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-800 text-white border border-zinc-700 font-body flex items-center">
                    <p>Sort</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="start" className="flex flex-col gap-1">
                <DropdownMenuItem
                  onClick={() => handleSortChange("name-asc")}
                  className={sortOption === "name-asc" ? "bg-muted text-xs font-body" : "text-xs font-body"}
                >
                  <ArrowDownAZ className=" h-2 w-2" />
                  File name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("name-desc")}
                  className={sortOption === "name-desc" ? "bg-muted text-xs font-body" : "text-xs font-body"}
                >
                  <ArrowUpZA className=" h-2 w-2" />
                  File name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("date-desc")}
                  className={sortOption === "date-desc" ? "bg-muted text-xs font-body" : "text-xs font-body"}
                >
                  <Clock className=" h-2 w-2" />
                  Created time (new to old)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("date-asc")}
                  className={sortOption === "date-asc" ? "bg-muted text-xs font-body" : "text-xs font-body"}
                >
                  <Clock className=" h-2 w-2" />
                  Created time (old to new)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-center text-xs text-muted-foreground">
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

        <ScrollArea className="flex-1 bg-muted/30">
          <div className="p-2">
            {currentItems.length === 0 ? (
              <div className="flex items-center justify-center text-muted-foreground text-xs">
                {currentFolder === null
                  ? "No files or folders. Add one to get started."
                  : "This folder is empty. Add files or folders here."}
              </div>
            ) : (
              <ul className="space-y-1">
                {currentItems.map((item) => (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <li
                        className={cn(
                          "flex items-center py-1 px-2 rounded-lg text-sm text-start text-zinc-400",
                          selectedItem === item.id ? "bg-primary/10" : "hover:bg-muted/50",
                          item.isEditing ? "bg-muted" : "",
                          dropTarget === item.id ? "bg-blue-100 dark:bg-blue-900/30" : "",
                          openFiles.some((f) => f.id === item.id) ? "text-primary font-medium" : "",
                        )}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => {
                          if (item.type === "folder") {
                            navigateToFolder(item.id)
                          } else if (item.type === "file") {
                            openFile(item)
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
                              onKeyDown={handleKeyDown}
                              placeholder={`New ${item.type}`}
                              className="h-5 py-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        ) : (
                          <span className="flex-1 truncate">{item.name}</span>
                        )}
                      </li>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      {item.type === "folder" && (
                        <>
                          <ContextMenuItem onClick={() => navigateToFolder(item.id)}>Open</ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              setCurrentFolder(item.id)
                              addItem("file")
                            }}
                          >
                            Add File
                          </ContextMenuItem>
                          <ContextMenuItem
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
                      {item.type === "file" && (
                        <>
                          <ContextMenuItem onClick={() => openFile(item)} className="font-body text-xs">Open</ContextMenuItem>
                          <ContextMenuSeparator />
                        </>
                      )}
                      <ContextMenuItem onClick={() => startEditing(item.id)} className="font-body text-xs">Rename</ContextMenuItem>
                      <ContextMenuItem
                        className="text-red-400 font-body text-xs"
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
        </ScrollArea>
      </div>

      {/* Notepad */}
      <div className="w-full flex flex-col bg-muted/30">
        {/* Tabs */}
        <div className="border-b flex items-center overflow-x-auto">
          {openFiles.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">No files open</div>
          ) : (
            <div className="flex ">
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 border-r text-xs cursor-pointer font-body",
                    activeFileId === file.id ? "bg-muted/10" : "bg-muted/30 hover:bg-muted/50",
                  )}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <File className="h-3.5 w-3.5 mr-2 text-blue-500" />
                  <span className="truncate max-w-[120px] ">
                    {file.name}
                    {file.isDirty && " •"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeFile(file.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formatting Toolbar */}
        {activeFile && (
          <div className="border-b p-1 bg-muted/20 flex flex-wrap items-center gap-1 sticky top-0 z-10">
            <ToggleGroup 
              type="multiple" 
              value={activeFormats} 
              onValueChange={handleFormatToggle}
            >
              <TooltipProvider delayDuration={300}>
                <div className="flex items-center gap-1">
                  <ToggleGroupItem 
                    value="bold" 
                    aria-label="Toggle bold" 
                    className={cn(
                      "h-8 w-8 rounded-xl",
                      activeFormats.includes('bold') && "bg-muted"
                    )}
                  >
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Bold className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Bold</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>

                  <ToggleGroupItem 
                    value="italic" 
                    aria-label="Toggle italic" 
                    className={cn(
                      "h-8 w-8 rounded-xl",
                      activeFormats.includes('italic') && "bg-muted"
                    )}
                  >
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Italic className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Italic</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>

                  <ToggleGroupItem 
                    value="underline" 
                    aria-label="Toggle underline" 
                    className={cn(
                      "h-8 w-8 rounded-xl",
                      activeFormats.includes('underline') && "bg-muted"
                    )}
                  >
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Underline className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Underline</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-1">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => applyAlignment("justifyLeft")}
                        disabled={editorMode === "preview"}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Align Left</TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => applyAlignment("justifyCenter")}
                        disabled={editorMode === "preview"}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Align Center</TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => applyAlignment("justifyRight")}
                        disabled={editorMode === "preview"}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Align Right</TooltipContent>
                  </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <ToggleGroup type="single" value={activeFontSize} onValueChange={(value) => value && handleFontSizeToggle(value)}>
                      <ToggleGroupItem value="h1" aria-label="Heading 1" className="h-8 w-8 rounded-xl">
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-base">H1</span>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Heading 1</TooltipContent>
                        </Tooltip>
                      </ToggleGroupItem>

                      <ToggleGroupItem value="h2" aria-label="Heading 2" className="h-8 w-8 rounded-xl">
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-sm">H2</span>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Heading 2</TooltipContent>
                        </Tooltip>
                      </ToggleGroupItem>

                      <ToggleGroupItem value="h3" aria-label="Heading 3" className="h-8 w-8 rounded-xl">
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-xs">H3</span>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Heading 3</TooltipContent>
                        </Tooltip>
                      </ToggleGroupItem>

                      <ToggleGroupItem value="h4" aria-label="Heading 4" className="h-8 w-8 rounded-xl">
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-[10px]">H4</span>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Heading 4</TooltipContent>
                        </Tooltip>
                      </ToggleGroupItem>

                      <ToggleGroupItem value="h5" aria-label="Heading 5" className="h-8 w-8 rounded-xl">
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-[9px]">H5</span>
                          </TooltipTrigger>
                          <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">Heading 5</TooltipContent>
                        </Tooltip>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </TooltipProvider>
                </div>

                <Separator orientation="vertical" className="h-6 ml-1" />

                <div className="flex items-center gap-1">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        onClick={() => setEditorMode(editorMode === "edit" ? "preview" : "edit")}
                      >
                        {editorMode === "edit" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-white bg-zinc-800 border border-zinc-700">{editorMode === "edit" ? "Preview Mode" : "Edit Mode"}</TooltipContent>
                  </Tooltip>
                </div>

                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(!activeFile.isDirty && "opacity-50")}
                    onClick={() => saveFile(activeFile.id)}
                    disabled={!activeFile.isDirty}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </TooltipProvider>
            </ToggleGroup>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 p-0 relative px-8">
          {activeFile ? (
            editorMode === "edit" ? (
              <div
                ref={editorRef}
                className="w-full h-full p-4 overflow-auto focus:outline-none text-left whitespace-pre-wrap"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleEditorChange}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div
                className="w-full h-full p-4 overflow-auto"
                style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
                dangerouslySetInnerHTML={{ __html: activeFile.content }}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No file selected. Open a file from the explorer to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

