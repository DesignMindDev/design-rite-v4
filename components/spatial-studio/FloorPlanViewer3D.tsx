'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Text } from '@react-three/drei';
import { Suspense } from 'react';

interface Wall {
  start: [number, number];
  end: [number, number];
}

interface Door {
  position: [number, number];
  type: string;
}

interface Room {
  name: string;
  center: [number, number];
}

interface FloorPlanData {
  walls: Wall[];
  doors: Door[];
  windows: Array<{ position: [number, number] }>;
  rooms?: Room[];
  height: number;
}

export default function FloorPlanViewer3D({
  floorPlanData
}: {
  floorPlanData: FloorPlanData
}) {
  // Scale down coordinates for better view (floor plans are often in pixels)
  const scale = 0.1;

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden border border-purple-600/30">
      <Canvas>
        <PerspectiveCamera makeDefault position={[30, 30, 30]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Floor grid */}
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellColor="#6B7280"
          sectionColor="#9333EA"
          fadeDistance={50}
          fadeStrength={1}
        />

        <Suspense fallback={null}>
          {/* Render walls */}
          {floorPlanData.walls && floorPlanData.walls.length > 0 ? (
            floorPlanData.walls.map((wall, index) => (
              <Wall3D
                key={`wall-${index}`}
                wall={wall}
                height={floorPlanData.height}
                scale={scale}
              />
            ))
          ) : (
            <group>
              {/* Demo walls if none detected */}
              <Wall3D wall={{ start: [0, 0], end: [50, 0] }} height={10} scale={1} />
              <Wall3D wall={{ start: [50, 0], end: [50, 40] }} height={10} scale={1} />
              <Wall3D wall={{ start: [50, 40], end: [0, 40] }} height={10} scale={1} />
              <Wall3D wall={{ start: [0, 40], end: [0, 0] }} height={10} scale={1} />
            </group>
          )}

          {/* Render doors */}
          {floorPlanData.doors && floorPlanData.doors.map((door, index) => (
            <Door3D key={`door-${index}`} door={door} scale={scale} />
          ))}

          {/* Render windows */}
          {floorPlanData.windows && floorPlanData.windows.map((window, index) => (
            <Window3D key={`window-${index}`} window={window} scale={scale} />
          ))}

          {/* Render room labels */}
          {floorPlanData.rooms && floorPlanData.rooms.map((room, index) => (
            <RoomLabel key={`room-${index}`} room={room} scale={scale} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Wall component - draws a 3D wall between two points
function Wall3D({ wall, height, scale }: { wall: Wall; height: number; scale: number }) {
  const [x1, y1] = wall.start.map(v => v * scale);
  const [x2, y2] = wall.end.map(v => v * scale);

  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  return (
    <mesh position={[centerX, height / 2, centerY]} rotation={[0, angle, 0]}>
      <boxGeometry args={[length, height, 0.3]} />
      <meshStandardMaterial color="#4B5563" />
    </mesh>
  );
}

// Door component - draws a door opening
function Door3D({ door, scale }: { door: Door; scale: number }) {
  const [x, y] = door.position.map(v => v * scale);

  return (
    <group position={[x, 0, y]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial
          color={door.type === 'entry' ? '#92400E' : '#78350F'}
        />
      </mesh>
      {/* Door label */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {door.type === 'entry' ? '🚪 Entry' : '🚪 Door'}
      </Text>
    </group>
  );
}

// Window component - draws a window
function Window3D({ window, scale }: { window: { position: [number, number] }; scale: number }) {
  const [x, y] = window.position.map(v => v * scale);

  return (
    <mesh position={[x, 5, y]}>
      <boxGeometry args={[1, 1.5, 0.1]} />
      <meshStandardMaterial
        color="#60A5FA"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Room label component
function RoomLabel({ room, scale }: { room: Room; scale: number }) {
  const [x, y] = room.center.map(v => v * scale);

  return (
    <Text
      position={[x, 0.1, y]}
      fontSize={1}
      color="#9333EA"
      anchorX="center"
      anchorY="middle"
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {room.name}
    </Text>
  );
}
