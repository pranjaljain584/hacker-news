import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import './homepage.css';
import {
  faSquareH
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import News from './News';

function HomePage(props) {

  const [allStoryIds, setAllStoryIds] = useState([]) ;
  const [count,setCount] = useState(0) ;

  const fetchAllStories = async () => {
    const result = await axios.get(`https://hacker-news.firebaseio.com/v0/newstories.json`) ;
    setAllStoryIds(result.data) ;
  }

  const handleSearch = async () => {
    const searchResult = await axios.get('http://hn.algolia.com/api/v1/search?query=foo&tags=story') ;
    console.log(searchResult) ; 
  }

  useEffect(() => {
    fetchAllStories() ;
  },[]) ; 

  return (
    <div>
      <div className='tab'>

        <div className='name'>
          <FontAwesomeIcon
          className='icon'
          icon={faSquareH}
          />
          <h1 className='hackernews'>
            Hacker News
          </h1> 
        </div>

        <div className='search-bar'>
          {/* <h1>Search</h1> */}
          <button onClick={handleSearch} >
            Search
          </button>
        </div>

      </div>

      <div className='filters'>
        Sort by... 
      </div>

      <div className='news-list'>
          news
          {allStoryIds.slice(count,count+20).map(id => (
            <News key={id} id={id} />
          ))}
          <button onClick={() => {
            if(count+20>500) return ;
            setCount(count+20) ;
          }}> 
          More.. {count}
          </button>
      </div>
    </div>
  );
}


export default HomePage ;