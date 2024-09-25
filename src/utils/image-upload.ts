import axios from 'axios';

import { GET_PRESIGNED_URL } from 'graphql/queries';
import { v4 as uuidV4 } from 'uuid'; // Ensure you import uuid
import client from '../../apollo.config';

interface HandleImageChangeOptions {
  setImageUploadStatus: (status: 'uploading' | 'success' | 'error') => void;
  setImage: (image: File | null) => void;
  setSnackbarMessage: (message: string) => void;
  setSnackbarSeverity: (severity: 'error' | 'success') => void;
  setSnackbarOpen: (open: boolean) => void;
}

export const handleFileUpload = async (file: File, options: HandleImageChangeOptions): Promise<string | null> => {
  const { setImageUploadStatus, setImage, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen } = options;

  console.log('handleFileUpload function called');
  console.log('file', file);

  const { size: fileSize, type: fileType, name: originalFilename } = file;
  setImageUploadStatus('uploading'); // Start uploading

  // Extract file extension and generate UUID-based filename
  let fileExtension = originalFilename.split('.').pop()?.toLowerCase();
  const uuid = uuidV4();
  const filename = `${uuid}.${fileExtension}`;

  console.log('Generated filename:', filename);

  try {
    // Get pre-signed URL from backend using the generated filename
    const { data } = await client.query({
      query: GET_PRESIGNED_URL,
      variables: {
        getPreSignedUrl: { fileSize, fileType, filename }
      }
    });
    const url = data.getPreSignedUrl;
    console.log('handleFileUpload url:', url);

    // Upload the image to the pre-signed URL using axios
    await axios.put(url, file, {
      headers: {
        'Content-Type': fileType
      }
    });

    // Extract the path and full URL
    const path = url.match(/\/temp\/[^?]+/)[0].substring(1);
    console.log('image-output=====', path);

    // Set the image and status
    setImage(file);
    setImageUploadStatus('success');
    return path;
  } catch (error) {
    console.error('Error uploading image:', error);
    setImageUploadStatus('error');
    setSnackbarMessage('Image upload failed. Please try again.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return null;
  }
};
