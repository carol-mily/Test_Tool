<template>
  <div
    data-test-id="results-tab"
    class="flex flex-col bg-green-300 overflow-hidden mt-1 h-100 dark:bg-black"
  >
    <div class="flex flex-row">
      <h3 class="p-2 font-semibold text-xs text-gray-dark capitalize">
        This is the generated script...
      </h3>
    </div>

    <div class="sc p-1 bg-green-100 dark:bg-black-shady">
      <pre
        v-if="code"
        v-highlightjs="code"
        class="overflow-auto bg-green-100 dark:bg-black-shady h-100"
      >
      <code ref="code" class="javascript bg-green-100 dark:bg-black-shady px-2 break-word whitespace-pre-wrap overflow-x-hidden"></code>
      </pre>
      <pre v-else>
        <code>No code yet...</code>
      </pre>
    </div>
  </div>
</template>
<script>
import { headlessTypes } from '@/modules/code-generator/constants'

export default {
  name: 'ResultsTab',

  props: {
    puppeteer: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      activeTab: headlessTypes.PUPPETEER,
      tabs: [headlessTypes.PUPPETEER],
    }
  },

  computed: {
    code() {
      return this.puppeteer
    },
  },
}
</script>

<style scoped>
pre::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  margin-right: 10px;
  padding: 10px;
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  margin-right: 10px;
  padding: 10px;
  background: #e0e6ed;
  border-radius: 0.5rem;
}

pre::-webkit-scrollbar-corner {
  background: yellow;
}
</style>
