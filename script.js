
let currentSong = new Audio();
let songs;


function secondsToMinutesSeconds(seconds) {
    // Validate input: seconds must be a finite, non-negative number
    if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) {
        return "00:00"; // Default for invalid or negative inputs
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Ensure two-digit formatting
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }  
    }
    return songs
}

const playMusic = (track, pause=false)=>{
    
    currentSong.src = "/songs/" + track
    if(!pause){
    currentSong.play();
    play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {

    // Get the list of all the songs
    songs = await getSongs()
    playMusic(songs[0], true)
    
    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML =  songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="music">
                    <div class="info">
                        <div> ${song.replaceAll("%20", " ")}</div>
                        <div>Artist</div>
                    </div>
                    <div class="playnow">
                         <span>Play Now</span>
                         <img class="invert" src="play.svg" alt="">
                    </div></li>`;
    }
    
    //Attach an event listner to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })   
    }) 
    
    //Attach an event listener to play, next and previous

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for timeupdate event

    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.
        currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.
        duration) * 100 + "%"  
    })

    // add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"  ;
        currentSong.currentTime = ((currentSong.duration) * percent) / 100    
    })


    prevsong.addEventListener("click", ()=>{
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // add an event listner to next button

    nextsong.addEventListener("click", ()=>{
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index + 1) < songs.length ) {
            playMusic(songs[index + 1])
        }
    })
  
    // add an event listner to repeat button

    let repeatEnabled = false; // Repeat is disabled by default

    repeat.addEventListener("click", () => {
    repeatEnabled = !repeatEnabled; // Toggle repeat mode
    });


    // Add logic to handle repeat when a song ends

    currentSong.addEventListener("ended", () => {
        if (repeatEnabled) {
            playMusic(currentSong.src.split("/").slice(-1)[0]); // Replay the current song
        } else {
            // Optionally, move to the next song if repeat is not enabled
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1]);
            }
        }
    });

}

main()
    
   
