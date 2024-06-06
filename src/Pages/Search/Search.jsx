import { Link, useLocation } from "react-router-dom";
import tmdbAPI from "../../api/tmdbAPI";
import { useEffect, useState } from "react";
import './Search.css'
import { useDebounce } from "../../hooks/useDebounce";

const Search = () => {

  // useLocation().search
  // URL의 search 뒤에 쿼리 문자열을 반환 ?q=${e.target.value}을 반환함

  // new URLSearchParams
  // 성자 함수로 new와 함께 사용하며 쿼리 문자열을 쉽게 파싱하고 조작할 수 있음
  // 파싱은 문자열을 키-값 쌍으로 변환하는 것을 의미 (이 코드에서는 q : ${e.target.value})
  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }

  // ?q=${e.target.value} 부분이 변수에 담기고 벨류는 바뀌니까 let으로 할당
  // useQuery()를 실행한 값  q : ${e.target.value} 담김
  let query = useQuery()
  
  // query.get('q')
  // q : ${e.target.value}에서 q키의 값인 ${e.target.value}가 담김
  const searchText = query.get('q')
  
  // 최종적인 value값만 가져오기 위해 useDebounce에 값과 지연시간을 인자로 넣어준다.
  const debounceSearchText = useDebounce(searchText, 500)

  // 검색어에 맞는 영화 데이터를 관리
  const [searchData, setSearchData] = useState([])

  const fetchSearchMovie = async (searchText) => {
    try {
      const response = await tmdbAPI.get(
        `/search/multi?include_adult=false&query=${searchText}`
      )
      setSearchData(response.data.results)

    } catch (error) {
      console.log(error.message);
    }
  }
  console.log(searchData)

  // 페이지가 렌더링 할 때 debounceSearchText가 있으면 렌더링
  // debounceSearchText가 바뀌면 다시 렌더링
  useEffect(() => {
    if(debounceSearchText) {
      fetchSearchMovie(debounceSearchText)
    }
  }, [debounceSearchText])
  
  // 검색 결과가 없을 떄는 에러 문구, 있을 땐 데이터 뿌리기
  if(searchData.length > 0){
    return(
      <section className="search_container">
        {searchData.map((movie => {
          if((movie.backdrop_path !== null && movie.backdrop_path !== undefined) && 
          (movie.poster_path !== null && movie.poster_path !== undefined)){
            return(
              <div className="search-movie" key={movie.id}>
                <Link to={`/movie/${movie.id}`}  style={{ textDecoration: "none"}} >
                  <img
                    className="search-movie_img"
                    src={`http://image.tmdb.org/t/p/w500${movie.backdrop_path}`}/>
                  <p className="search-movie-title">{movie.name || movie.original_title}</p>
                </Link>
                <p className="search-movie-vote_average">{movie.vote_average}</p>
              </div>
            )
          }
        }))}
      </section>
    )
    
  } else{
    return (
      <section className="error">
        <p className="error_messege"> '{searchText}'에 해당하는 영화 및 TV 프로그램이 없습니다.</p>
      </section>
    );
  }
};

export default Search;