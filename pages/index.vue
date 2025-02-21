<template>
  <MainLayout @search="debouncedUpdateSearchQuery">
    <div class="content">
      <div class="photo-grid">
        <Loading v-if="userStore.loading" class="loading" />

        <!-- The classes light-photo and dark-photo are added dynamically here -->
        <div
          v-else
          v-for="photo in photos"
          :key="photo.id"
          class="photo-item"
          :class="{'light-photo': photo.isLight, 'dark-photo': !photo.isLight}"
          @click="openModal(photo.urls.full, photo.user.name, photo.user.location)"
        >
          <div class="photo-overlay">
            <p class="author">{{ photo.user.name }}</p>
            <p class="location" v-if="photo.user.location">{{ photo.user.location }}</p>
            <p class="location" v-else>No location available</p>
          </div>

          <!-- Optimized image loading: 
     - I added srcset and sizes to serve different image resolutions based on screen size, reducing bandwidth usage.
     - I used loading="lazy" to defer loading until the image is near the viewport, improving performance. -->

          <img
            :src="photo.urls.small"
            :srcset="`${photo.urls.thumb} 200w, ${photo.urls.small} 400w, ${photo.urls.regular} 800w`"
            :sizes="`(max-width: 600px) 200px, (max-width: 1200px) 400px, 800px`"
            :alt="photo.alt_description"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <Modal :isOpen="isModalOpen" :imageUrl="modalImageUrl" :author="modalAuthor" :location="modalLocation" @close="closeModal" />
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import debounce from 'lodash/debounce';
import MainLayout from '../layouts/MainLayout.vue';
import Modal from '../components/Modal.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const photos = ref([]);
const searchQuery = ref(''); // Store search query
const isModalOpen = ref(false);
const modalImageUrl = ref('');
const modalAuthor = ref('');
const modalLocation = ref('');
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


// Hex to RGB conversion - I implemented this color feature because according to the specifications, I was asked to add a dark tint to bright images. I achieved this by getting the color property of the unplash photo object
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

// Brightness calculation
const calculateBrightness = ({ r, g, b }) => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Fetch photos from Unsplash and determine light/dark based on color property
const fetchPhotos = async () => {
  try {
    userStore.loading = true;
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        query: searchQuery.value || 'nature',
        per_page: 12,
      },
    });

    const photosData = response.data.results;

    // Analyze the dominant color for each photo
    for (const photo of photosData) {
      const hexColor = photo.color || '#000000'; // Default to black if color is not provided
      const rgbColor = hexToRgb(hexColor);
      const brightness = calculateBrightness(rgbColor);

      // Set isLight to true if brightness is above a threshold (e.g., 128)
      photo.isLight = brightness > 128; // Adjust threshold as needed
    }

    photos.value = photosData;
  } catch (error) {
    console.error('Error fetching photos from Unsplash:', error.response?.data || error);
  } finally {
    setTimeout(() => {
      userStore.loading = false;
    }, 1000);
  }
};

// Update search query and fetch new photos
const updateSearchQuery = (query) => {
  searchQuery.value = query;
  fetchPhotos();
};

// Debounced version of updateSearchQuery
const debouncedUpdateSearchQuery = debounce(updateSearchQuery, 300);

// Fetch photos on initial load
onMounted(fetchPhotos);

const openModal = (imageUrl, author, location) => {
  modalImageUrl.value = imageUrl;
  modalAuthor.value = author;
  modalLocation.value = location || 'No location available';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style lang="scss" scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 50px;
  row-gap: 30px;
  grid-auto-rows: 10px; /* Base row height */
  position: relative;
}

.loading {
  grid-column: 1 / -1; /* Span all columns */
 }

.photo-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

/* Different heights for each column ...this is how I achieved the staggered grid effect */
.photo-grid .photo-item:nth-child(3n+1) {  /*items 1, 4, 7 and 10 */
  grid-row: span 10; /* Height for the first column */
}

.photo-grid .photo-item:nth-child(3n+2) { /*items 2, 5, 8 and 11 */
  grid-row: span 17; /* Height for the second column */
}

.photo-grid .photo-item:nth-child(3n) {   /*items 3, 6, 9 and 12 */
  grid-row: span 13; /* Height for the third column */
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

/* Darken the image on hover */
.photo-item::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* Default transparent */
  transition: background 0.3s ease-in-out;
}

// .photo-item:hover::after {
//   background: rgba(0, 0, 0, 0.5); /* Darken on hover */
// }

/* Add scaling effect on hover */
.photo-item:hover {
  transform: scale(1.05);
}

/* Keep the text always visible */
.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  color: white;
  font-size: 14px;
  border-radius: 8px;
  z-index: 2; /* Ensure text is always on top */
  transition: opacity 0.3s ease-in-out; /* Add transition for opacity */
}

/* Ensure text remains visible */
.photo-overlay p {
  position: relative;
  z-index: 3;
}

/* Light Image Overlay */
.photo-item.light-photo .photo-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Author and location styles */
.author {
  font-weight: bold;
  margin-bottom: 5px;
}

.location {
  margin-bottom: 0.5px;
}

/* Media queries for responsiveness */
@media (max-width: 1400px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1000px) {
  .photo-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>