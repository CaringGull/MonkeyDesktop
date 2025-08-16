const img = document.getElementById("monkey");
const audio = document.getElementById("monkeySound");
const dragHandle = document.getElementById("dragHandle");

const SIT = "assets/MonkeysitOK.png";
const SLEEP = "assets/MonkeysleepOK.png";
const SCR1 = "assets/monkey-scratchOK.png";
const SCR2 = "assets/Monkeyscratch2OK.png";

const scratchFrames = [SCR1, SCR2, SCR1, SCR2];

let sleeping = false;
let scratchTimer = null;
let scratchInterval = null;
let frame = 0;
let audioUnlocked = false;

function resizeToNatural(imgEl) {
  if (imgEl.complete) {
    window.monkeyAPI?.resizeToSprite(imgEl.naturalWidth, imgEl.naturalHeight);
  } else {
    imgEl.onload = () => window.monkeyAPI?.resizeToSprite(imgEl.naturalWidth, imgEl.naturalHeight);
    imgEl.onerror = () => console.warn(`Failed to load image: ${imgEl.src}`);
  }
}
resizeToNatural(img);

function unlockAudio() {
  if (!audioUnlocked) {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
  }
}

function setSleepState(isSleeping) {
  sleeping = isSleeping;
  img.src = isSleeping ? SLEEP : SIT;
  img.setAttribute("aria-pressed", String(isSleeping));
  
  // Update body class for styling
  if (isSleeping) {
    document.body.classList.add("sleeping");
  } else {
    document.body.classList.remove("sleeping");
  }

  if (isSleeping) {
    clearInterval(scratchInterval);
    clearTimeout(scratchTimer);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    audio.pause();
    audio.currentTime = 0;
    scheduleScratch();
  }
}

function playScratchOnce() {
  if (sleeping) return;
  clearInterval(scratchInterval);

  let count = 0;
  frame = 0;

  scratchInterval = setInterval(() => {
    if (sleeping) {
      clearInterval(scratchInterval);
      img.src = SLEEP;
      return;
    }
    img.src = scratchFrames[frame];
    frame = (frame + 1) % scratchFrames.length;
    count++;
    if (count >= scratchFrames.length) {
      clearInterval(scratchInterval);
      img.src = SIT;
    }
  }, 140);
}

function scheduleScratch() {
  clearTimeout(scratchTimer);
  const delay = 3000 + Math.random() * 6000;
  scratchTimer = setTimeout(() => {
    if (!sleeping) playScratchOnce();
    scheduleScratch();
  }, delay);
}

// HOVER TO SLEEP - Simple and no conflicts!
img.addEventListener("mouseenter", () => {
  if (!sleeping) {
    unlockAudio();
    setSleepState(true);
  }
});

img.addEventListener("mouseleave", () => {
  if (sleeping) {
    setSleepState(false);
  }
});

// No hover handlers for drag handle - let it just be draggable
// Remove all click handlers - no more conflicts!

// Cleanup timers when window unloads
window.addEventListener("beforeunload", () => {
  clearTimeout(scratchTimer);
  clearInterval(scratchInterval);
});

// Initialize
img.src = SIT;
setSleepState(false);




