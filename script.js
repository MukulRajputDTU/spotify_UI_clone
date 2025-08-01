console.log("Let's write javascript.");

let currentSong = new Audio();
let songs;
let curFolder;

async function getSongs(folder) {
    curFolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
            <img class="invert" src="images and videos/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Mukul</div>
                </div>
                <div class="playnow">
                    <img id="play2" class="invert" src="images and videos/playsong.svg" alt="" width="35px">
                </div>
        </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return formattedMinutes + ':' + formattedSeconds;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${curFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "images and videos/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    currentSong.volume = 0.23
    document.querySelector(".range").getElementsByTagName("input")[0].value = 23
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                            <div class="Play">
                                <img src="images and videos/play.svg" alt="" width="40px">
                            </div>
                            <img class="image" src="/songs/${folder}/cover.jpg" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {
    await getSongs("songs/01")
    playMusic(songs[0], true)

    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images and videos/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images and videos/playsong.svg"
        }
    })

    currentSong.addEventListener("ended",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else{
            playMusic(songs[0])
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)

        document.querySelector(".circle").style.left = percent * 100 + "%";
        currentSong.currentTime = currentSong.duration * percent
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100

        if (currentSong.volume > 0.70) {
            vol.src = "images and videos/volume+++.svg"
        }
        else if (currentSong.volume > 0.4) {
            vol.src = "images and videos/volume++.svg"
        }
        else if (currentSong.volume > 0) {
            vol.src = "images and videos/volume+.svg"
        }
        else {
            vol.src = "images and videos/volume.svg"
        }
    })

    document.querySelector(".vol2").addEventListener("click",()=>{
        if(currentSong.volume > 0){
            vol.src = "images and videos/volume.svg"
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            vol.src = "images and videos/volume+.svg"
            currentSong.volume = 0.23
            document.querySelector(".range").getElementsByTagName("input")[0].value = 23
        }
    })

}

main()