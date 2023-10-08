import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Experience from '../Experience'


export default class Map {
   constructor() {

      this.experience = new Experience()
      this.scene = this.experience.scene
      this.loader = new GLTFLoader()
      this.loaded = false
      this.init()
   }
   
   async init() {
      this.obj = await this.loader.loadAsync('src/assets/Experience/model/MAIN.glb')
      this.scene.add(this.obj.scene)
      this.obj.scene.traverse(child => {
         if (child.isMesh) {
            console.log(child)
            // child.geometry.computeFaceNormals()
            // child.material.side = THREE.DoubleSide
            child.material.wireframe = true
         }
      })
      // this.bbox = new THREE.Box3().setFromObject(this.obj.scene)
      this.loaded = true
      this.setGeometry()
      // this.setMaterial()
      // this.fillPoints()
      // this.setMesh()
   }
   
   setGeometry() {
      // const vertices = []
      this.obj.scene.traverse((child) => {
         if(child.isMesh) {
            child.material.side = THREE.DoubleSide
            // vertices.push(...child.geometry.attributes.position.array)
         } 
      })
      // this.geometry = new THREE.BufferGeometry()
      // this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
   }

   setMaterial() {
      this.material = new THREE.PointsMaterial({
         color: 0xFFFFFF,
         size: 0.001,
         transparent: true,
         blending: THREE.AdditiveBlending,
         depthWrite: false
      })
   }

   fillPoints() {
      const points = []
      let counter = 0

      while (counter < 20000) {
         let v = new THREE.Vector3(
            THREE.MathUtils.randFloat(this.bbox.min.x, this.bbox.max.x),
            THREE.MathUtils.randFloat(this.bbox.min.y, this.bbox.max.y),
            THREE.MathUtils.randFloat(this.bbox.min.z, this.bbox.max.z)
         )
            
         this.ray = new THREE.Raycaster(v, new THREE.Vector3(0, 1, 0))
         const intersects = this.ray.intersectObject(this.obj.scene) 

         if (intersects.length === 1) {
            points.push(v)
            counter++
         }
      }

      this.geometry2 = new THREE.BufferGeometry().setFromPoints(points)
   }

   setMesh() {
      this.mesh = new THREE.Points(this.geometry2, this.material)
      this.scene.add(this.obj.scene)
      // this.scene.add(this.mesh)
   }

   update() {
      // this.mesh.rotation.y += 0.0005
   }
}