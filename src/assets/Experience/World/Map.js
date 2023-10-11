import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import Experience from '../Experience'
import vertexIndices from '../../model_indices/vertexIndices'


export default class Map {
   constructor() {

      this.experience = new Experience()
      this.scene = this.experience.scene

      this.camera = this.experience.camera.instance

      this.loader = new GLTFLoader()
      this.loaded = false
      this.init()
   }
   
   async init() {
      this.obj = await this.loader.loadAsync('src/assets/Experience/model/MAIN2.glb')
      // console.log(this.obj.scene, 'toad')
      this.obj.scene.traverse(child => {
         if (child.isMesh) {
            // points.push(child.geometry.attributes.position.array)
            // console.log(child)
            child.material.wireframe = true
         }
      })
      this.loaded = true
      // this.setGeometry()
      // this.setMaterial()
      // this.setMesh()

      const mountainsGeometry = this.obj.scene.children[2].geometry.clone()
      const wallOneGeometry = this.obj.scene.children[3].geometry.clone()
      const wallTwoGeometry = this.obj.scene.children[4].geometry.clone()

      // Oh my god
      // this.raycast(wallTwoGeometry)

      // let str = ''

      // for (let i = 0; i < 19; i++) {
      //    for (let j = i; j < i+342; j+=19) {
      //       str += `${j}, ${j + 19}, `
      //       console.log(str)
            
      //    }
         
      // }
      mountainsGeometry.setIndex(vertexIndices.mountain)
      wallOneGeometry.setIndex(vertexIndices.wallOne)
      wallTwoGeometry.setIndex(vertexIndices.wallTwo)
      const mountainMesh = new THREE.LineSegments(mountainsGeometry, new THREE.LineBasicMaterial( {color: 0x41558b} ))
      const wallOneMesh = new THREE.LineSegments(wallOneGeometry, new THREE.LineBasicMaterial( {color: 0x41558b} ))
      const wallTwoMesh = new THREE.LineSegments(wallTwoGeometry, new THREE.LineBasicMaterial( {color: 0x41558b} ))

      this.scene.add(mountainMesh, wallOneMesh, wallTwoMesh)

      const group = new THREE.Group()

      // this.obj.scene.children[0].material.color.setHex(0x00ff00)
      // this.obj.scene.children[0].material.blending = THREE.SubtractiveBlending 
      // this.obj.scene.children[0].material.de

      group.add(
         this.obj.scene.children[0],
         this.obj.scene.children[1],
         this.obj.scene.children[5],
         this.obj.scene.children[6],
      )
      console.log(group, 'group')
      // this.scene.add(wallTwoMesh)
      // this.obj.scene.children.splice(2, 1)
      // this.scene.add(this.obj.scene)
      this.scene.add(group)
   }

   raycast(geometry) {
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
      // this.mesh = new THREE.Points(this.geometry2, this.material)
      // this.scene.add(this.mesh)
   }

   update() {
      // this.mesh.rotation.y += 0.0005
   }
}