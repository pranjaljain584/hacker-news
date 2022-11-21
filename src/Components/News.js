import axios from "axios";
import React, { useEffect, useState } from "react";
import './news.css' ;

function News({id}) {

    const [story,setStory] = useState() ;

    const fetchStoryById = async () => {
        const result = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`) ;
        setStory(result.data) ;
    }

    useEffect(() => {
        fetchStoryById() ;
    },[]) ;

    return <div className="news-item">
        {story?.title} {story?.by}
     </div> ;
}

export default News ;