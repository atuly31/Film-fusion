import {  useEffect, useRef } from "react";

const Searchbar = ({ query, setQuery }) => {
  const input_el = useRef(null);
  useEffect(() => {
    {
      function handleLeftClick(e) {
        e.preventDefault();
        setQuery("");
      }
      document.addEventListener("click", handleLeftClick);
      return () => document.removeEventListener("click", handleLeftClick);
    }
  },[query]);

  useEffect(function () {
    function callback(e) {
      if (document.activeElement === input_el.current) return;
      if (e.code === "Enter") {
        input_el.current.focus();
        setQuery("");
      }
    }
     document.removeEventListener("keydown", callback);
    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);

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
