<template>
  <section class="flex flex-col bg-green-100 items-center rounded-md pt-8 h-full">
    <div class="flex bg-green-100 flex-col items-center rounded-md h-100">
      <h3 class="text-gray-darkest text-3xl font-semibold mb-5 dark:text-gray-lightest">
        Recoding!
      </h3>
      <RoundButton big @click="$emit('stop')" class="p-8 mt-10">
        <img
          src="@/assets/icons/stop.png"
          class="w-10 h-10"
        />
      </RoundButton>

      <RoundButton big @click="$emit('restart')" class="p-8 mt-10">
        <img
          src="@/assets/icons/restart.png"
          class="w-10 h-10"
        />
      </RoundButton>
    </div>
  </section>
</template>

<script>
import RoundButton from '@/components/RoundButton'

export default {
  components: { RoundButton },

  props: {
    isRecording: { type: Boolean, default: false },
  },
}
</script>
