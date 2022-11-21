import axios from "axios";
import React, { useEffect, useState } from "react";
import './news.css' ;

function News({id,searchActivate,item}) {

    const [story,setStory] = useState() ;

    const fetchStoryById = async () => {
        const result = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`) ;
        setStory(result.data) ;
        // console.log(result.data) ;
    }

    const mapTime = timestamp => {
        const seconds = Math.floor((new Date() - timestamp * 1000) / 1000);
      
        let interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
          return `${interval} years`;
        }
        interval = Math.floor(seconds / 2592000);
      
        if (interval > 1) {
          return `${interval} months`;
        }
        interval = Math.floor(seconds / 86400);
      
        if (interval > 1) {
          return `${interval} days`;
        }
        interval = Math.floor(seconds / 3600);
      
        if (interval > 1) {
          return `${interval} hours`;
        }
        interval = Math.floor(seconds / 60);
      
        if (interval > 1) {
          return `${interval} minutes`;
        }
      
        return `${Math.floor(seconds)} seconds`;
    };
      

    useEffect(() => {
        !searchActivate && fetchStoryById() ;
        searchActivate && setStory(item) ;
        // console.log(item) ;
    },[]) ;

    return story && 
        <div className="news-item">
        <p><a className="link" href={story.url}> <h3> {story?.title} </h3> </a> </p>
        {/* <span> ({story?.url}) </span>  */}
        <p className="desc"> <span> { searchActivate ? `${story?.points}` : story?.score} point{story?.points>1 && 's'} {story?.score>1 && !searchActivate && 's' } </span> 
            <span>  <b>Posted:</b> { searchActivate ? mapTime(story?.created_at_i) : mapTime(story?.time)} <b>By:</b> {searchActivate ? story?.author : story?.by} </span>
        </p>
     </div>
     ;
}

export default News ;