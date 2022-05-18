<template>
  <div class="sk-grid">
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
    <div class="sk-grid-cube"></div>
  </div>
</template>

<script>
export default {
  name: 'AppSpinner',
};
</script>

<style scoped>
/* Utility class for centering */
.sk-center {
  margin: auto;
}

.sk-grid {
  --sk-size: 40px;
  width: var(--sk-size);
  height: var(--sk-size);
  /* Cube positions
   * 1 2 3
   * 4 5 6
   * 7 8 9
   */
}
.sk-grid-cube {
  --sk-color-400: #a0ec93;
  --sk-color-500: #90e481;
  --sk-color-600: #73d162;
  --sk-color-700: #1d8361;
  --sk-radius: 0.2rem;
  width: 33.33%;
  height: 33.33%;
  float: left;
  animation: sk-grid 1.5s infinite ease-in-out;
  background-color: var(--sk-color-600);
}
.sk-grid-cube:nth-child(1) {
  animation-delay: 0.2s;
  border-top-left-radius: var(--sk-radius);
}
.sk-grid-cube:nth-child(2) {
  animation-delay: 0.3s;
}
.sk-grid-cube:nth-child(3) {
  animation-delay: 0.4s;
  border-top-right-radius: var(--sk-radius);
}
.sk-grid-cube:nth-child(4) {
  animation-delay: 0.1s;
}
.sk-grid-cube:nth-child(5) {
  animation-delay: 0.2s;
}
.sk-grid-cube:nth-child(6) {
  animation-delay: 0.3s;
}
.sk-grid-cube:nth-child(7) {
  animation-delay: 0s;
  border-bottom-left-radius: var(--sk-radius);
}
.sk-grid-cube:nth-child(8) {
  animation-delay: 0.1s;
}
.sk-grid-cube:nth-child(9) {
  animation-delay: 0.2s;
  border-bottom-right-radius: var(--sk-radius);
}

@keyframes sk-grid {
  0%,
  70%,
  100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  }
}
</style>
