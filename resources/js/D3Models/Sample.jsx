
import { Canvas, useFrame, applyProps} from '@react-three/fiber'
import * as THREE from 'three'
import { Environment, Lightformer, Float, ContactShadows, OrbitControls, BakeShadows, PerspectiveCamera, useGLTF, RoundedBox, useCursor, CubeCamera  } from '@react-three/drei'
import { useMemo, useEffect, useState, useRef, Suspense, useLayoutEffect } from 'react'
import { EffectComposer, SSR } from '@react-three/postprocessing'
import { useControls } from 'leva'



/*
Author: Steven Grey (https://sketchfab.com/Steven007)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/lamborghini-urus-2650599973b649ddb4460ff6c03e4aa2
Title: Lamborghini Urus
*/
export function Lamborghini(props) {
  const { scene, nodes, materials } = useGLTF('/lambo.glb')
  useMemo(() => {
    // ⬇⬇⬇ All this is probably better fixed in Blender ...
    Object.values(nodes).forEach((node) => {
      if (node.isMesh) {
        // Fix glas, normals look messed up in the original, most likely deformed meshes bc of compression :/
        if (node.name.startsWith('glass')) node.geometry.computeVertexNormals()
        // Fix logo, too dark
        if (node.name === 'silver_001_BreakDiscs_0') node.material = applyProps(materials.BreakDiscs.clone(), { color: '#ddd' })
      }
    })
    // Fix windows, they have to be inset some more
    nodes['glass_003'].scale.setScalar(2.7)
    // Fix inner frame, too light
    applyProps(materials.FrameBlack, { metalness: 0.75, roughness: 0, color: 'black' })
    // Wheels, change color from chrome to black matte
    applyProps(materials.Chrome, { metalness: 1, roughness: 0, color: '#333' })
    applyProps(materials.BreakDiscs, { metalness: 0.2, roughness: 0.2, color: '#555' })
    applyProps(materials.TiresGum, { metalness: 0, roughness: 0.4, color: '#181818' })
    applyProps(materials.GreyElements, { metalness: 0, color: '#292929' })
    // Make front and tail LEDs emit light
    applyProps(materials.emitbrake, { emissiveIntensity: 3, toneMapped: false })
    applyProps(materials.LightsFrontLed, { emissiveIntensity: 3, toneMapped: false })
    // Paint, from yellow to black
    nodes.yellow_WhiteCar_0.material = new THREE.MeshPhysicalMaterial({
      roughness: 0.3,
      metalness: 0.05,
      color: '#111',
      envMapIntensity: 0.75,
      clearcoatRoughness: 0,
      clearcoat: 1
    })
  }, [nodes, materials])
  return <primitive object={scene} {...props} />
}


function Bruno() {
  return (
    <Canvas gl={{ logarithmicDepthBuffer: true, antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 25 }}>
      <color attach="background" args={['#15151a']} />
      <Lamborghini rotation={[0, Math.PI / 1.5, 0]} scale={0.015} />
      <hemisphereLight intensity={0.5} />
      <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={15} blur={0.5} opacity={1} far={20} />
      <mesh scale={4} position={[3, -1.161, -1.5]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 4, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      <mesh scale={4} position={[-3, -1.161, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 2.5]}>
        <ringGeometry args={[0.9, 1, 3, 1]} />
        <meshStandardMaterial color="white" roughness={0.75} />
      </mesh>
      {/* We're building a cube-mapped environment declaratively.
          Anything you put in here will be filmed (once) by a cubemap-camera
          and applied to the scenes environment, and optionally background. */}
      <Environment resolution={512}>
        {/* Ceiling */}
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, -3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 3]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 6]} scale={[10, 1, 1]} />
        <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 9]} scale={[10, 1, 1]} />
        {/* Sides */}
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
        {/* Key */}
        <Lightformer form="ring" color="red" intensity={10} scale={2} position={[10, 5, 10]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 2.2} />
    </Canvas>
  )
}

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Cube() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}


/************** SSR **********/
function Sphere() {
  const ref = useRef()
  const [active, setActive] = useState(false)
  const [zoom, set] = useState(true)
  useCursor(active)
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.getElapsedTime() / 2)
    state.camera.position.lerp({ x: 50, y: 25, z: zoom ? 50 : -50 }, 0.03)
    state.camera.lookAt(0, 0, 0)
  })
  return (
    <mesh ref={ref} receiveShadow castShadow onClick={() => set(!zoom)} onPointerOver={() => setActive(true)} onPointerOut={() => setActive(false)}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <meshStandardMaterial color={active ? 'hotpink' : 'lightblue'} clearcoat={1} clearcoatRoughness={0} roughness={0} metalness={0.25} />
    </mesh>
  )
}


