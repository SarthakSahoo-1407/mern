import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const TodoList = () => {
  const { token } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/todos',
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([response.data, ...todos]);
      setNewTodo('');
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/todos/${todo._id}`,
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(
        todos.map((t) => (t._id === todo._id ? response.data : t))
      );
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  const handleEdit = async (id: string) => {
    if (editingId === id) {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/todos/${id}`,
          { title: editingText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTodos(
          todos.map((todo) => (todo._id === id ? response.data : todo))
        );
        setEditingId(null);
        toast.success('Todo updated successfully');
      } catch (error) {
        toast.error('Failed to update todo');
      }
    } else {
      const todo = todos.find((t) => t._id === id);
      if (todo) {
        setEditingText(todo.title);
        setEditingId(id);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Todo
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => handleToggleComplete(todo)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}
              >
                {todo.completed && <Check className="h-4 w-4 text-white" />}
              </button>
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="flex-1">
                  <p
                    className={`text-gray-800 ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {todo.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {format(new Date(todo.createdAt), 'MMM d, yyyy HH:mm')}
                    {todo.updatedAt !== todo.createdAt && (
                      <> • Updated: {format(new Date(todo.updatedAt), 'MMM d, yyyy HH:mm')}</>
                    )}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {editingId === todo._id ? (
                <>
                  <button
                    onClick={() => handleEdit(todo._id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(todo._id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Pencil className="h 5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;