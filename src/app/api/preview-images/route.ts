import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const previewDir = path.join(process.cwd(), 'public', 'preview');
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(previewDir);
    
    // 过滤只保留图片文件（.png, .jpg, .jpeg, .webp, .gif）
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
    });
    
    // 将文件名转换为相对路径URL
    const imageUrls = imageFiles.map(file => `/preview/${file}`);
    
    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error('Error reading preview directory:', error);
    return NextResponse.json(
      { error: 'Failed to read preview images' },
      { status: 500 }
    );
  }
} 