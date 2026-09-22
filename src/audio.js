window.GCFCAudio = (() => {
  let audioCtx = null;
  let bgmInterval = null;
  let bgmStep = 0;
  const BGM_NOTES = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];

  function resumeContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function playTone(freq, duration, type, gainVal) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playJump(isDouble, volume) {
    if (!audioCtx) return;
    try {
      const startF = isDouble ? 420 : 300;
      const endF = isDouble ? 720 : 540;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(startF, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endF, audioCtx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playCollect(isPaw, volume) {
    if (!audioCtx) return;
    if (isPaw) {
      playTone(880, 0.08, "triangle", 0.18 * volume);
      return;
    }
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playNearMiss(volume) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.3 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.23);
    } catch (e) {}
  }

  function playCollide(volume) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  function startBGM(volume) {
    stopBGM();
    resumeContext();
    bgmInterval = setInterval(() => {
      if (!audioCtx) return;
      const note = BGM_NOTES[bgmStep % BGM_NOTES.length];
      bgmStep++;
      playTone(note, 0.18, "sine", 0.05 * volume);
    }, 240);
  }

  function stopBGM() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  return { resumeContext, playJump, playCollect, playNearMiss, playCollide, startBGM, stopBGM };
})();