const Plane = ({ color, ...props }) => (
  <RoundedBox receiveShadow castShadow smoothness={10} radius={0.015} {...props}>
    <meshStandardMaterial color={color} envMapIntensity={0.5} roughness={0} metalness={0} />
  </RoundedBox>
)

function Video() {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/drei_r.mp4', crossOrigin: 'Anonymous', loop: true, muted: true }))
  useEffect(() => void video.play(), [video])
  return (
    <mesh position={[-2, 4, 0]} rotation={[0, Math.PI / 2, 0]} scale={[17, 10, 1]}>
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
      </meshBasicMaterial>
    </mesh>
  )
}

function SSR2() {
  return (
    <Canvas shadows gl={{ logarithmicDepthBuffer: true, antialias: false, stencil: false, depth: false }} camera={{ position: [250, 225, 250], fov: 15 }}>
      <color attach="background" args={['#151520']} />
      <hemisphereLight intensity={0.5} />
      <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
      <group position={[2, -2, 0]}>
        <group position={[0, -0.9, -3]}>
          <Plane color="black" rotation-x={-Math.PI / 2} position-z={3} scale={[4, 20, 0.2]} />
          <Plane color="#f4ae00" rotation-x={-Math.PI / 2} position-y={1} scale={[4.2, 1, 4]} />
          <Plane color="#436fbd" rotation-x={-Math.PI / 2} position={[-1.7, 1, 6]} scale={[1.5, 4, 3]} />
          <Plane color="#d7dfff" rotation-x={-Math.PI / 2} position={[0, 4, 3]} scale={[2, 0.03, 4]} />
        </group>
        <Sphere />
        <Video />
      </group>
      <EffectComposer disableNormalPass>
        <SSR />
      </EffectComposer>
    </Canvas>
  )
}


/******** Envmap *****/

