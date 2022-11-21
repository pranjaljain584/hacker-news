import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import './homepage.css';
import { sortBy } from 'lodash';
import {
  faSquareH,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import News from './News';

const BASE_PATH = 'http://hn.algolia.com/api/v1/' ;

function HomePage(props) {

  const [allStoryIds, setAllStoryIds] = useState([]) ;
  const [count,setCount] = useState(0) ;
  const [searchText,setSearchText] = useState('') ;
  const [tag, setTag] = useState('story');
  const [sort,setSortBy] = useState('popularity') ;
  const [time,setTime] = useState('all time') ;
  const [resultList,setResultList] = useState([]) ;
  const [searchActivate,setSearchActivate] = useState(false) ;

  const handleTime = (e) => {
    setTime(e.target.value) ;
  }

  const handleSort = (e) => {
    console.log(sortBy) ;
    setSortBy(e.target.value) ;
    const sortParameter = e.target.value == "date" ? 'created_at_i' : 'points' ;
    console.log(sortParameter) ;
    const sortedList = sortBy(resultList, sortParameter);
    setResultList(sortedList) ;
    console.log(resultList) ;
    console.log(sortedList) ;
    // setResultList([]) ;
  }

  const handleChange = (event) => {
    setTag(event.target.value);
  };

  const fetchAllStories = async () => {
    const result = await axios.get(`https://hacker-news.firebaseio.com/v0/newstories.json`) ;
    setAllStoryIds(result.data) ;
  }

  const handleSearch = async (e) => {
    e.preventDefault() ;
    const searchType = time !== 'all time' ? 'search_by_date' : 'search' ;
    const searchTag = tag == 'all' ? '' : tag ;
    const searchResult = await axios.get(`${BASE_PATH}${searchType}?query=${searchText}&tags=${searchTag}`) ;
    console.log(searchResult) ; 
    setResultList(searchResult.data.hits) ;
    setSearchActivate(true) ;
  }

  const onChange = (e) => {
    setSearchText(e.target.value) ;
  }

  useEffect(() => {
    fetchAllStories() ;
  },[]) ; 

  // useEffect(() => {

  // },[sortBy]) ;

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

        <div className='latest-news'>
        <ul>
          <li><a href="" onClick={() => {setSearchActivate(false)}}>Latest News</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false)}}>Past</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false)}}>Comments</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false)}}>Ask</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false)}}>Show</a></li>
        </ul>
        </div>

      </div>

      <div className='filters'>
        <form onSubmit={handleSearch} >
          {/* <FontAwesomeIcon icon={faSearch} className="icon2" /> */}
          <input
            type="text"
            onChange={onChange}
            className="input"
            placeholder='Search'
            // value={searchText}
          />

          <label>
            <select value={tag} onChange={handleChange}>
              <option value="all">All</option>
              <option value="story">Stories</option>
              <option value="comment">Comments</option>
            </select>
          </label>

          

          <label>
            for
            <select value={time} onChange={handleTime}>
              <option value="all time">All time</option>
              <option value="last 24h">Last 24h</option>
              <option value="past week">Past Week</option>
              <option value="past month">Past Month</option>
              <option value="past year">Past Year</option>
            </select>
          </label>

          <button type='Submit'>
            Search
          </button>

        </form>

        <label>
            Sort by
            <select value={sort} onChange={handleSort}>
              <option value="date">Date</option>
              <option value="popularity">Popularity</option>
            </select>
          </label>
      </div>

      <div className='news-list'>
          { searchActivate ? resultList?.map((item,key) => (
            <News key={key} id={0} searchActivate={searchActivate} item={item} />
          )) 
          : 
          allStoryIds.slice(count,count+20).map((id) => (
            <News key={id} id={id} searchActivate={searchActivate} item="" />
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