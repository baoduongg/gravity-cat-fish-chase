window.GCFCStorage = (() => {
  const DEFAULT_HIGH_SCORES = [];

  const getNumber = (k, def = 0) => Number(localStorage.getItem(k) || def);
  const getJSON = (k, def) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? def : v;
    } catch (e) {
      return def;
    }
  };

  function load() {
    return {
      bestScore: getNumber("gcfc_best", 0),
      totalFish: getNumber("gcfc_totalFish", 0),
      unlockedSkins: getJSON("gcfc_unlockedSkins", ["orange"]),
      unlockedTrails: getJSON("gcfc_unlockedTrails", ["wind"]),
      currentSkin: localStorage.getItem("gcfc_currentSkin") || "orange",
      currentTrail: localStorage.getItem("gcfc_currentTrail") || "wind",
      highScoresList: getJSON("gcfc_highScores", DEFAULT_HIGH_SCORES),
      bgmVolume: getNumber("gcfc_bgm_vol", 70) / 100,
      sfxVolume: getNumber("gcfc_sfx_vol", 85) / 100,
      bgmEnabled: localStorage.getItem("gcfc_bgm_on") !== "false",
      sfxEnabled: localStorage.getItem("gcfc_sfx_on") !== "false",
      shakeEnabled: localStorage.getItem("gcfc_shake_on") !== "false",
      reduceMotion: localStorage.getItem("gcfc_reduce_motion") === "true",
    };
  }

  function save(state) {
    localStorage.setItem("gcfc_best", String(state.bestScore));
    localStorage.setItem("gcfc_totalFish", String(state.totalFish));
    localStorage.setItem("gcfc_unlockedSkins", JSON.stringify(state.unlockedSkins));
    localStorage.setItem("gcfc_unlockedTrails", JSON.stringify(state.unlockedTrails));
    localStorage.setItem("gcfc_currentSkin", state.currentSkin);
    localStorage.setItem("gcfc_currentTrail", state.currentTrail);
    localStorage.setItem("gcfc_highScores", JSON.stringify(state.highScoresList));
    localStorage.setItem("gcfc_bgm_vol", String(Math.round(state.bgmVolume * 100)));
    localStorage.setItem("gcfc_sfx_vol", String(Math.round(state.sfxVolume * 100)));
    localStorage.setItem("gcfc_bgm_on", String(state.bgmEnabled));
    localStorage.setItem("gcfc_sfx_on", String(state.sfxEnabled));
    localStorage.setItem("gcfc_shake_on", String(state.shakeEnabled));
    localStorage.setItem("gcfc_reduce_motion", String(state.reduceMotion));
  }

  return { load, save };
})();
