

const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}
const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});
const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}
const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.querySelector('.file-input');
    const cropButton = document.querySelector('.crop');
    const previewImg = document.querySelector('.preview-img img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let isCropping = false;
    let startX, startY, endX, endY;
  
    fileInput.addEventListener('change', handleFileSelect);
    cropButton.addEventListener('click', toggleCrop);
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            previewImg.src = canvas.toDataURL('image/png');
          };
          img.src = e.target.result;
        };
  
        reader.readAsDataURL(file);
      }
    }
  
    function toggleCrop() {
      isCropping = !isCropping;
      if (isCropping) {
        previewImg.style.cursor = 'crosshair';
        previewImg.addEventListener('mousedown', startCrop);
      } else {
        previewImg.style.cursor = 'default';
        previewImg.removeEventListener('mousedown', startCrop);
      }
    }
  
    function startCrop(e) {
      startX = e.clientX;
      startY = e.clientY;
  
      document.addEventListener('mousemove', drawCrop);
      document.addEventListener('mouseup', endCrop);
    }
  
    function drawCrop(e) {
      endX = e.clientX;
      endY = e.clientY;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
  
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    }
  
    function endCrop() {
      document.removeEventListener('mousemove', drawCrop);
      document.removeEventListener('mouseup', endCrop);
  
      // Crop the selected area
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
  
      const croppedImage = ctx.getImageData(startX, startY, width, height);
  
      // Update canvas size to match the cropped area
      canvas.width = width;
      canvas.height = height;
  
      // Clear the canvas and draw the cropped image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(croppedImage, 0, 0);
  
      // Update the preview image with the cropped version
      previewImg.src = canvas.toDataURL('image/png');
    }
  });





// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');

// const app = express();

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/video_editor', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Set up routes for video upload, editing, authentication, etc.
// // Example route for video upload using Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// app.post('/upload', upload.single('video'), (req, res) => {
//   // Handle video upload logic
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
