import { useState,useEffect } from "react";

export const useMovies = (query,callback) => {
    const [movies, setMovies] = useState([]);
    const [isLodaing , setLoading] = useState(false);
    // const [Genre, setGenre] = useState("");
    const  [iserror, seterror] = useState("")
    
    useEffect(function () {
     
      const controller = new AbortController();
        async function moivefunctoion() {
          try{
            setLoading(true);
            seterror("");
            const response = await fetch(`https://www.omdbapi.com/?apikey=d855abd9&s=${query}`,
            { signal: controller.signal })
            if(!response.ok) throw new Error("Something  wrong");
            const  data = await response.json();
            console.log(data);
            if(data.Response === 'False') throw new Error("Moive Not Found");
            setMovies(data.Search);
            // setGenre("")
            seterror("");
           
          }
          catch(err){
            if (err.name !== "AbortError") {
              console.log(err.message);
              seterror(err.message);
            }
          }
          finally{
            setLoading(false);
            
          }
        }
        if(query.length<3)
          {
            seterror("")
            setMovies([]);
            return;
          }
        moivefunctoion();
        return function () {
          controller.abort();
        };
      },
      [query]
    );
  
     return [movies,iserror,isLodaing,setMovies] 
};