import { useState,useEffect } from "react";

export const useMovies = (query) => {
    const [movies, setMovies] = useState([]);
    const [isLodaing , setLoading] = useState(false);
    const  [iserror, seterror] = useState("")
    useEffect(function () {
        async function moivefunctoion() {
          try{
            setLoading(true);
            seterror("");
            const response = await fetch(`https://www.omdbapi.com/?apikey=d855abd9&s=${query}`)
            if(!response.ok) throw new Error("Something  wrong");
            const  data = await response.json();
           
            if(data.Response === 'False') throw new Error("Something  wrong");
            setMovies(data.Search);
           
           
          }
          catch(err){
                console.error(err.message)
                seterror(err.message)
                setMovies([]);
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
      }, [query]);

     return [movies,iserror,isLodaing] 
};