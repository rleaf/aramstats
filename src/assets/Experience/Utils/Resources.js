import * as THREE from 'three'
import EventEmitter from "./EventEmitter"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resources extends EventEmitter {
   constructor(sources) {
      super()

      this.sources = sources
      this.items = {}
      this.toLoad = this.sources.length
      this.loaded = 0

      this.setLoaders()
      // this.startLoading()
   }

   setLoaders() {
      this.loaders = {}
      this.loaders.gltfLoader = new GLTFLoader()
      this.loaders.textureLoader = new THREE.TextureLoader()
      this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
   }

   startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        console.log(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        console.log(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        console.log(source, file)
                    }
                )
            }
        }
    }
}