import yt_dlp

# ダウンロードしたい動画のURL
url = 'https://www.youtube.com/watch?v=...'

# ダウンロード設定（最高画質を選択、ファイル名を「動画タイトル.拡張子」にする）
ydl_opts = {
    'format': 'best',
    'outtmpl': '%(title)s.%(ext)s',
}

# ダウンロードの実行
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])
