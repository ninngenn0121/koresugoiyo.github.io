const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// uploadsフォルダが無い場合は自動作成
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// アップロードされた画像をブラウザから見られるように設定
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 画像の保存先設定
const upload = multer({ dest: 'uploads/' });

// 簡易データベース（メモリ保存）
let faces = []; 

// トップページ（直下の index.html を返す）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 画像アップロードと採点処理
app.post('/upload', upload.single('faceImage'), (req, res) => {
    if (!req.file) return res.redirect('/');
    
    // 0〜100のランダムな点数（デモ用）
    const score = Math.floor(Math.random() * 101);
    
    faces.push({
        imageUrl: `/uploads/${req.file.filename}`,
        score: score,
        id: Date.now()
    });
    
    res.redirect('/');
});

// ランキングデータを返すAPI
app.get('/api/faces', (req, res) => {
    // 点数の高い順（降順）に並べ替え
    const sortedFaces = [...faces].sort((a, b) => b.score - a.score);
    res.json(sortedFaces);
});

// Renderのポート指定に対応
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
