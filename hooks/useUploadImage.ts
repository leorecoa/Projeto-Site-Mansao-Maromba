import { useState } from 'react'
import { supabase } from '../services/supabase'

export const useUploadImage = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      setError(null)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadImage, uploading, error }
}
