import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes.js";

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
        console.log("fetching anecdotes...");
        const data = await anecdoteService.getAll();
        setAnecdotes(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchAnecdotes();
  }, []);

  return {
    anecdotes,
    setAnecdotes,
  };
};
