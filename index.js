let videoName;
let frames;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const inputElement = document.getElementById('videoInput');

// when user inputs video, load it in our video element
inputElement.addEventListener('change', () => {
  frames = [];
  let fileList = inputElement.files;
  videoName = fileList[0].name.split('.')[0];
  video.src = fileList[0].name;
  video.load();
});


const ctx = canvas.getContext('2d');
// when the video is playing draw each frame to canvas
// then encode the canvas as a base64 png
video.addEventListener('play', () => {
  function drawFrame() {
    if(!video.paused && !video.ended) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let img = canvas.toDataURL("image/png");
      frames.push(img);
      requestAnimationFrame(drawFrame);
    }
  }
  requestAnimationFrame(drawFrame);
});

// download the encoded png files as a zip
function downloadFrames() {
  video.pause();
  if(frames) {
    console.log(frames.length + ' frames captured');
    let zip = new JSZip();
    let zipFilename = videoName + "Frames.zip";

    // save one frame for every 100 captures
    for(let i = 0; i < frames.length; i += 100) {
      zip.file(i + ".png", frames[i].split(',')[1], {base64: true});
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, zipFilename);
    });
  }
}
