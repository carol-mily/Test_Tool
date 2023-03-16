<template>
  <div class="bg-gray-lightest dark:bg-black flex flex-col overflow-hidden">
    <Header/>

    <Home v-if="!showResultsTab && !isRecording" @start="toggleRecord" />

    <Recording
      @stop="toggleRecord"
      @restart="restart(true)"
      :is-recording="isRecording"
      v-show="!showResultsTab && isRecording"
    />

    <Results
      :puppeteer="code"
      v-if="showResultsTab"
      v-on:update:tab="currentResultTab = $event"
    />

    <!-- TODO: Move this into its own component -->
    <div
      data-test-id="results-footer"
      class="flex py-2 px-3 justify-between bg-white"
      v-show="showResultsTab"
    >
      <Button class="h-4/5 w-1/3 bg-green-300 text-gray-dark" @click="restart" v-show="code">
        Restart
      </Button>
      <Button class="h-4/5 w-1/3 bg-green-300 text-gray-dark" @click="save" v-show="code">
        Save
      </Button>
    </div>

    <Footer v-if="!isRecording && !showResultsTab" />
  </div>
</template>

<script>
import browser from '@/services/browser'
import storage from '@/services/storage'
import analytics from '@/services/analytics'
import { popupActions} from '@/services/constants'

import CodeGenerator from '@/modules/code-generator'

import Home from '@/views/Home.vue'
import Results from '@/views/Results.vue'
import Recording from '@/views/Recording.vue'

import Button from '@/components/Button.vue'
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

let bus



const defaultOptions = {
  code: {},
}


export default {
  name: 'PopupApp',
  components: {
    Results,
    Recording,
    Home,
    Header,
    Footer,
    Button,
  },

  data() {
    return {
      isLoggedIn: false,
      showResultsTab: false,
      isRecording: false,
      currentResultTab: null,

      liveEvents: [],
      recording: [],

      code: '',
      options: defaultOptions,
    }
  },

  async mounted() {
    this.loadState()
    bus = browser.getBackgroundBus()
  },

  methods: {
    toggleRecord(close = true) {
      if (this.isRecording) {
        this.stop()
      } else {
        close && window.close()
        this.start()
      }

      this.isRecording = !this.isRecording
      this.storeState()
    },

    start() {
      analytics.trackEvent({ options: this.options, event: 'Start' })
      this.cleanUp()
      bus.postMessage({ action: popupActions.START })
    },

    async stop() {
      analytics.trackEvent({ options: this.options, event: 'Stop' })
      bus.postMessage({ action: popupActions.STOP })

      await this.generateCode()
      this.storeState()
    },

    restart(stop = false) {
      this.cleanUp()
      bus.postMessage({ action: popupActions.CLEAN_UP, value: stop })
    },

    save() {
      this.write()
    },

    cleanUp() {
      this.recording = this.liveEvents = []
      this.code = ''
      this.showResultsTab = this.isRecording = false
      this.storeState()
    },

    async generateCode() {
      const { recording, options = { code: {} } } = await storage.get(['recording', 'options'])
      const generator = new CodeGenerator(options.code)
      const { puppeteer} = generator.generate(recording)

      this.recording = recording
      this.code = puppeteer
      this.showResultsTab = true
    },


    async loadState() {
      const {
        controls = {},
        code = '',
        options,
        recording,
        clear,
        restart,
      } = await storage.get([
        'controls',
        'code',
        'options',
        'recording',
        'clear',
        'restart',
      ])

      this.isRecording = controls.isRecording
      this.options = options || defaultOptions

      this.code = code

      if (this.isRecording) {
        this.liveEvents = recording

        if (clear) {
          this.toggleRecord()
          storage.remove(['clear'])
        }

        if (restart) {
          this.cleanUp()
          this.toggleRecord(false)
          storage.remove(['restart'])
        }
      } else if (this.code) {
        this.generateCode()
      }
    },

    storeState() {
      storage.set({
        code: this.code,
        controls: { isRecording: this.isRecording},
      })
    },

    getCode() {
      return this.code
    },

    async read(){
      let fileHandle;
      [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const contents = await file.text();
      alert(contents);
    },

    async write() {
      var contents=this.getCode();
      const fileHandle = await self.showSaveFilePicker({
        suggestedName: 'new.js',
        types: [{
          description: 'JavaScript documents',
          accept: {
            'text/plain': ['.js'],
          },
        }],
      });
      // Create a FileSystemWritableFileStream to write to.
      const writable = await fileHandle.createWritable();
      // Write the contents of the file to the stream.
      await writable.write(contents);
      // Close the file and write the contents to disk.
      await writable.close();
    }
  },
}
</script>

<style>
html {
  width: 280px;
  height: 500px;
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 2px 2px #D1FAE5;
}

button:focus {
  outline: 0;
}
</style>
