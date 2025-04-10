import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const PhotoUploader = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('上传成功');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      message.error('上传失败');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Upload
        multiple
        listType="picture"
        beforeUpload={() => false} // 阻止自动上传
        onChange={handleChange}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>选择图片</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        上传图片
      </Button>
    </div>
  );
};

export default PhotoUploader;
