<template>
    
        <div class="content">
            <div class="loading-grid">
                <!-- If loading, show placeholders; otherwise, display the photos -->
                <div
                    class="loading-item placeholder"
                    v-for="index in 12" :key="'placeholder-' + index"
                >
                    <div class="loading-overlay">
                        <div class="shimmer author"></div>
                        <div class="shimmer location"></div>
                    </div>
                </div>
            </div>
        </div>
    
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';

</script>


<style lang="scss" scoped>
// .content{
//     width: 100%;
//     height: 100%;
// }
 .loading-grid {
    grid-column: 1 / -1;
    width:100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 50px;
    row-gap: 30px;
    grid-auto-rows: 10px; 
}

.loading-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    background-color: #f0f0f0; 
}

.loading-grid .loading-item:nth-child(3n+1) {
    grid-row: span 10; /* Height for the first column */
}

.loading-grid .loading-item:nth-child(3n+2) {
    grid-row: span 17; /* Height for the second column */
}

.loading-grid .loading-item:nth-child(3n) {
    grid-row: span 13; /* Height for the third column */
}

.shimmer {
    animation: shimmer 1.5s infinite linear;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
}

/* Shimmer effect for author name */
.shimmer.author {
    height: 20px;
    width: 80%;
    margin-bottom: 10px;
    border-radius: 4px;
}

/* Shimmer effect for location */
.shimmer.location {
    height: 15px;
    width: 60%;
    border-radius: 4px;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

.loading-item:hover {
    transform: scale(1.05);
}


.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    color: white;
    border-radius: 8px;
}

/* Media queries for responsiveness */
/* Loaders need to be responsive too lol */
@media (max-width: 1400px) {
    .loading-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 1000px) {
    .loading-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }

</style>