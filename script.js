function handleImageUpload() {
    const fileInput = document.getElementById("imageInput");
    const uploadIcon = document.getElementById("uploadIcon");
    const imagePreview = document.getElementById("imagePreview");
    const selectImageBtn = document.getElementById("selectImageBtn");
    const uploadBtn = document.getElementById("uploadBtn");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            localStorage.setItem("uploadedImage", event.target.result); // Store image in localStorage
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
        };

        reader.readAsDataURL(file);

        uploadIcon.style.display = "none"; // Hide the cloud icon
        selectImageBtn.style.display = "none"; // Hide the "Select Image" button
        uploadBtn.style.display = "block"; // Show the "Upload" button
    }
}

function uploadImage() {
    window.location.href = "attack.html";
}

// Stuff for the Scream Meter 

let audioContext;
let analyser;
let microphone;
let running = false;
let animationFrameId;

function startMeter() {
  if (running) return; // Prevent multiple instances
  running = true;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);

      function updateMeter() {
        if (!running) return;

        let array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let volume = array.reduce((a, b) => a + b) / array.length;

        let decibels = Math.round((volume / 256) * 100);
        document.getElementById("decibel-display").innerText = decibels + " dB";
        document.querySelector(".meter-bar").style.width = decibels + "%";

        animationFrameId = requestAnimationFrame(updateMeter);
      }

      updateMeter();
    })
    .catch(function(err) {
      console.error("Error accessing microphone: " + err);
    });
}

function stopMeter() {
  running = false;
  if (microphone) microphone.disconnect();
  if (analyser) analyser.disconnect();
  if (audioContext) audioContext.close();

  cancelAnimationFrame(animationFrameId); // Stop updating
  document.getElementById("decibel-display").innerText = "0 dB";
  document.querySelector(".meter-bar").style.width = "0%";
}
