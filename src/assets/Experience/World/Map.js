import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Experience from '../Experience'
import vertexIndices from '../../vertexIndices'


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
      this.obj.scene.traverse(child => {
         if (child.isMesh) child.material.wireframe = true
      })
      this.loaded = true
      this.setGeometry()
      this.setMaterial()
      this.setMesh()

      // this.raycast(wallTwoGeometry)
   }

   raycast(geometry) {
      /* 
         Utility. To "conveniently" find vertex indices for line segments.
      */
      console.log(geometry, 'geo')
      const tooltipEnabledObjects = []
      const verts = geometry.attributes.position.array

      for (let k = 0; k < verts.length; k+=3) {
         const boxMarker = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 5),
            new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: false} )
         )

         let text = `idx: ${k / 3}`
         boxMarker.userData.tooltipText = text

         boxMarker.applyMatrix4(new THREE.Matrix4().makeTranslation(verts[k],verts[k+1],verts[k+2]));

         this.scene.add(boxMarker);
         tooltipEnabledObjects.push(boxMarker)
      }

      const raycaster = new THREE.Raycaster();

      this.pointer = new THREE.Vector2()
      window.addEventListener('mousemove', (e) => {
         this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
         this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1
      })

      function onPointerMove( that ) {
         raycaster.setFromCamera( that.pointer, that.camera );
         const intersects = raycaster.intersectObjects( that.scene.children );
         if (intersects.length > 0 && intersects[0].object.userData.tooltipText != undefined) {
            console.log(intersects[0].object.userData.tooltipText, 'waffles')
            // console.log(intersects[0].object, 'waffles')
         }
      }

      window.addEventListener( 'mousemove', () => onPointerMove(this), false );
   }
   
   setGeometry() {
      this.mountainsGeometry = this.obj.scene.children[2].geometry.clone()
      this.wallOneGeometry = this.obj.scene.children[3].geometry.clone()
      this.wallTwoGeometry = this.obj.scene.children[4].geometry.clone()

      this.mountainsGeometry.setIndex(vertexIndices.mountain)
      this.wallOneGeometry.setIndex(vertexIndices.wallOne)
      this.wallTwoGeometry.setIndex(vertexIndices.wallTwo)
   }

   setMaterial() {
      this.material = new THREE.LineBasicMaterial({
         color: 0x41558b,
         opacity: 0.8,
         transparent: true
      })
   }

   setMesh() {
      this.mountainMesh = new THREE.LineSegments(this.mountainsGeometry, this.material)
      this.wallOneMesh = new THREE.LineSegments(this.wallOneGeometry, this.material)
      this.wallTwoMesh = new THREE.LineSegments(this.wallTwoGeometry, this.material)

      this.group = new THREE.Group()
      this.group.add(
         this.obj.scene.children[0], // Bridge
         this.obj.scene.children[1], // Outer 
         this.obj.scene.children[5], // Brace 2
         this.obj.scene.children[6], // Brace 1
         this.mountainMesh,
         this.wallOneMesh,
         this.wallTwoMesh
      )

      this.scene.add(this.group)
   }

   update() {
      this.group.rotation.y += 0.0005
   }

   dispose() {
      this.obj.scene.traverse(child => {
         if (child.isMesh) {
            child.geometry.dispose()
            child.material.dispose()
         }
      })

      this.mountainsGeometry.dispose()
      this.wallOneGeometry.dispose()
      this.wallTwoGeometry.dispose()
      this.material.dispose()
   }
}