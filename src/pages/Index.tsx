import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function SpinningLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  )
}

function AnimatedBox({ initialPosition }: { initialPosition: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ]

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  )
}

const Index = () => {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-inter">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-20 h-20">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SpinningLogo />
              </Canvas>
            </div>
            <span className="text-2xl font-bold tracking-wider">KAIN VPN</span>
          </div>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#features" className="hover:text-gray-300 transition">Возможности</a></li>
            <li><a href="#how-it-works" className="hover:text-gray-300 transition">Как работает</a></li>
            <li><a href="#pricing" className="hover:text-gray-300 transition">Тарифы</a></li>
            <li><a href="#contact" className="hover:text-gray-300 transition">Контакты</a></li>
          </ul>
        </nav>
      </header>

      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
          Свобода в сети.<br />Без следов.
        </h1>
        <h2 className="text-lg md:text-xl mb-10 text-gray-300 max-w-xl mx-auto">
          Kain VPN защищает ваши данные, скрывает IP и открывает весь интернет — где бы вы ни находились
        </h2>
        <button className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition duration-300">
          Попробовать бесплатно
        </button>
      </div>

      <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
        <Scene />
      </Canvas>

      {/* Features Section */}
      <section id="features" className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Почему Kain VPN?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h4 className="text-xl font-semibold mb-3">Полная анонимность</h4>
              <p className="text-gray-400">Ваш реальный IP скрыт, трафик зашифрован. Никаких логов — ни один провайдер не узнает, где вы были.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h4 className="text-xl font-semibold mb-3">Молниеносная скорость</h4>
              <p className="text-gray-400">Сотни серверов по всему миру. Умный выбор маршрута обеспечивает минимальный пинг и максимальную скорость соединения.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h4 className="text-xl font-semibold mb-3">Без ограничений</h4>
              <p className="text-gray-400">Доступ к любым сайтам и сервисам — Instagram, YouTube, зарубежный стриминг. Блокировки больше не существует.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index