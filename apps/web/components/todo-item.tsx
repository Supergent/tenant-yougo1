/**
 * Todo Item Component
 *
 * Individual todo item with checkbox, edit, and delete functionality.
 */

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Checkbox } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Button } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Card } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Input } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Badge } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Trash2, Edit2, Check, X } from "lucide-react";

interface Todo {
  _id: Id<"todos">;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority?: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
}

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCompletion = useMutation(api.endpoints.todos.toggleCompletion);
  const updateTodo = useMutation(api.endpoints.todos.update);
  const deleteTodo = useMutation(api.endpoints.todos.remove);

  const handleToggle = async () => {
    try {
      await toggleCompletion({
        id: todo._id,
        isCompleted: !todo.isCompleted,
      });
    } catch (error: any) {
      alert(error?.message || "Failed to update todo");
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || editTitle === todo.title) {
      setIsEditing(false);
      setEditTitle(todo.title);
      return;
    }

    setIsUpdating(true);
    try {
      await updateTodo({
        id: todo._id,
        title: editTitle.trim(),
      });
      setIsEditing(false);
    } catch (error: any) {
      alert(error?.message || "Failed to update todo");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await deleteTodo({ id: todo._id });
    } catch (error: any) {
      alert(error?.message || "Failed to delete todo");
    }
  };

  const priorityColors = {
    low: "bg-success text-success-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-danger text-danger-foreground",
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                disabled={isUpdating}
                className="flex-1"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-base ${
                    todo.isCompleted
                      ? "line-through text-text-secondary"
                      : "text-text-primary"
                  }`}
                >
                  {todo.title}
                </span>
                {todo.priority && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${priorityColors[todo.priority]}`}
                  >
                    {todo.priority}
                  </Badge>
                )}
              </div>
              {todo.description && (
                <p className="text-sm text-text-secondary">
                  {todo.description}
                </p>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-danger" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
