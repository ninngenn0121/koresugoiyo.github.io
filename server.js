const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// uploadsフォルダが無い場合は自動作成する
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// フロントエンドのファイルと、アップロードされた画像を配信
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 画像の保存先設定
const upload = multer({ dest: 'uploads/' });

// 簡易データベース（メモリ保存）
let faces = []; 

// 画像アップロードと採点の処理
app.post('/upload', upload.single('faceImage'), (req, res) => {
    if (!req.file) return res.redirect('/');
    
    // 【ここにAIの処理を組み込みます】
    // 今回はベースアプリとして、0〜100のランダムな点数を付与
    const score = Math.floor(Math.random() * 101);
    
    faces.push({
        imageUrl: `/uploads/${req.file.filename}`,
        score: score,
        id: Date.now() // 表示用の一意のID
    });
    
    // アップロード後、元の画面に戻る
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
