import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Html, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

export default function HeroScene({ models = [] }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.1, 3.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight skyColor={'#ffffff'} groundColor={'#888888'} intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Suspense fallback={<Html center style={{ color: '#fff', fontSize: 12 }}>Loading…</Html>}>
        {/* Float the models slightly for life */}
        {models.map((m, i) => (
          <Float key={i} speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
            <Model url={m.url} scale={m.scale ?? 1} position={m.position ?? [0, 0, 0]} rotation={m.rotation ?? [0, 0, 0]} />
          </Float>
        ))}
        <ContactShadows position={[0, -0.6, 0]} opacity={0.35} scale={10} blur={1.8} far={4} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
