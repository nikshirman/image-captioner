import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, CircularProgress } from '@mui/material';

function App() {
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    document.title = 'Image Analyzer'; // Set the tab title here
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }
  
    try {
      setLoading(true);
      setImageUrl('');
  
      // Read the file as binary data
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryData = e.target.result;
  
        try {
          // Make the request to Hugging Face API
          const response = await axios.post(
            'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base',
            binaryData, // Send raw binary data
            {
              headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/octet-stream', // Specify binary data
              },
            }
          );
  
          setCaption(response.data[0].generated_text);
          setImageUrl(URL.createObjectURL(file)); // Display the uploaded image
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image!');
        } finally {
          setLoading(false);
        }
      };
  
      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file!');
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <Box sx={{ textAlign: 'center', paddingTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          Upload Your Image for Analyzing!
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{ marginBottom: 2 }}
        >
          Choose Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>

        {loading && (
          <Box sx={{ marginTop: 2 }}>
            <CircularProgress size={60} thickness={6} />
          </Box>
        )}

        {imageUrl && (
          <Box sx={{ marginTop: 3 }}>
            <img
              src={imageUrl}
              alt="Uploaded"
              style={{
                maxWidth: '100%',
                width: '500px', // Fixed width for preview
                height: 'auto', // Auto adjusts the height to maintain aspect ratio
              }}
            />
          </Box>
        )}

        {caption && !loading && (
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            This image is about: <strong>{caption}</strong>
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
