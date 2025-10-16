/**
 * Add Todo Form Component
 *
 * Form for creating new todo items.
 */

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Input } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Plus } from "lucide-react";

export function AddTodoForm() {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTodo = useMutation(api.endpoints.todos.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createTodo({ title: title.trim() });
      setTitle("");
    } catch (error: any) {
      alert(error?.message || "Failed to create todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isSubmitting}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={isSubmitting || !title.trim()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </form>
  );
}
