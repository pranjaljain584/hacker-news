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

const BASE_PATH = 'https://hn.algolia.com/api/v1/' ;


function HomePage(props) {

  const [allStoryIds, setAllStoryIds] = useState([]) ;
  const [count,setCount] = useState(20) ;
  const [searchText,setSearchText] = useState('') ;
  const [tag, setTag] = useState('story');
  const [sort,setSortBy] = useState('points') ;
  const [time,setTime] = useState('all time') ;
  const [resultList,setResultList] = useState([]) ;
  const [searchActivate,setSearchActivate] = useState(false) ;
  const [ctr,setCtr] = useState(1) ;
  const [filters, setFilters] = useState(false) ;

  const handleTime = (e) => {
    setTime(e.target.value) ;
    handleSearch(e,searchText,e.target.value,tag) ;
  }

  const handleSort = (e) => {
    setSortBy(e.target.value) ;
  }

  const handleChange = (e) => {
    setTag(e.target.value);
    handleSearch(e,searchText,time,e.target.value) ;
  };

  const onChange = (e) => {
    setSearchText(e.target.value) ;
    filters && handleSearch(e,e.target.value,time,tag) ;
  }


  const fetchAllStories = async () => {
    const result = await axios.get(`https://hacker-news.firebaseio.com/v0/newstories.json`) ;
    setAllStoryIds(result.data) ;
  }

  const handleSearch = async (e,searchText2,time2,tag2) => {
    e.preventDefault() ;

    // if(searchText2===''){
    //   setSearchActivate(false) ;
    //   return ;
    // }

    const searchType = time2 !== 'all time' ? 'search_by_date' : 'search' ;
    const searchTag = tag2 === 'all' ? '' : tag2 ;

    const currentDateTime = new Date();
    const resultInSeconds=currentDateTime.getTime() / 1000;
    let timestmp ;

    switch (time2) {
      case "last 24h":
        timestmp = resultInSeconds - 24*60*60 ;
        break;
      case "past week":
        timestmp = resultInSeconds - 7*24*60*60 ;
        break;
      case "past month":
        timestmp = resultInSeconds - 30*24*60*60 ;
        break;
      case "past year":
        timestmp = resultInSeconds - 365*24*60*60 ;
        break;
    
      default:
        timestmp=0 ;
        break;
    }

    let searchResult ;
    if(searchType==='search'){
      searchResult = await axios.get(`${BASE_PATH}${searchType}?query=${searchText2}&tags=${searchTag}`) ;
    }else{
      searchResult = await axios.get(`${BASE_PATH}${searchType}?query=${searchText2}&tags=${searchTag}&numericFilters=created_at_i>${timestmp}`) ;
    }

    setResultList(searchResult.data.hits) ;
    setSearchActivate(true) ;
    setCtr((prev) => prev+1) ;
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
            Hacker News {filters && 'Search'}
          </h1> 
        </div>

        <div className='latest-news'>
        <ul>
          <li><a href="" onClick={() => {setSearchActivate(false) ; setFilters(false);}}>Latest News</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false) ; setFilters(false);}}>Past</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false) ; setFilters(false);}}>Comments</a></li>
          <li><a href="" onClick={() => {setSearchActivate(false) ; setFilters(false);}}>Ask</a></li>
        </ul>
        </div>

      </div>

      <div className='filters'>
        <div>
        <form onSubmit={(e) =>{
          handleSearch(e,searchText,time,tag) ;
          setFilters(true) ;
        }} >
          <input
            type="text"
            onChange={onChange}
            className="input"
            placeholder='Search'
            // value={searchText}
          />

          {filters && <>
            <label>
            <select value={tag} className='dropdown' onChange={handleChange}>
              <option value="all">All</option>
              <option value="story">Stories</option>
              <option value="comment">Comments</option>
            </select>
          </label>

          

          <label>
            for
            <select value={time} className='dropdown' onChange={handleTime}>
              <option value="all time">All time</option>
              <option value="last 24h">Last 24h</option>
              <option value="past week">Past Week</option>
              <option value="past month">Past Month</option>
              <option value="past year">Past Year</option>
            </select>
          </label>

          <label className='sort'>
            sort by
            <select className='dropdown' value={sort} onChange={handleSort}>
              <option className='option' value="created_at_i">Date</option>
              <option className='option' value="points">Popularity</option>
            </select>
          </label>
          </>}

          <button type='Submit' className='search-btn'>
            Search
          <FontAwesomeIcon icon={faSearch} className="icon2" />
          </button>

        </form>
        </div>

        
      </div>

      <div className='news-list'>
          { searchActivate ? <>
            {resultList.length > 0 ? sortBy(resultList,sort).reverse().map((item,key) => (
            <News 
            key={key+30*ctr} 
            sort={sort} id={0} 
            searchActivate={searchActivate} item={item}
            />
          )) : <p className='no-result'>No results to show !</p>}
          </> 
          : 
          <>
          {allStoryIds.slice(0,count).map((id) => (
            <News key={id} id={id} searchActivate={searchActivate} item="" />
          ))}

          <button onClick={() => {
            if(count+20>500) return ;
            setCount(count+20) ;
          }}
          className="more-btn"
          > 
            More..
          </button>
          </>
          }
      </div>
    </div>
  );
}


export default HomePage ;