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
  // Create a simple paragraph element for our fact section
  const factElement = document.createElement('div');
  factElement.style.padding = "15px";
  factElement.style.marginBottom = "20px";
  factElement.style.background = "#fff";
  factElement.style.borderRadius = "8px";
  factElement.style.color = "#333";
  factElement.style.fontWeight = "bold";
  factElement.style.textAlign = "center";
  
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factElement.textContent = `🌌 Did You Know? ${spaceFacts[randomIndex]}`;
  
  // Insert the fact above the image gallery row
  galleryContainer.parentNode.insertBefore(factElement, galleryContainer);
});

// --- Fetch Data from NASA's API ---
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Clear current gallery and display the loading message string
  galleryContainer.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos...</p></div>`;

  try {
    // Build the request string matching NASA's parameters
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network issue fetching data.");
    }
    
    const data = await response.json();
    
    // Ensure we handle array data structures and slice it to max 9 items
    const itemsToDisplay = Array.isArray(data) ? data.slice(0, 9) : [data];
    
    // Build and append our cards
    displayGallery(itemsToDisplay);
    
  } catch (error) {
    console.error("Error encountered:", error);
    galleryContainer.innerHTML = `<div class="placeholder"><p>❌ Missing or invalid data. Please check your dates and try again.</p></div>`;
  }
}

// --- Display Gallery Items ---
function displayGallery(items) {
  // Clean the placeholder out of the gallery container completely
  galleryContainer.innerHTML = '';

  items.forEach(item => {
    // Create a new div wrapper using the class provided in your original CSS
    const card = document.createElement('div');
    card.classList.add('gallery-item');

    // LevelUp: Conditionals to check for video entries vs standard images
    let mediaHTML = '';
    if (item.media_type === 'video') {
      mediaHTML = `<div style="height:200px; display:flex; align-items:center; justify-content:center; background:#ddd; color:#333; font-weight:bold;">📹 Video Entry (Click to Open)</div>`;
    } else {
      mediaHTML = `<img src="${item.url}" alt="${item.title}">`;
    }

    // Set inside layout structure matching your original .gallery-item definitions
    card.innerHTML = `
      ${mediaHTML}
      <p><strong>${item.title}</strong><br><small>${item.date}</small></p>
    `;

    // Listen for mouseclicks to summon the full detail view
    card.addEventListener('click', () => openModal(item));

    galleryContainer.appendChild(card);
  });
}

// --- Build and Manage the Modal Component ---
// Create modal nodes dynamically to keep the starter HTML file completely untouched
const modalOverlay = document.createElement('div');
modalOverlay.style.position = "fixed";
modalOverlay.style.top = "0";
modalOverlay.style.left = "0";
modalOverlay.style.width = "100%";
modalOverlay.style.height = "100%";
modalOverlay.style.background = "rgba(0,0,0,0.8)";
modalOverlay.style.display = "none";
modalOverlay.style.justifyContent = "center";
modalOverlay.style.alignItems = "center";
modalOverlay.style.zIndex = "1000";
modalOverlay.style.padding = "20px";

const modalBox = document.createElement('div');
modalBox.style.background = "#fff";
modalBox.style.padding = "25px";
modalBox.style.borderRadius = "8px";
modalBox.style.maxWidth = "600px";
modalBox.style.width = "100%";
modalBox.style.maxHeight = "90vh";
modalBox.style.overflowY = "auto";
modalBox.style.position = "relative";
modalBox.style.color = "#333";

const closeButton = document.createElement('button');
closeButton.innerHTML = "&times;";
closeButton.style.position = "absolute";
closeButton.style.top = "10px";
closeButton.style.right = "15px";
closeButton.style.background = "none";
closeButton.style.border = "none";
closeButton.style.fontSize = "24px";
closeButton.style.cursor = "pointer";
closeButton.style.width = "auto";

modalBox.appendChild(closeButton);
modalOverlay.appendChild(modalBox);
document.body.appendChild(modalOverlay);

function openModal(item) {
  // Clear any existing modal inner contents except the close button
  const contentWrapper = modalBox.querySelector('.modal-content-wrapper') || document.createElement('div');
  contentWrapper.className = 'modal-content-wrapper';
  contentWrapper.innerHTML = '';

  let modalMedia = '';
  if (item.media_type === 'video') {
    modalMedia = `<iframe src="${item.url}" width="100%" height="315" frameborder="0" allowfullscreen></iframe>`;
  } else {
    modalMedia = `<img src="${item.url}" alt="${item.title}" style="width:100%; height:auto; border-radius:4px; margin-bottom:15px;">`;
  }

  contentWrapper.innerHTML = `
    <h2 style="margin-bottom:5px; font-size:20px;">${item.title}</h2>
    <p style="font-size:12px; color:#666; margin-bottom:15px;">${item.date}</p>
    ${modalMedia}
    <p style="font-size:14px; line-height:1.5; margin-top:15px;">${item.explanation}</p>
  `;

  modalBox.appendChild(contentWrapper);
  modalOverlay.style.display = "flex";
}

// Event hooks to shut down modal visibility screens
closeButton.addEventListener('click', () => { modalOverlay.style.display = "none"; });
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.style.display = "none"; });

// Fire our fetch operation whenever the original action button gets clicked
fetchButton.addEventListener('click', getSpaceImages);