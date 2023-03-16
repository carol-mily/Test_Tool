<template>
  <div class="flex bg-green-100 flex-col items-center rounded-md pt-10 h-100">
    <h3 class="text-gray-darkest text-3xl font-semibold mb-3 dark:text-gray-lightest">
      welcome!
    </h3>
    <RoundButton :small="false" @click="$emit('start')" class="p-10 mt-12">
      <img
            src="@/assets/icons/start.png"
            class="w-20 h-20"
          />
    </RoundButton>
  </div>
</template>

<script>
import RoundButton from '@/components/RoundButton'

export default {
  components: { RoundButton },
}
</script>
