import electron from 'electron';


let container = document.querySelector('.visualization');
let containerRect = container.getBoundingClientRect();

let canvas = container.querySelector('canvas');
let canvasContext = canvas.getContext('2d');
canvas.width = containerRect.width;
canvas.height = containerRect.height;

const LINES_COUNT = 180;
const ANGLE_INTERVAL = 360 / LINES_COUNT;
const ANGLE_ROTATION = -90;
const CENTER_OFFSET = container.querySelector('.song-thumbnail')
    .getBoundingClientRect().width / 2 + 40;



let controls = {
    play: document.querySelector('.control[data-action="play"]'),
    pause: document.querySelector('.control[data-action="pause"]'),
    previous: document.querySelector('.control[data-action="previous"]'),
    next: document.querySelector('.control[data-action="next"]')
};
let song = {
    title: document.querySelector('.song-title'),
    artist: document.querySelector('.song-artist')
};
let searchPaths = [
    '/Users/arnelle/Music'
];

let play = (index) => electron.ipcRenderer.send('play', index);
let previous = () => electron.ipcRenderer.send('previous');
let next = () => electron.ipcRenderer.send('next');

electron.ipcRenderer.send('search-audio-files', searchPaths);
electron.ipcRenderer.on('search-audio-files', (e) => play(0));

electron.ipcRenderer.on('play', (e, audioData) => {
    song.title.textContent = audioData.title;
    song.artist.textContent = audioData.artist;
    audio.src = audioData.path;
});



let audio = new Audio();
audio.autoplay = true;

audio.addEventListener('play', function() {
    controls.play.classList.add('hidden');
    controls.pause.classList.remove('hidden');
});

audio.addEventListener('pause', function() {
    controls.play.classList.remove('hidden');
    controls.pause.classList.add('hidden');
});

audio.addEventListener('ended', next);

controls.play.addEventListener('click', audio.play.bind(audio));
controls.pause.addEventListener('click', audio.pause.bind(audio));
controls.previous.addEventListener('click', previous);
controls.next.addEventListener('click', next);



let audioContext = new window.AudioContext();
let sourceNode = audioContext.createMediaElementSource(audio);
let analyserNode = audioContext.createAnalyser();
sourceNode.connect(analyserNode);
analyserNode.connect(audioContext.destination);

let audioData = new Uint8Array(analyserNode.frequencyBinCount);
let audioDataBackup = audioData;
drawPlayerAudioDataLines();





/** Draw audio data lines based on actual audio data from analyser node. **/
function drawPlayerAudioDataLines() {
    if (audio.paused) {
        audioData = audioDataBackup;
    } else {
        analyserNode.getByteTimeDomainData(audioData);
        audioDataBackup = audioData;
    }
    let interval = Math.floor(audioData.length / LINES_COUNT);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.lineCap = 'round';
    canvasContext.strokeStyle = getPlayerMainColor();

    for (let i = 0; i < LINES_COUNT; i++) {
        let data = ((audioData[i * interval] || 128) - 128) / 4;
        let line = getPlayerCoordinatesForLine(i, data);

        canvasContext.beginPath();
        canvasContext.moveTo(line.start.x, line.start.y);
        canvasContext.lineTo(line.end.x, line.end.y);
        canvasContext.stroke();
    }

    setTimeout(drawPlayerAudioDataLines, 10);
}


/**
 *  Get the start and end coordinates for the i-th line of the visualization,
 *  with the appropriate adjustments and normalizations applied.
 **/
function getPlayerCoordinatesForLine(i, length) {
    let angle = i * ANGLE_INTERVAL + ANGLE_ROTATION;
    let start = getPointFromOriginAt(CENTER_OFFSET, deg2rad(angle));
    let end = getPointFromOriginAt(length + CENTER_OFFSET, deg2rad(angle));

    return {
        start: normalizeCoordinates(start),
        end: normalizeCoordinates(end)
    };
}

/** Get point coordinates at the given distance and angle from origin. **/
function getPointFromOriginAt(distance, angle) {
    let x = Math.cos(angle) * distance;
    let y = Math.sin(angle) * distance;
    return { x, y };
}


/** Translate the coordinates origin to the center of the canvas. **/
function normalizeCoordinates(point) {
    point.x = point.x + origin().x;
    point.y = point.y + origin().y;
    return point;
}


/** Get the coordinates of the origin, which is the center of the canvas. **/
function origin() {
    return { x: canvas.width / 2, y: canvas.height / 2 };
}


/** Convert angle from degrees to radians. **/
function deg2rad(angle) {
    return angle * Math.PI / 180;
}


/** Convert angle from radians to degrees. **/
function rad2deg(angle) {
    return angle * 180 / Math.PI;
}


/** Get the main color of the player from it's styles. **/
function getPlayerMainColor() {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue('--player-color-main');
}
