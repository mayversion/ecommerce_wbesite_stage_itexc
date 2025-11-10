import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';

function Model({ url, scale = 1 }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} />;
}

export default function ModelView({ url, scale = 1 }) {
  return (
    <div style={{ width: '100%', height: 240, borderRadius: 12, overflow: 'hidden' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.7, 2.4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <hemisphereLight skyColor={'#ffffff'} groundColor={'#888888'} intensity={0.5} />
        <directionalLight intensity={0.6} position={[2, 3, 4]} castShadow />
        <Suspense fallback={<Html center style={{ color: '#fff', fontSize: 12 }}>Loading…</Html>}>
          <Model url={url} scale={scale} />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.3} scale={8} blur={1.6} far={3} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} enablePan={false} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/src/assets/coffee_table___45cm_wide.glb');
useGLTF.preload('/src/assets/tie_dye_sneaker_photogrammetry.glb');
useGLTF.preload('/src/assets/worn_out_shoes.glb');
useGLTF.preload('/src/assets/synthgen_v1_o2.glb');
useGLTF.preload('/src/assets/usb_type_c_cable.glb');
