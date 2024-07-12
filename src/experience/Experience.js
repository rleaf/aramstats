import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Mouse from "./Utils/Mouse.js"
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import { Pane } from 'tweakpane'

let instance = null

export default class Experience {
   constructor(canvas, returnSingle = true) {

      if(instance && returnSingle) {
         return instance
      }

      instance = this

      this.canvas = canvas
      // this.setDebug()
      this.sizes = new Sizes()
      this.mouse = new Mouse()
      this.time = new Time()
      this.scene = new THREE.Scene()
      this.camera = new Camera()
      this.renderer = new Renderer()
      this.world = new World()
      
      this.sizes.on('resize', () => {
         this.resize()
      })

      this.time.on('tick', () => {
         this.update()
      })
   }

   resize() {
      this.camera.resize()
      this.renderer.resize()
   }

   update() {
      this.camera.update()
      this.renderer.update()
      this.world.update()
   }

   setDebug() {
      this.debug = new Pane()
   }

   remove() {
      this.world.map.dispose()
      while(this.scene.children.length > 0) {
         this.scene.remove(this.scene.children[0])
      }
   }
}