const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 确保图片目录存在
const dirs = [
  'miniprogram/images/banners',
  'miniprogram/images/categories',
  'miniprogram/images/products',
  'miniprogram/images/reviews',
  'miniprogram/images/tabbar'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 生成图片的函数
function generateImage(type, index, width, height, text, color, isActive = false) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 背景色
  ctx.fillStyle = isActive ? '#1296db' : color;
  ctx.fillRect(0, 0, width, height);

  // 文字
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.min(width, height) / 8;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `${text} ${index + 1}${isActive ? ' Active' : ''}`,
    width / 2,
    height / 2
  );

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  const filename = `${type}-${index + 1}${isActive ? '-active' : ''}.png`;
  const filepath = path.join('miniprogram/images', type, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filepath}`);
}

// 生成空状态图片
function generateEmptyState() {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, 200, 200);

  // 文字
  ctx.fillStyle = '#999999';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('No Data', 100, 100);

  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join('miniprogram/images', 'empty.png');
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filepath}`);
}

// 生成所有图片
const configs = {
  banners: { width: 750, height: 300, count: 2, color: '#1296db', text: 'Banner' },
  categories: { width: 80, height: 80, count: 4, color: '#1890ff', text: 'Category' },
  products: { width: 300, height: 300, count: 5, color: '#52c41a', text: 'Product' },
  reviews: { width: 160, height: 160, count: 2, color: '#722ed1', text: 'Review' },
  tabbar: { width: 48, height: 48, count: 4, color: '#999999', text: 'Tab', active: true }
};

// 生成每种类型的图片
Object.entries(configs).forEach(([type, config]) => {
  for (let i = 0; i < config.count; i++) {
    generateImage(type, i, config.width, config.height, config.text, config.color);
    if (config.active) {
      generateImage(type, i, config.width, config.height, config.text, config.color, true);
    }
  }
});

// 生成空状态图片
generateEmptyState();

console.log('All images generated successfully!'); 