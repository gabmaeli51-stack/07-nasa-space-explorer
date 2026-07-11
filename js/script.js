// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Find the button and gallery container from index.html
const fetchButton = document.querySelector('.filters button');
const galleryContainer = document.getElementById('gallery');

// Use the DEMO_KEY for testing the APOD endpoint
const NASA_API_KEY = 'DEMO_KEY'; 

// Call the setupDateInputs function from dateRange.js to set up defaults
setupDateInputs(startInput, endInput);

// --- LevelUp: Random Space Fact Array ---
const spaceFacts = [
  "One day on Venus is longer than one year on Earth.",
  "Neutron stars can spin up to 600 times per second.",
  "Footprints left on the Moon won't disappear because there is no wind or atmosphere.",
  "Space is completely silent because there is no air to carry sound waves.",
  "The Apollo astronauts' footprints will probably stay on the Moon for at least 100 million years."
];

// Display a random space fact right when the page loads
window.addEventListener('DOMContentLoaded', () => {
  const factElement = document.createElement('div');
  factElement.style.padding = "15px";
  factElement.style.marginBottom = "20px";
  factElement.style.background = "linear-gradient(135deg, #0d121f 0%, #070a12 100%)";
  factElement.style.border = "1px solid rgba(11, 61, 145, 0.5)";
  factElement.style.boxShadow = "0 4px 20px rgba(11, 61, 145, 0.25)";
  factElement.style.borderRadius = "12px";
  factElement.style.color = "#e2e8f0";
  factElement.style.fontWeight = "bold";
  factElement.style.textAlign = "center";
  
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factElement.textContent = `🌌 Did You Know? ${spaceFacts[randomIndex]}`;
  
  galleryContainer.parentNode.insertBefore(factElement, galleryContainer);
});

// --- Fetch Data from NASA's API ---
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Clear current gallery and display the loading message string
  galleryContainer.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos...</p></div>`;

  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network issue fetching data.");
    }
    
    const data = await response.json();
    const itemsToDisplay = Array.isArray(data) ? data.slice(0, 9) : [data];
    
    displayGallery(itemsToDisplay);
    
  } catch (error) {
    console.error("Error encountered:", error);
    galleryContainer.innerHTML = `<div class="placeholder"><p>❌ Missing or invalid data. Please check your dates and try again.</p></div>`;
  }
}

// --- Display Gallery Items ---
function displayGallery(items) {
  galleryContainer.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('gallery-item');

    let mediaHTML = '';
    if (item.media_type === 'video') {
      mediaHTML = `<div style="height:200px; display:flex; align-items:center; justify-content:center; background:#171e30; color:#a5b4fc; font-weight:bold; border-radius: 8px 8px 0 0;">📹 Video Entry (Click to Open)</div>`;
    } else {
      mediaHTML = `<img src="${item.url}" alt="${item.title}">`;
    }

    card.innerHTML = `
      <div class="media-frame" style="width: 100%; height: 200px; overflow: hidden;">
        ${mediaHTML}
      </div>
      <p style="padding: 15px; color: #cbd5e1;"><strong>${item.title}</strong><br><small style="color: #94a3b8;">${item.date}</small></p>
    `;

    card.addEventListener('click', () => openModal(item));
    galleryContainer.appendChild(card);
  });
}

// --- Build and Manage the Modal Component ---
const modalOverlay = document.createElement('div');
modalOverlay.style.position = "fixed";
modalOverlay.style.top = "0";
modalOverlay.style.left = "0";
modalOverlay.style.width = "100%";
modalOverlay.style.height = "100%";
modalOverlay.style.background = "rgba(3, 5, 10, 0.85)";
modalOverlay.style.backdropFilter = "blur(5px)";
modalOverlay.style.display = "none";
modalOverlay.style.justifyContent = "center";
modalOverlay.style.alignItems = "center";
modalOverlay.style.zIndex = "1000";
modalOverlay.style.padding = "20px";

const modalBox = document.createElement('div');
modalBox.style.background = "#0d121f";
modalBox.style.border = "2px solid #fc3d21"; // Glowing NASA Red accent line!
modalBox.style.boxShadow = "0 0 25px rgba(252, 61, 33, 0.35)";
modalBox.style.padding = "30px";
modalBox.style.borderRadius = "16px";
modalBox.style.maxWidth = "750px";
modalBox.style.width = "100%";
modalBox.style.maxHeight = "85vh";
modalBox.style.overflowY = "auto";
modalBox.style.position = "relative";
modalBox.style.color = "#f1f5f9";

const closeButton = document.createElement('button');
closeButton.innerHTML = "&times;";
closeButton.style.position = "absolute";
closeButton.style.top = "15px";
closeButton.style.right = "15px";
closeButton.style.background = "rgba(0, 0, 0, 0.6)";
closeButton.style.border = "1px solid rgba(255, 255, 255, 0.1)";
closeButton.style.fontSize = "22px";
closeButton.style.cursor = "pointer";
closeButton.style.width = "38px";
closeButton.style.height = "38px";
closeButton.style.borderRadius = "50%;"
closeButton.style.display = "flex";
closeButton.style.alignItems = "center";
closeButton.style.justifyContent = "center";
closeButton.style.color = "#94a3b8";

closeButton.addEventListener('mouseenter', () => { closeButton.style.backgroundColor = '#fc3d21'; closeButton.style.color = '#fff'; });
closeButton.addEventListener('mouseleave', () => { closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; closeButton.style.color = '#94a3b8'; });

modalBox.appendChild(closeButton);
modalOverlay.appendChild(modalBox);
document.body.appendChild(modalOverlay);

function openModal(item) {
  const contentWrapper = modalBox.querySelector('.modal-content-wrapper') || document.createElement('div');
  contentWrapper.className = 'modal-content-wrapper';
  contentWrapper.innerHTML = '';

  let modalMedia = '';
  if (item.media_type === 'video') {
    modalMedia = `<iframe src="${item.url}" width="100%" height="400" frameborder="0" allowfullscreen style="display:block; border-radius:8px;"></iframe>`;
  } else {
    modalMedia = `<img src="${item.url}" alt="${item.title}" style="width:100%; height:auto; border-radius:8px; display:block; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">`;
  }

  contentWrapper.innerHTML = `
    <h2 style="margin-bottom:8px; font-size:22px; color:#ffffff; font-weight:800;">${item.title}</h2>
    <p style="font-size:12px; color:#94a3b8; margin-bottom:18px; text-transform:uppercase; letter-spacing:1px;">Observation Log: ${item.date}</p>
    <div style="width:100%; overflow:hidden; margin-bottom:20px;">
      ${modalMedia}
    </div>
    <p style="font-size:15px; line-height:1.6; margin-top:18px; color:#cbd5e1;">${item.explanation}</p>
  `;

  modalBox.appendChild(contentWrapper);
  modalOverlay.style.display = "flex";
  document.body.style.overflow = 'hidden';
}

closeButton.addEventListener('click', () => { modalOverlay.style.display = "none"; document.body.style.overflow = 'auto'; });
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) { modalOverlay.style.display = "none"; document.body.style.overflow = 'auto'; } });

fetchButton.addEventListener('click', getSpaceImages);