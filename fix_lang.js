const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// lang
html = html.replace('lang="vi"', 'lang="en"');

// Key VN strings to EN
const pairs = [
  ['Vỉa hè','Sidewalk'],['TMall','Mall'],['Sân vườn','Garden'],['Lễ hội','Festival'],
  ['Cà phê đen','Black Coffee'],['Cà phê sữa','Milk Coffee'],['Trà matcha','Matcha Tea'],['Sinh tố','Smoothie'],['Bánh mì','Banh Mi'],['Trà đá','Iced Tea'],['Trà sữa','Bubble Tea'],['Nước ép dừa','Coconut Juice'],
  ['Meme Chó Vàng','Golden Doge'],['Mèo hoang','Stray Cat'],['Áo MU','MU Jersey'],['Trà Astro','Astro Tea'],['Cô Bé','Girly Style'],['Ba Trăm','300 Style'],['Siêu Tốc','Super Speed'],['Vua Cà Phê','Coffee King'],
  ['Barista','Barista'],['Đầu bếp','Chef'],['Senior Barista','Senior Barista'],['Quản lý','Manager'],
  ['Bàn ghế mới','New Tables'],['Nhạc nền','Background Music'],['Bảng hiệu LED','LED Sign'],['Điều hòa','AC'],
  ['Nắng','Sunny'],['Mát','Cloudy'],['Mưa','Rainy'],['Nóng','Hot'],['Tết','Tet Holiday'],
  ['Ngày','Day'],['Level','Level'],['Đã phục vụ','Served'],['Doanh thu hôm nay','Today Rev'],['Tổng doanh thu','Total Rev'],
  ['Coin','Coins'],['Items','Items'],['Auto-serve','Auto-Serve'],['Nhân viên','Staff'],['Reputation','Rep'],
  ['Combo hiện tại','Current Combo'],['Không có','None'],['Combo max','Max Combo'],['Đánh giá TB','Avg Rating'],
  ['Chưa có items','No items'],['Đã hết','All owned'],['Chưa thuê ai','No staff'],
  ['ĐỘI NGŨ','TEAM'],['THUÊ NHÂN VIÊN','HIRE STAFF'],['Thuê','HIRE'],['Mở khóa','Unlock'],
  ['Cần','Need'],['Khách bỏ đi','Customer left'],['Rep -2','Rep -2'],['Chờ khách','Waiting...'],
  ['MUA','BUY'],['Không đủ coin','No coins'],['Mua','Bought'],['Đã sa thải','Fired'],['Đầy nhân viên','Full staff'],
  ['Thuê','Hired'],['mood +30','mood +30'],['Quá tệ','Terrible'],['Không ngon','Not tasty'],['Khá ổn','Okay'],['Ngon lắm','Delicious'],['Tuyệt vời','Amazing'],
  ['Phục vụ','Serve'],['khách','customers'],['sở hữu','own'],['Thu thập','Collect'],['Có','Have'],
  ['Ngày đầu khai trương','Day 1 Opening'],['Thu thập meme','Collect memes'],['Thu thập bộ sưu tập','Collect set'],['Sở hữu hết items','Own all'],
];
let count = 0;
pairs.forEach(([vn, en]) => {
  const re = new RegExp(vn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  if (html.includes(vn)) {
    html = html.replace(re, en);
    count++;
  }
});

fs.writeFileSync('index.html', html);
console.log('Replaced', count, 'VN strings with EN');
