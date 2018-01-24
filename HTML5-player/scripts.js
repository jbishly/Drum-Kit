/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const screen = player.querySelector('.full__screen');

/* Build out functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚'; // `this` is the `video`
  toggle.textContent = this.paused ? '►' : '❚ ❚'; 
  console.log({toggle});  // log the `{toggle}` out to see where the `textContent` is
}

function skip() {
  /*
  the two skip buttons are: <button data-skip="-10"></button> and <button data-skip="25"></button>
  console.log(this.dataset) can get the information which is the value we just added as data-skip attribute on HTML 
  then we use its skip property and parseFloat into a float number to -10s or +25s the currentTime
  */
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
/* 
the two input sliders are: <input type="range" name="volume"> and <input type="range" name="playbackRate">
the name of this.name is the volume or playbackRate, we just need to define the name attributes of the inputs on HTML
*/
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  /*change the progress bar width when dragging or clicking on it
  to console.log(e) the MouseEvent out and you will find the offsetX which is relative to the progress offsetWidth, use them to calculate the scrubTime and then update the video's currentTime
  */
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function fullScreen() {
  if (video.requestFullscreen) {
  	video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
  	video.mozRequestFullScreen(); //Firefox 
  } else if (video.webkitRequestFullScreen) {
  	video.webkitRequestFullScreen(); //Chrome & Safari
  }
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

screen.addEventListener('click', fullScreen);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); //when someone moves the mouse it's true, and move on to && scrub
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