function Car({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/porsche-transformed.glb')

  useLayoutEffect(() => {
    materials.paint.color.set('#ffdf71')
    materials.paint.metalness = 0.2
    materials.paint.roughness = 0
    materials.paint.clearcoat = 1
    materials.paint.envMapIntensity = 1.5
    materials.paint.aoMapIntensity = 1.5
    materials.paint.roughnessMapIntensity = 2
    materials['930_chromes'].metalness = 1
    materials['930_chromes'].roughness = 0.3
    materials['930_chromes'].color = new THREE.Color('white')
    materials['glass'].color = new THREE.Color('white')
    materials['glass'].opacity = 0.6
    materials['930_plastics'].roughness = 0.8
    materials['930_lights'].emissiveMap = materials['930_lights'].map
    materials['930_lights'].emissiveIntensity = 50
    materials['930_tire'].color.set('black')
    materials['930_tire'].roughness = 0.7
  }, [materials])

  return (
    <group ref={group} {...props} dispose={null}>
      <CubeCamera frames={1} position={[0, 1.5, 0]} near={0.1} resolution={128}>
        {(texture) => (
          <group position={[0, -1.5, 0]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh
                geometry={nodes.mesh_1_instance_0.geometry}
                material={materials['930_plastics']}
                position={[-7.966238, -0.10155, -7.966238]}
                scale={0.000973}
              />
              <mesh
                geometry={nodes.mesh_1_instance_1.geometry}
                material={materials['930_plastics']}
                position={[-7.966238, -0.10155, -7.966238]}
                scale={0.000973}
              />
            </group>
            <group position={[-7.966238, -0.10155, -7.966238]} scale={0.000973}>
              <mesh geometry={nodes.mesh_0.geometry} material={materials.paint} material-envMap={texture} />
              <mesh geometry={nodes.mesh_0_1.geometry} material={materials['930_chromes']} />
              <mesh geometry={nodes.mesh_0_2.geometry} material={materials.black} />
              <mesh geometry={nodes.mesh_0_3.geometry} material={materials['930_lights']} />
              <mesh geometry={nodes.mesh_0_4.geometry} material={materials.glass} />
              <mesh geometry={nodes.mesh_0_5.geometry} material={materials['930_stickers']} />
              <mesh geometry={nodes.mesh_0_6.geometry} material={materials['930_plastics']} material-polygonOffset material-polygonOffsetFactor={-10} />
              <mesh geometry={nodes.mesh_0_7.geometry} material={materials['930_lights_refraction']} />
              <mesh geometry={nodes.mesh_0_8.geometry} material={materials['930_rim']} />
              <mesh geometry={nodes.mesh_0_9.geometry} material={materials['930_tire']} />
            </group>
          </group>
        )}
      </CubeCamera>
      <group position={[-7.966238, -0.10155, -7.966238]} scale={0.000973}>
        <mesh geometry={nodes.mesh_2.geometry} material={materials.plate} material-roughness={1} />
        <mesh geometry={nodes.mesh_2_1.geometry} material={materials.DefaultMaterial} />
        <mesh geometry={nodes.mesh_2_2.geometry} material={materials['Material.001']} material-depthWrite={false} material-opacity={0.6} />
      </group>
    </group>
  )
}




function Envmap() {
  useGLTF.preload('/porsche-transformed.glb')

  return (
    <Canvas gl={{ toneMappingExposure: 0.7 }}>
      <Suspense fallback={null}>
        <Environment files="/old_depot_2k.hdr" ground={{ height: 32, radius: 130 }} />
        <spotLight angle={1} position={[-80, 200, -100]} intensity={1} />
        <Car position={[-8, 0, -2]} scale={20} rotation-y={-Math.PI / 4} />
        <ContactShadows renderOrder={2} frames={1} resolution={1024} scale={120} blur={2} opacity={0.6} far={100} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} makeDefault />
      <PerspectiveCamera makeDefault position={[-30, 100, 120]} fov={35} />
    </Canvas>
  )
}

/***** Porsche911  ******/

function Porsche(props) {
  const { scene, nodes, materials } = useGLTF('/911-transformed.glb')
  useMemo(() => {
    Object.values(nodes).forEach((node) => node.isMesh && (node.receiveShadow = node.castShadow = true))
    applyProps(materials.rubber, { color: '#222', roughness: 0.6, roughnessMap: null, normalScale: [4, 4] })
    applyProps(materials.window, { color: 'black', roughness: 0, clearcoat: 0.1 })
    applyProps(materials.coat, { envMapIntensity: 4, roughness: 0.5, metalness: 1 })
    applyProps(materials.paint, { roughness: 0.5, metalness: 0.8, color: '#555', envMapIntensity: 2 })
  }, [nodes, materials])
  return <primitive object={scene} {...props} />
}

function CameraRig({ v = new THREE.Vector3() }) {
  return useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 10 + Math.cos(t / 5)), 0.05)
    state.camera.lookAt(0, 0, 0)
  })
}

function MovingSpots({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const group = useRef()
  useFrame((state, delta) => (group.current.position.z += delta * 15) > 60 && (group.current.position.z = -60))
  return (
    <group rotation={[0, 0.5, 0]}>
      <group ref={group}>
        {positions.map((x, i) => (
          <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
        ))}
      </group>
    </group>
  )
}

function Porsche911() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [-10, 0, 15], fov: 30 }}>
    <Porsche scale={1.6} position={[-0.5, -0.18, 0]} rotation={[0, Math.PI / 5, 0]} />
    <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} castShadow intensity={2} shadow-bias={-0.0001} />
    <ambientLight intensity={0.2} />
    <ContactShadows resolution={1024} frames={1} position={[0, -1.16, 0]} scale={10} blur={3} opacity={1} far={10} />

    {/* Renders contents "live" into a HDRI environment (scene.environment). */}
    <Environment frames={Infinity} resolution={256}>
      {/* Ceiling */}
      <Lightformer intensity={0.75} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <MovingSpots />
      {/* Sides */}
      <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
      <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
      <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
      {/* Accent (red) */}
      <Float speed={5} floatIntensity={2} rotationIntensity={2}>
        <Lightformer form="ring" color="red" intensity={1} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
      </Float>
      {/* Background */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* <LayerMaterial side={THREE.BackSide}>
          <Base color="#444" alpha={1} mode="normal" />
          <Depth colorA="blue" colorB="black" alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
        </LayerMaterial> */}
      </mesh>
    </Environment>

    <BakeShadows />
    <CameraRig />
  </Canvas>
  )
}

export { Bruno, Cube, SSR2, Envmap, Porsche911 }
