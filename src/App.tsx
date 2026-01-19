import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

type Todo = {
  id: number;
  title: string;
  created_at: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function fetchTodos() {
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setTodos((data ?? []) as Todo[]);
  }

  async function addTodo() {
    const clean = title.trim();
    if (!clean) return;

    setErrorMsg(null);
    const { error } = await supabase.from("todos").insert({ title: clean });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setTitle("");
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Supabase Demo (No Auth)</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo..."
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>Add</button>
        <button onClick={fetchTodos}>Refresh</button>
      </div>

      {errorMsg && (
        <p style={{ color: "crimson", marginTop: 12 }}>
          Error: {errorMsg}
        </p>
      )}

      <ul style={{ marginTop: 16 }}>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
