const api_key = "6bf83e4a21816576aa2473bc47239ace";
let i = 0;
window.onload = async function () {
  await load();
};
document.getElementById("close-search-btn").addEventListener("click", () => {
  let sc = document.getElementById("searchcontent");
  while (sc.firstChild) {
    sc.removeChild(sc.lastChild);
  }
  let searchRoot = document.getElementById("searchroot");
  searchRoot.className = "hidden";
  let root = document.getElementById("root");
  root.className = "";
});
document.getElementById("search").addEventListener("keyup", (e) => {
  if (e.key !== "Enter") {
    return;
  }
  let s = e.target.value;
  e.target.value = "";
  fetch(
    "https://api.themoviedb.org/3/search/movie?api_key=" +
      api_key +
      "&query=" +
      s
  )
    .then((data) => {
      data.json().then((data) => {
        let wrap = document.getElementById("searchcontent");
        for (let i = 0; i < data.results.length; i++) {
          let title = data.results[i].title;
          let votes = data.results[i].vote_average;

          let poster =
            "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path;

          let container = document.createElement("div");
          container.className = "movie-card";
          let titleElement = document.createElement("p");
          let voteElement = document.createElement("p");
          let posterElement = document.createElement("img");
          posterElement.className = "movie-poster";
          titleElement.className = "movie-title";
          voteElement.className = "movie-votes";

          titleElement.innerHTML = title;
          voteElement.innerHTML = votes + " ⭐️";
          posterElement.src = poster;
          posterElement.alt = "Could not retrieve";
          container.append(posterElement);
          container.append(titleElement);
          container.append(voteElement);
          posterElement.onclick = () => displayDetails(data.results[i]);
          wrap.append(container);
        }
        let searchRoot = document.getElementById("searchroot");
        searchRoot.className = "";
        let root = document.getElementById("root");
        root.className = "hidden";
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

function load() {
  let root = document.getElementById("root");
  let wrap = document.createElement("div");
  wrap.className = "movie-list";
  wrap.id = "movies-grid";
  root.append(wrap);
  let d = document.createElement("div");
  d.style = "display:flex; justify-content:center; padding: 20px";
  let button = document.createElement("button");
  button.innerHTML = "Load more";
  button.id = "load-more-movies-btn";
  d.append(button);

  button.onclick = getMovies;
  root.append(d);
  getMovies();
}
function displayDetails(data) {
  let s = document.getElementsByClassName("movie-poster");
  for (i = 0; i < s.length; i++) {
    s[i].classList.add("no-hover");
  }
  console.log(data);
  let id = data.id;

  fetch(
    "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + api_key
  ).then((res) => {
    res.json().then((res) => {
      console.log(res);
      let button = document.createElement("button");
      let container = document.getElementById("details");
      let inner = document.getElementById("inner");
      button.id = "close-btn";
      button.innerHTML = "Close";

      container.append(button);
      button.onclick = closeDetails;

      inner.className = "movie-popup";
      container.className = "popup";
      document.body.style.overflow = "hidden";

      let backdrop = "https://image.tmdb.org/t/p/w780" + data.backdrop_path;
      let backdropElement = document.getElementById("poster");
      backdropElement.src = backdrop;
      let titleElement = document.getElementById("title");

      let min = document.getElementById("min");
      let date = document.getElementById("date");
      let genre = document.getElementById("genre");
      let votes = document.getElementById("votes");
      let summary = document.getElementById("summary");
      min.innerHTML = res.runtime + " mins | ";
      genre.innerHTML = "";
      for (let i = 0; i < res.genres.length - 1; i++) {
        genre.innerHTML += res.genres[i].name + ", ";
      }
      genre.innerHTML += res.genres[res.genres.length - 1].name + " | ";
      titleElement.innerHTML = data.title;
      votes.innerHTML = data.vote_average + "⭐️";
      date.innerHTML = data.release_date + " | ";
      summary.innerHTML = data.overview;
    });
  });
}
function closeDetails() {
  let s = document.getElementsByClassName("movie-poster");
  for (i = 0; i < s.length; i++) {
    s[i].classList.remove("no-hover");
  }
  document.getElementById("close-btn").remove();
  let container = document.getElementById("details");
  container.className = "";
  let inner = document.getElementById("inner");
  inner.className = "hidden";
  document.body.style.overflow = "auto";
}
function getMovies() {
  i++;
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      api_key +
      "&language=en-US&page=" +
      i,
    {
      method: "GET",
    }
  )
    .then((data) => {
      data.json().then((data) => {
        let wrap = document.getElementById("movies-grid");
        for (let i = 0; i < data.results.length; i++) {
          let title = data.results[i].title;
          let votes = data.results[i].vote_average;

          let poster =
            "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path;

          let container = document.createElement("div");
          container.className = "movie-card";
          let titleElement = document.createElement("p");
          let voteElement = document.createElement("p");
          let posterElement = document.createElement("img");
          posterElement.className = "movie-poster";
          titleElement.className = "movie-title";
          voteElement.className = "movie-votes";

          titleElement.innerHTML = title;
          voteElement.innerHTML = votes + " ⭐️";
          posterElement.src = poster;
          posterElement.alt = "Could not retrieve";
          container.append(posterElement);
          container.append(titleElement);
          container.append(voteElement);
          posterElement.onclick = () => displayDetails(data.results[i]);
          wrap.append(container);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
