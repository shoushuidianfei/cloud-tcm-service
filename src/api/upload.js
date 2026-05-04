import api from './index'

export function uploadFile(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onProgress?.({ percent })
    }
  })
}

export function deleteFile(fileId) {
  return api.delete(`/upload/${fileId}`)
}
