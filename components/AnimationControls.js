export default function AnimationControls({
  showControls,
  setShowControls,
  animationConfig,
  setAnimationConfig,
  defaultConfig,
}) {
  return (
    <>
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 right-4 bg-gray-700 px-3 py-1 rounded-md text-sm z-10"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {showControls && (
        <div className="fixed top-16 right-4 bg-gray-800 p-4 rounded-lg z-10 w-64 space-y-4">
          <h3 className="text-sm font-bold mb-4">Animation Controls</h3>
          {Object.entries(animationConfig).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs">{key}</label>
                <span className="text-xs">{value.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={key === "decayRate" ? 0.8 : 0}
                max={
                  key === "decayRate"
                    ? 0.99
                    : key === "maxOpacity"
                    ? 1
                    : key === "scrollMultiplier"
                    ? 200
                    : key === "maxGlowIncrease"
                    ? 200
                    : key === "spreadRadius"
                    ? 100
                    : 100
                }
                step={key === "decayRate" || key === "maxOpacity" ? 0.01 : 1}
                value={value}
                onChange={(e) =>
                  setAnimationConfig((prev) => ({
                    ...prev,
                    [key]: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
          ))}
          <button
            onClick={() => setAnimationConfig(defaultConfig)}
            className="bg-gray-700 px-3 py-1 rounded-md text-sm w-full mt-4"
          >
            Reset to Default
          </button>
        </div>
      )}
    </>
  );
}
