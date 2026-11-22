
import axios from 'axios'

// Address of the FastAPI backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000'

// Send a leaf photograph to the backend
export async function predictLeafDisease(imageFile) {

  // Validate the selected image
  if (!imageFile) {
    throw new Error('Please select a leaf photograph.')
  }

  // Image prediction endpoint will be provided by Member 3
  const endpoint = import.meta.env.VITE_PREDICT_ENDPOINT

  // Do not call the old sensor-based endpoint
  if (!endpoint) {
    throw new Error(
      'Image prediction API is not configured yet.'
    )
  }

  // Prepare the image for uploading
  const formData = new FormData()
  formData.append('file', imageFile)

  try {

    // Send the photograph to FastAPI
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      formData,
      {
        timeout: 60000,
      }
    )

    // Return the prediction data
    return response.data

  } catch (error) {

    // Backend returned an error response
    if (error.response) {
      const detail = error.response.data?.detail

      const message =
        typeof detail === 'string'
          ? detail
          : 'The backend could not process this image.'

      throw new Error(message, {
        cause: error,
      })
    }

    // Request took too long
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Prediction timed out. Please try again.',
        {
          cause: error,
        }
      )
    }

    // Network or connection error
    throw new Error(
      'Unable to connect to the prediction server.',
      {
        cause: error,
      }
    )
  }
}
