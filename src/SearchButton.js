import { react, useEffect, useState, useRef } from "react";

const Searchbar = ({ query, setQuery }) => {
  const input_el = useRef(null);
  useEffect(() => {
    {
      function handleRightClick(e) {
        e.preventDefault();
        setQuery("");
      }
      document.addEventListener("click", handleRightClick);
      return () => document.removeEventListener("mousedown", handleRightClick);
    }
  });

  useEffect(function () {
    function callback(e) {
      if (document.activeElement === input_el.current) return;
      if (e.code === "Enter") {
        input_el.current.focus();
        setQuery("");
      }
    }

    return () => document.addEventListener("keydown", callback);
  }, []);

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={input_el}
      />
    </>
  );
};

export default Searchbar;
