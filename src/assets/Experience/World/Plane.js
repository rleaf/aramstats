import * as THREE from 'three'
import Experience from '../Experience'
import vertex from '../shaders/base/vertex.glsl'
import fragment from '../shaders/base/fragment.glsl'

export default class Plane {
   constructor() {

      this.experience = new Experience()
      this.debug = this.experience.debug
      this.mouse = this.experience.mouse.pointer
      this.scene = this.experience.scene
      this.time = this.experience.time
      this.raycaster = new THREE.Raycaster()

      if (this.debug) {
         this.debugFolder = this.debug.addFolder({
            title: 'Plane',
            expanded: true
         })
      }

      this.setGeometry()
      this.setMaterial()
      this.setMesh()
      this.setMouseRaycaster()
      this.update()
   }

   setGeometry() {
      this.geometry = new THREE.PlaneGeometry(3, 3, 32, 32)
   }

   setMaterial() {
      this.material = new THREE.ShaderMaterial({
         vertexShader: vertex,
         fragmentShader: fragment,
         uniforms: {
            uFrequency: { value: 10 },
            uTime: { value: 0 }
         }
      })

      if (this.debug) {
         this.debugFolder.addInput(
            this.material.uniforms.uFrequency,
            'value',
            { label: 'uFrequency', min: 5, max: 20, step: 0.1}
         )
      }
   }

   setMesh() {
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
   }

   setMouseRaycaster() {
      function onMouseEvent(that) {
         that.raycaster.setFromCamera(that.mouse, that.experience.camera.instance)
         that.intersects = that.raycaster.intersectObject(that.mesh)   
   
         if (that.intersects.length > 0) {
            console.log('raycast')
            // that.material.uniforms.uMouse.value = that.intersects[0].point
         }
      }

      window.addEventListener('mousemove', () => onMouseEvent(this), false)
   }
   
   update() {
      this.material.uniforms.uTime.value = this.time.elapsed * 0.2
   }
}