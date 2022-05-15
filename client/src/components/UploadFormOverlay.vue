<template>
  <aside
    class="absolute top-0 left-0 w-full h-full bg-white/90 flex flex-col justify-center items-center text-back font-subtitle text-gray-700"
  >
    <p class="text-4xl">{{ progress }}%</p>
    <p>Please don't close or refresh this window.</p>
  </aside>
</template>

<script>
export default {
  name: 'UploadFormOverlay',
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
};
</script>
