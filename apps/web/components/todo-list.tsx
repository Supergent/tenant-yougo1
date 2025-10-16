/**
 * Todo List Component
 *
 * Main component for displaying and managing todos.
 */

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TodoItem } from "./todo-item";
import { AddTodoForm } from "./add-todo-form";
import { Badge } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Button } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Card } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Tabs } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { Skeleton } from "@jn75grbx5gbdxqx32qmghf43zh7sks06/components";
import { useState } from "react";

type Tab = "all" | "active" | "completed";

export function TodoList() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const todos = useQuery(api.endpoints.todos.list);
  const stats = useQuery(api.endpoints.todos.getStats);
  const clearCompleted = useMutation(api.endpoints.todos.clearCompleted);

  const [clearing, setClearing] = useState(false);

  const handleClearCompleted = async () => {
    setClearing(true);
    try {
      await clearCompleted();
    } finally {
      setClearing(false);
    }
  };

  // Filter todos based on active tab
  const filteredTodos = todos
    ? activeTab === "all"
      ? todos
      : activeTab === "active"
      ? todos.filter((todo) => !todo.isCompleted)
      : todos.filter((todo) => todo.isCompleted)
    : [];

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-text-secondary mb-1">Total</div>
            <div className="text-2xl font-bold">
              {stats ? stats.total : <Skeleton className="h-8 w-16" />}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-secondary mb-1">Active</div>
            <div className="text-2xl font-bold text-primary">
              {stats ? stats.active : <Skeleton className="h-8 w-16" />}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-secondary mb-1">Completed</div>
            <div className="text-2xl font-bold text-success">
              {stats ? stats.completed : <Skeleton className="h-8 w-16" />}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-secondary mb-1">Progress</div>
            <div className="text-2xl font-bold">
              {stats ? `${stats.completionRate}%` : <Skeleton className="h-8 w-16" />}
            </div>
          </div>
        </div>
      </Card>

      {/* Add Todo Form */}
      <Card className="p-6">
        <AddTodoForm />
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Tab)}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <Tabs.List>
            <Tabs.Trigger value="all">
              All
              {stats && <Badge variant="secondary" className="ml-2">{stats.total}</Badge>}
            </Tabs.Trigger>
            <Tabs.Trigger value="active">
              Active
              {stats && <Badge variant="secondary" className="ml-2">{stats.active}</Badge>}
            </Tabs.Trigger>
            <Tabs.Trigger value="completed">
              Completed
              {stats && <Badge variant="secondary" className="ml-2">{stats.completed}</Badge>}
            </Tabs.Trigger>
          </Tabs.List>

          {stats && stats.completed > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCompleted}
              disabled={clearing}
            >
              Clear Completed
            </Button>
          )}
        </div>

        {/* Todo Items */}
        <div className="space-y-2">
          {!todos ? (
            // Loading state
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : filteredTodos.length === 0 ? (
            // Empty state
            <Card className="p-8 text-center">
              <p className="text-text-secondary">
                {activeTab === "all"
                  ? "No todos yet. Add one above to get started!"
                  : activeTab === "active"
                  ? "No active todos. Great job!"
                  : "No completed todos yet."}
              </p>
            </Card>
          ) : (
            // Todo items
            filteredTodos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
