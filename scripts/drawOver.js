console.log("keyboard Loaded");

var lastKey;
var holder = document.getElementById('overlay');

document.addEventListener('keydown', function(event) {
  // Check if the pressed key is a number from 0 to 9
  if (event.key >= '0' && event.key <= '9') {
    if (lastKey === event.key) {
        lastKey = undefined;
        setImage(event.key + '.png'); // Sets the source of the holder div
    } else {
      lastKey = event.key;
    }
  }

  if (event.key == ' ' || event.key == 'o')
  {
    killPicture();
  }

  if (event.key == 'n')
  {
    setImage('killedMic.png');
  }
});

function setImage(path) {
  // Set holder's image source to the specified path
  holder.style.display = 'inline';  // or 'inline' or any other appropriate value
  holder.src = 'images/' + path;
}

function killPicture() {
  holder.style.display = 'none';
}
