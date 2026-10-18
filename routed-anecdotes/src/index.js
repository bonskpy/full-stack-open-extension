import { useEffect, useState } from "react";
import anecdoteService from "./services/anecdotes.js";

export const useField = (name) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    value,
    onChange,
    name,
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    const fetchAnecdotes = async () => {
      try {
        const data = await anecdoteService.getAll();
        setAnecdotes(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchAnecdotes();
  }, []);

  const addAnecdote = async (anecdote) => {
    try {
      const newAnecdote = await anecdoteService.createNew(anecdote);
      setAnecdotes((anecdotes) => anecdotes.concat(newAnecdote));
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteAnecdote = async (id) => {
    try {
      await anecdoteService.deleteOne(id);
      setAnecdotes((currentAnecdotes) =>
        currentAnecdotes.filter((anecdote) => anecdote.id !== id)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
