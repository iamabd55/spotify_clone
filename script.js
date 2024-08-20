let currentSong=new Audio();
let songs;
let currFolder;
function convertSecondsToMinutes(seconds) {
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);

    // Calculate the remaining seconds
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to ensure two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
    currFolder=folder;
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}
const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/" + track)
    currentSong.src=`/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src="pause-button-main.svg"

    }
    document.querySelector(".info").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/10:00"
}


async function main()
{
    
    songs= await getSongs("songs/test")
    playMusic(songs[0],true)
    let songUL=document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
        <img class="invert" src="music-svgrepo-com.svg" alt="">
        <div class="song-info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>ABD</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play-BW.svg" alt="">
        </div>
    </li>`
    }

    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".song-info").firstElementChild.innerHTML)
            document.title=e.querySelector(".song-info").firstElementChild.innerHTML
            playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim())
        })
    })
    document.body.onkeyup = function(e) {
        if (e.key == " " ||
            e.code == "Space"      
        ) {
            if(currentSong.paused){
                currentSong.play()
                document.title=currentSong.text
                play.src="pause-button-main.svg"
            }
            else{
                currentSong.pause()
                play.src="play-button-svgrepo-com.svg"
            }
        }
      }
    
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause-button-main.svg"
        }
        else{
            currentSong.pause()
            play.src="play-button-svgrepo-com.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutes(currentSong.currentTime)} / ${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentSong.currentTime=(currentSong.duration*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })

    //Volume adjustment
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
        if(e.target.value<50 && e.target.value !==0){
            document.getElementById("vol-control").src="volume-min-svgrepo-com.svg"
        }
        else if(e.target.value>=50){
            document.getElementById("vol-control").src="volume-max-svgrepo-com.svg"
        }
        if(e.target.value==0){
            document.getElementById("vol-control").src="volume-xmark-svgrepo-com.svg"
        }

    })

    ///
    
}
main()