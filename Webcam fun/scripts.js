const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//first of all, we need to get the real video source
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) //get someone's video
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error('OH NO!', err);
    });

}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video. videoHeight;
  canvas.width = width; //makes sure canvas width+height = webcam's width+height to properly render
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); //start at top left corner and paint width+height
    //take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    //mess with them: 

    //pixels = redEffect(pixels); #1

    pixels = rgbSplit(pixels); // #2
    ctx.globalAlpha = 0.1; //stacks the filter for longer time
   
    //pixels = greenScreen(pixels); // #3
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //plays sound
  snap.currentTime = 0;
  snap.play(); 

  //take data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a'); //create link 
  link.href = data; 
  link.setAttribute('download', 'snapshot');
  // rather than: link.textContent = 'Download Image'; which results in a link
  link.innerHTML = `<img src="${data}" alt ="snap shot" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
  }
    return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 100] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i - 150] = pixels.data[i + 2] * 0.5; // BLUE
}
    return pixels;
}

/*function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0; //for alpha set to 0 results to transparent
    }
  }
  return pixels;
} */


getVideo();


video.addEventListener('canplay', paintToCanvas) //once video is played (getVideo function) on webcam, it's going to emit event called 'canplay' which in turn paintToCanvas 
