const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static('uploads')); // 允许访问上传的文件

// 设置 multer 存储路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ 合并后的上传+调用 Python 路由
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  const filePaths = req.files.map(file => path.join(__dirname, file.path));
  console.log('收到图片:', filePaths);

  const python = spawn('python', ['run_dust3r.py', ...filePaths]); // 如果你是 python3 改成 'python3'

  let output = '';
  python.stdout.on('data', data => {
    output += data.toString();
    console.log('[Python STDOUT]', data.toString());
  });

  python.stderr.on('data', data => {
    console.error('[Python STDERR]', data.toString());
  });

  python.on('close', code => {
    console.log(`Python 脚本退出，code ${code}`);
    const lines = output.trim().split('\n');
    const lastLine = lines[lines.length - 1];

    // 如果有输出模型路径
    if (lastLine.startsWith('处理完成')) {
      const modelPath = lastLine.replace('处理完成，输出路径：', '').trim();
      res.json({ success: true, model: modelPath });
    } else {
      res.status(500).json({ success: false, message: 'Python 脚本执行失败', output });
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
