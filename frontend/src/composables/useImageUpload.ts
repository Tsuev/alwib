import { ref } from 'vue'
import { uploadImage } from '@/services/storeService'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_SIZE) return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 1920
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)

        const tryQuality = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file)
              if (blob.size <= MAX_SIZE || quality <= 0.3) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }))
              } else {
                tryQuality(Math.round((quality - 0.1) * 10) / 10)
              }
            },
            'image/jpeg',
            quality,
          )
        }
        tryQuality(0.9)
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function useImageUpload() {
  const uploading = ref(false)

  async function upload(file: File): Promise<string> {
    uploading.value = true
    try {
      const compressed = await compressImage(file)
      const { url } = await uploadImage(compressed)
      return url
    } finally {
      uploading.value = false
    }
  }

  return { uploading, upload }
}
