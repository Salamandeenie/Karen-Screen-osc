console.log("keyboard Loaded");

var lastKey;
var holder = document.getElementById('overlay');

document.addEventListener('keydown', function(event) {
  // Check if the pressed key is a number from 0 to 9
  if (event.key >= '0' && event.key <= '9') {
    if (lastKey === event.key) {
      lastKey = undefined;
      tryImage(event.key);
    } else {
      lastKey = event.key;
    }
  }

  if (event.key == ' ' || event.key == 'o') {
    killPicture();
  }

  if (event.key == 'n') {
    setImage('killedMic.png');
  }
});

function setImage(path) {
  return new Promise(function(resolve, reject) {
    // Set holder's image source to the specified path
    holder.style.display = 'inline';  // or 'inline' or any other appropriate value
    holder.src = 'images/' + path;

    // Handle image load errors
    holder.onerror = function() {
      console.error('Error loading image: ' + path);
      // You can hide the holder or set a default image here
      holder.style.display = 'none';
      reject(); // Reject the promise on error
    };

    // Resolve the promise when the image successfully loads
    holder.onload = function() {
      resolve();
    };
  });
}

function killPicture() {
  holder.style.display = 'none';
}

async function tryImage(key) {
  try {
    // Attempt to set the image with the file extension '.gif'
    await setImage(key + '.gif');
  } catch (error1) {
    try {
      // If '.gif' fails, attempt to set the image with the file extension '.png'
      await setImage(key + '.png');
    } catch (error2) {
      // If both attempts fail, throw an error
      console.error('Error: Requested Image does not exist');
    }
  }
}
