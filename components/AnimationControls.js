import { useState } from "react";
import { Settings } from "lucide-react";

export default function AnimationControls({
  showControls,
  setShowControls,
  animationConfig,
  setAnimationConfig,
  defaultConfig,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    setAnimationConfig((prev) => ({
      ...prev,
      [name]: numValue,
      // Update both desktop and mobile values when changed in controls
      ...(name === "maxGlowIncrease" && {
        desktopMaxGlowIncrease: numValue,
        mobileMaxGlowIncrease: numValue * (38 / 150), // Maintain the mobile/desktop ratio
      }),
      ...(name === "spreadRadius" && {
        desktopSpreadRadius: numValue,
        mobileSpreadRadius: numValue * 0.5, // Maintain the mobile/desktop ratio
      }),
    }));
  };

  const resetToDefault = () => {
    setAnimationConfig(defaultConfig);
  };

  if (!showControls) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 p-2 rounded-full"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-gray-800 p-4 rounded-lg shadow-lg w-64">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Base Glow</label>
              <input
                type="range"
                name="baseGlow"
                min="0"
                max="100"
                value={animationConfig.baseGlow}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-xs">{animationConfig.baseGlow}</div>
            </div>

            <div>
              <label className="block text-sm mb-1">Max Glow Increase</label>
              <input
                type="range"
                name="maxGlowIncrease"
                min="0"
                max="300"
                value={animationConfig.desktopMaxGlowIncrease}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-xs">
                Desktop: {animationConfig.desktopMaxGlowIncrease}
                <br />
                Mobile: {animationConfig.mobileMaxGlowIncrease}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Spread Radius</label>
              <input
                type="range"
                name="spreadRadius"
                min="0"
                max="200"
                value={animationConfig.desktopSpreadRadius}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-xs">
                Desktop: {animationConfig.desktopSpreadRadius}
                <br />
                Mobile: {animationConfig.mobileSpreadRadius}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Max Opacity</label>
              <input
                type="range"
                name="maxOpacity"
                min="0"
                max="1"
                step="0.1"
                value={animationConfig.maxOpacity}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-xs">{animationConfig.maxOpacity}</div>
            </div>

            <div>
              <label className="block text-sm mb-1">Decay Rate</label>
              <input
                type="range"
                name="decayRate"
                min="0.8"
                max="0.999"
                step="0.001"
                value={animationConfig.decayRate}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-xs">{animationConfig.decayRate}</div>
            </div>

            <button
              onClick={resetToDefault}
              className="bg-gray-700 px-3 py-1 rounded text-sm w-full"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
