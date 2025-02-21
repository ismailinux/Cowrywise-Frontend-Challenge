<template>
    <div id="MainLayout" class="mainlayout">
        <div class="navbar">
            <!-- Searching State: Shows only while the request is in progress -->
            <div v-if="searching && userStore.loading" class="searching">
                Searching for 
                <span class="query">
                    <Icon class="icon" name="icomoon-free:quotes-left" size="20" /> 
                    {{ searchQuery }}
                    <Icon class="icon" name="icomoon-free:quotes-right" size="20" />
                </span>
            </div>

            <!-- Search Results State: Shows after a search has been initiated (not on initial load) -->
            <div v-else-if="isSearchInitiated && !userStore.loading" class="searching">
                Search results for 
                <span class="query">
                    <Icon class="icon" name="icomoon-free:quotes-left" size="20" /> 
                    {{ searchQuery }}
                    <Icon class="icon" name="icomoon-free:quotes-right" size="20" />
                </span>
            </div>

            <!-- Search Bar -->
            <div v-else class="searchbar">
                <button class="searchbtn" @click="onSearch">
                    <Icon name="ph:magnifying-glass" size="20" :style="{ color: 'grey' }" />
                </button>
                <input type="text" v-model="searchQuery" placeholder="Search for photo" @keyup.enter="onSearch" />
            </div>
        </div>

        <div class="gallery">
            <slot :searchQuery="searchQuery" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const searchQuery = ref('');
const searching = ref(false);
const isSearchInitiated = ref(false); // To track if a search has been initiated

const emit = defineEmits(['search']);

// Handle search action (when user clicks or presses enter)
const onSearch = () => {
    isSearchInitiated.value = true; // Mark search as initiated
    searching.value = true; // Show "Searching for..." message
    userStore.loading = true; // Set loading to true
    emit('search', searchQuery.value); // Emit event to parent with searchQuery value
};

// Watch for changes in userStore.loading to update the searching state
watch(() => userStore.loading, (newLoading) => {
    if (!newLoading && searching.value) {
        searching.value = false; // This hide "Searching for..." message once loading is complete
    }
});
</script>

<style lang="scss">
*,
*::before,
*::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.mainlayout {
    background-color: #ffffff;
    min-height: 100vh;
    position: relative;
}

.navbar {
    background-color: #dde3ea;
    height: 25vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.searchbar {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    gap: 1rem; 
    padding: 0.7rem;
    border-radius: 10px;
    min-width: 70%;
    max-width: 1000px;
}

input {
    width: 90%;
    border: none;
    outline: none;
    font-size: 1.1rem;
}

.searchbtn {
    padding: 0.5rem;
    background-color: transparent;
    cursor: pointer;
    border: none;
}

.searching {
    font-size: 2.5rem;               
    font-weight: bold;
    font-family: sans-serif;             
    color: #273b56;                   
    text-align: left;              
    margin: 1rem 0;                
    width: 60%;                    
    min-width: 70%;
    max-width: 1000px;           
}

.query {
    color: #6e7b90;
}

.icon {
    vertical-align: top;
    color: #6e7b90;     
}

.icon:first-of-type {
    margin-right: -0.5rem; 
}

.icon:last-of-type {
    margin-left: -0.5rem;
}

.gallery {
    border-radius: 10px;
    min-height: 100vh;
    max-width: 60%;
    margin: 0 auto;
    position: relative;
    top: -40px;
}
</style>