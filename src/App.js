import React, { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);

  async function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    
    const imageUrl = `https://ys28bydtsj.execute-api.us-east-1.amazonaws.com/dev/prashant-visitor-image/${visitorImageName}.jpeg`;
    
    try {
      await fetch(imageUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: image
      });

      const response = await authenticate(visitorImageName);
      if (response && response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response.firstName} ${response.lastName}, welcome to work. Hope you have a productive day today!!`);
      } else {
        setAuth(false);
        setUploadResultMessage('Authentication Failed: this person is not an employee.');
      }
    } catch (error) {
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication process. Please try again.');
      console.error(error);
    }
  }

  async function authenticate(visitorImageName) {
    const requestUrl = `https://ys28bydtsj.execute-api.us-east-1.amazonaws.com/dev/employee?objectKey=${visitorImageName}.jpeg`;
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return (
    <div className="App">
      <h2>Prashant's Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250} />
    </div>
  );
}

export default App;
