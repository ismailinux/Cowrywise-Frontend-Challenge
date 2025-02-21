<template>
    <div class="modal" v-if="isOpen" @click.self="closeModal">
     
      <div class="modal-content ">
        <span class="close" @click="closeModal">&times;</span>
        <img :src="imageUrl" alt="Image" />
        <div class="image-info">
          <p class="author">{{ author }}</p>
          <p class="location">{{ location }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    isOpen: Boolean,
    imageUrl: String,
    author: String,
    location: String,
  });
  
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 100px;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .modal-content {
    position: relative;
    top: 100px;
    background-color: #fefefe;
    margin: auto auto 100px auto;
    padding: 0;
    width: 80%;
    max-width: 800px;
    height: fit-content; 
    /* max-height: fit-content; */
    display: flex;
    flex-direction: column;
    border-radius: 10px;
  }
  
  .close {
    position: absolute;
    top: -50px;
    right: -90px; 
    color: #fff; 
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 50%;
    width: 30px;
    height: 30px;

}
  
  img {
    border-radius: 10px 10px 0 0; 
    object-fit: scale-down;
    width: 100%;
  }
  
  .image-info {
    border-radius: 0 0 10px 10px; 
    background-color: #fff;
    padding: 30px;
    text-align: left;
    width: 100%;
    max-height: 20%;    
  }
  
  .author {
    font-size: 1.2rem;
    font-weight: bold;
    font-family: sans-serif; 
    margin-bottom: 5px;
    color: #273b56;
    
  }
  
  .location {
    margin-bottom: 0.5px;
    color: #6e7b90;
    font-family: sans-serif;
  }

  /* Fade-in animation */
/* .fade-in-image {
  opacity: 0;
  animation: fadeIn 10s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 2;
  }
} */

  /* Media query for responsiveness */
@media (max-width: 870px) {
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5); /* Adding background color to the X button so that the button being white colored, doesn't disappear when a light image is rendered */
  }

  .modal-content {
    width: 90%;
    height: auto;
  }

  img {
    height: auto;
  }

  .image-info {
    padding: 20px;
  }
}
  </style>