import { useState,useEffect } from "react";
export const useLocalStorage = (intitalstate,key) => {
    const [watched, setWatched] = useState(function () {
        const val = localStorage.getItem(key);
        return val ?  JSON.parse(val):intitalstate;
      });

      useEffect(
        function () {
          localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
      );

      return [watched,setWatched];
};