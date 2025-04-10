import React from 'react';
import './App.css';
import PhotoUploader from './components/PhotoUploader';

const App = () => (
  <div className="App">
    <h1 style={{ textAlign: 'center', margin: '24px 0' }}>iHeadCare · 儿童头部图像上传</h1>
    <PhotoUploader />
  </div>
);

export default App;
