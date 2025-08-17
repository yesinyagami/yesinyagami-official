<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="toggleAudio"
      class="w-12 h-12 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      :title="isPlaying ? 'Mute Ambient Audio' : 'Play Ambient Audio'"
    >
      <svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.236 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.236l4.147-3.816a1 1 0 011.447.892zM7 9.28V5.72l2.454 2.26H13a1 1 0 110 2H9.454L7 9.28z" clip-rule="evenodd" />
        <path d="M13.293 7.293a1 1 0 011.414 0 5 5 0 010 7.072l-1.414-1.414a3 3 0 000-4.244l-1.414-1.414z" />
        <path d="M15.414 5.586a1 1 0 011.414 0 7 7 0 010 9.9l-1.414-1.414a5 5 0 000-7.072l-1.414-1.414z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.236 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.236l4.147-3.816a1 1 0 011.447.892zM7 9.28V5.72l2.454 2.26H13a1 1 0 110 2H9.454L7 9.28z" clip-rule="evenodd" />
        <path d="M13 8a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1zM15 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
let audioContext: AudioContext | null = null
let oscillator: OscillatorNode | null = null
let gainNode: GainNode | null = null

onMounted(() => {
  console.log('🎵 Audio system mounted')
})

onUnmounted(() => {
  stopAudio()
})

function toggleAudio() {
  if (isPlaying.value) {
    stopAudio()
  } else {
    startAudio()
  }
}

function startAudio() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    // Create a simple ambient tone
    oscillator = audioContext.createOscillator()
    gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set low frequency for ambient sound
    oscillator.frequency.setValueAtTime(110, audioContext.currentTime) // A2 note
    oscillator.type = 'sine'

    // Very low volume
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime)

    oscillator.start()
    isPlaying.value = true

    console.log('🎵 Ambient audio started')
  } catch (error) {
    console.warn('Audio not supported or failed:', error)
  }
}

function stopAudio() {
  if (oscillator) {
    oscillator.stop()
    oscillator.disconnect()
    oscillator = null
  }

  if (gainNode) {
    gainNode.disconnect()
    gainNode = null
  }

  isPlaying.value = false
  console.log('🔇 Ambient audio stopped')
}
</script>