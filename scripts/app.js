// set up basic variables for app
const slider = document.querySelector('.slider');
const record = document.querySelector('.record');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

var isPaused = false;

var x = 0
var fac = 1.0

// disable stop button while not recording

// visualiser setup - create web audio api context and canvas

let audioCtx;

const canvasCtx = canvas.getContext("2d");
canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
canvasCtx.setLineDash([5, 5]);
canvasCtx.lineWidth = 2;

var offcanvas = document.createElement('canvas');
offcanvas.id = "OffCanvas";
offcanvas.width = canvas.width * 2;
offcanvas.height = canvas.height
const offcanvasCtx = offcanvas.getContext("2d");
offcanvasCtx.fillStyle = 'rgb(0, 64, 0)';
offcanvasCtx.strokeStyle = 'rgb(0, 255, 0)';
offcanvasCtx.lineWidth = 20;

// main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occurred: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw();
  offcanvasCtx.beginPath();
  offcanvasCtx.moveTo(0, canvas.height / 2);

  function draw() {
    if (isPaused) {
      requestAnimationFrame(draw);
      return;
    }

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    let sliceWidth = WIDTH * 1.0 / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      offcanvasCtx.lineTo(x, y);

      x += sliceWidth / fac;

      if (x >= WIDTH) {
        offcanvasCtx.stroke();
        x = 0;
        canvasCtx.drawImage(offcanvas, 0, 0);
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, HEIGHT / 2);
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
        offcanvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        offcanvasCtx.beginPath();
        offcanvasCtx.moveTo(0, canvas.height / 2);
      }
    }
  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();

// Disable scrolling
document.body.style.overflow = 'hidden';
