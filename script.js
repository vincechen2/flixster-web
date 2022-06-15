const api_key = "6bf83e4a21816576aa2473bc47239ace";
let page = 0;
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
  let sc = document.getElementById("searchcontent");
  while (sc.firstChild) {
    sc.removeChild(sc.lastChild);
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
function video(data) {
  let id = data.id;
  fetch(
    "https://api.themoviedb.org/3/movie/" +
      id +
      "/videos?api_key=" +
      api_key +
      "&language=en-US"
  ).then((res) => {
    res.json().then((res) => {
      let url = "https://www.youtube.com/embed/";
      let x = document.createElement("iframe");
      x.width = "560";
      x.height = "315";
      x.title = "YouTube video player";
      x.frameborder = "0";
      x.allow = "autoplay";

      if (res.results.length > 0) {
      }
      for (let i = 0; i < res.results.length; i++) {
        if (res.results[i].type === "Trailer") {
          url += res.results[i].key;
          break;
        }
      }

      x.id = "trailer";

      url += "?autoplay=1";
      x.src = url;

      let inner = document.getElementById("inner");
      let backdropElement = document.getElementById("poster");
      inner.replaceChild(x, backdropElement);
    });
  });
}
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
  let poster = document.querySelector(".movie-card .movie-poster:hover");
  console.log(poster);
  poster.className = "hidden2";

  let id = data.id;
  fetch(
    "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + api_key
  ).then((res) => {
    res.json().then((res) => {
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
      backdropElement.onclick = () => video(data);
    });
  });
}
function closeDetails() {
  let poster = document.querySelector(".hidden2");
  poster.className = "movie-poster";
  let t = document.getElementById("trailer");
  if (t) {
    let y = document.createElement("img");
    y.id = "poster";
    y.className = "movie-backdrop";
    let inner = document.getElementById("inner");
    inner.replaceChild(y, t);
  }

  document.getElementById("close-btn").remove();
  let container = document.getElementById("details");
  container.className = "";

  let inner = document.getElementById("inner");
  inner.className = "hidden";
  document.body.style.overflow = "auto";
}
function getMovies() {
  page++;
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      api_key +
      "&language=en-US&page=" +
      page,
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
