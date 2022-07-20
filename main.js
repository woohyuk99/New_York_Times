let news = [];
let page = 1;
let total_pages = 0;

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
let url;

// 각 함수에서 필요한 url을 만들기
// api 호출 함수를 부르기

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "QRhx4IpdDya4hR1IcRUq9Zvy1jjPR4c8gjEvvViRnkQ",
    });
    url.searchParams.set("page", page);
    console.log("url은?", url);
    let response = await fetch(url, { headers: header }); // ajax, http, fetch
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      console.log("받는 데이터", data);
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("잡힌 에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  console.log("click", event.target.textContent);
  let topic = event.target.textContent.toLowerCase();

  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );

  getNews();
};

const getNewsByKeyword = async () => {
  //1. 검색 키워드 읽어오기
  //2. url에 검색 키워드 붙이기
  //3. header 준비
  //4. url 부르기
  //5. 데이터 가져오기
  //6. 데이터 부르기

  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
        <div class="col-lg-4">
          <img class="news-img-size" src="${item.media}"/>
        </div>
        <div class="col-lg-8">
          <h2>${item.title}</h2>
          <p>${item.summary}</p>
          <div>${item.rights} * ${item.published_date}</div>
        </div>
      </div>`;
    })
    .join("");
  console.log(newsHTML);
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  //total_page
  //page
  //page group
  let pageGroup = Math.ceil(page / 5);
  //last
  let last = pageGroup * 5;
  //first
  let first = last - 4;
  //first~last page print


  // total page 3
  

  pagenationHTML = `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous"onclick="moveToPage(${page-1})">
    <span aria-hidden="true">&lt;</span>
  </a>
</li>`;
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page==i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  
  pagenationHTML+= `<li class="page-item">
  <a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>`

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) =>{
  //1. 이동하고 싶은 페이지를 알아야 함
  page = pageNum
  
  //2. 이동하고 싶은 페이지를 가지고 api 재호출
  getNews();
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();
