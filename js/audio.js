document.addEventListener("DOMContentLoaded", () => {
  // Get the background music audio element
  const audio = document.getElementById("bgm");

  /**
   * Attempts to play the background music after user interaction.
   * This is necessary because browsers prevent autoplay without user consent.
   */
  async function startMusic() {
    try {
      // Set desired volume level
      audio.volume = 0.35; 
      
      // Attempt to play the audio
      await audio.play();

      // Remove all event listeners after successful playback initiation
      // Note: { once: true } in addEventListener already ensures single execution, 
      // but explicit removal is safer practice.
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("keydown", startMusic);
    } catch (e) {
      // Catch potential errors (e.g., if playback is still blocked or failed)
    }
  }

  // Add listeners to detect the first user interaction (click, touch, or keypress)
  // The { once: true } option ensures the function runs only once per listener.
  window.addEventListener("click", startMusic, { once: true });
  window.addEventListener("touchstart", startMusic, { once: true });
  window.addEventListener("keydown", startMusic, { once: true });
});