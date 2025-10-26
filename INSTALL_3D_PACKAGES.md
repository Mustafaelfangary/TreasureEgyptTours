# Install 3D Packages for Cleopatra Button

## Required Packages

Run these commands to install the necessary 3D libraries:

```bash
npm install three @react-three/fiber @react-three/drei
```

### Package Details:
- **three** - Core 3D library (Three.js)
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

## File Structure

Place your 3D model files in:
```
public/models/cleopatra/
  ├── model.glb (or model.gltf + model.bin)
  ├── textures/ (if separate)
  └── README.md
```

## Next Steps

After installing packages, I'll create:
1. `Cleopatra3DButton.tsx` - 3D floating button
2. Update `CleopatraAssistant.tsx` - Use 3D button
3. Add animations (floating, rotating, hover effects)
