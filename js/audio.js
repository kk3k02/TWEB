document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");

  async function startMusic() {
    try {
      audio.volume = 0.35;
      await audio.play();

      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("keydown", startMusic);
    } catch (e) {
    }
  }

  window.addEventListener("click", startMusic, { once: true });
  window.addEventListener("touchstart", startMusic, { once: true });
  window.addEventListener("keydown", startMusic, { once: true });
});
