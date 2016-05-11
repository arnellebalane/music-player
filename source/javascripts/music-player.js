let container = document.querySelector('.visualization');
let containerRect = container.getBoundingClientRect();

let canvas = container.querySelector('canvas');
let context = canvas.getContext('2d');
canvas.width = containerRect.width;
canvas.height = containerRect.height;

const LINES_COUNT = 180;
const ANGLE_INTERVAL = 360 / LINES_COUNT;
const ANGLE_ROTATION = -90;
const CENTER_OFFSET = container.querySelector('.song-thumbnail')
    .getBoundingClientRect().width / 2 + 5;


context.lineWidth = 3;
context.lineCap = 'round';
context.strokeStyle = getPlayerMainColor();

for (let i = 0; i < LINES_COUNT; i++) {
    var line = getPlayerCoordinatesForLine(i, 10);

    context.beginPath();
    context.moveTo(line.start.x, line.start.y);
    context.lineTo(line.end.x, line.end.y);
    context.stroke();
}





/**
 *  Get the start and end coordinates for the i-th line of the visualization,
 *  with the appropriate adjustments and normalizations applied.
 **/
function getPlayerCoordinatesForLine(i, length) {
    var angle = i * ANGLE_INTERVAL + ANGLE_ROTATION;
    var start = getPointFromOriginAt(CENTER_OFFSET, deg2rad(angle));
    var end = getPointFromOriginAt(length + CENTER_OFFSET, deg2rad(angle));

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
