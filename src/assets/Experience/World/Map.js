import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Experience from '../Experience'


export default class Map {
   constructor() {

      this.experience = new Experience()
      this.scene = this.experience.scene
      this.loader = new GLTFLoader()

      this.load()
      this.setGeometry()
      this.setMaterial()
      this.setMesh()
      this.update()
   }

   load() {
      
      this.loader.load('src/assets/Experience/model/howling_abyss.glb', obj => {
         console.time('ye')
         const vertices = []
         obj.scene.traverse((child) => {
            if(child.isMesh) {
               vertices.push(...child.geometry.attributes.position.array)
            } 
         })
            
         const geometry = new THREE.BufferGeometry()
         const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.001,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
         })
         // const json = JSON.stringify({vertices})
         geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
         geometry.computeBoundingBox()
         // geometry2.setAttribute('position', new THREE.Float32BufferAttribute(flag, 3))

         // const f = new THREE.Points(geometry2, material)
         const p = new THREE.Points(geometry, material)
         // f.scale.set(0.36, 0.42667, 0.568)
         // f.translateZ(2.)
         // f.rotateZ(-90 * Math.PI / 180)

         // const group = new THREE.Group()

         // group.add(f)
         // group.add(p)
         // group.rotateX(-90 * Math.PI / 180)
         
         // p.scale.set(0.5, 0.5, 0.5)
         // p.translateZ(-3000)
         this.scene.add(p)
         // obj.scene.scale.set(0.5, 0.5, 0.5)
         // obj.scene.translateZ(-3000)
         // this.scene.add(obj.scene)

      }, (xhr) => {
         if (xhr.total === 1) console.timeEnd('ye')
      }, (e) => {
      })
   }

   setGeometry() {

   }

   setMaterial() {

   }

   setMesh() {

   }

   update() {

   }
}