# ContractApp2

Ứng dụng quản lý và phê duyệt hợp đồng nội bộ được xây dựng bằng **ReactJS**.

## 📋 Yêu cầu hệ thống

Trước khi chạy dự án, hãy đảm bảo bạn đã cài đặt:

- [Node.js](https://nodejs.org/) (phiên bản LTS khuyến nghị, ví dụ: 18.x hoặc 20.x)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

## 🚀 Cách chạy dự án

1. **Clone dự án về máy:**

   ```bash
   git clone https://github.com/ten-tai-khoan/ContractApp2.git
   cd ContractApp2
Cài đặt dependencies:

Nếu dùng npm:

bash
Copy
Edit
npm install
Hoặc dùng yarn:

bash
Copy
Edit
yarn install
Tạo file cấu hình môi trường (nếu cần):

Tạo file .env ở thư mục gốc dự án

Thêm các biến môi trường cần thiết, ví dụ:

env
Copy
Edit
REACT_APP_API_URL=http://localhost:8080/api
Chạy dự án ở môi trường phát triển:

bash
Copy
Edit
npm start
Hoặc:

bash
Copy
Edit
yarn start
Ứng dụng sẽ chạy tại: http://localhost:3000

Build dự án cho môi trường production:

bash
Copy
Edit
npm run build
Hoặc:

bash
Copy
Edit
yarn build
Thư mục build/ sẽ chứa các file tĩnh sẵn sàng deploy.

📂 Cấu trúc thư mục
plaintext
Copy
Edit
src/
 ├── components/        # Các thành phần giao diện (UI components)
 ├── pages/             # Các trang chính của ứng dụng
 ├── services/          # Gọi API, xử lý dữ liệu
 ├── hooks/             # Custom hooks
 ├── styles/            # CSS, SCSS, styled-components
 └── App.js             # File khởi tạo ứng dụng
🛠 Các lệnh hữu ích
Lệnh	Mô tả
npm start	Chạy ứng dụng ở môi trường dev
npm run build	Build ứng dụng cho production
npm test	Chạy test (nếu có cấu hình)
npm run lint	Kiểm tra lint

📄 Giấy phép
Dự án được phát triển cho mục đích học tập và nội bộ.

yaml
Copy
Edit

---

Mình có thể viết thêm phần **hướng dẫn cài đặt backend API** nếu dự án của bạn cần kết nối API riêng.  
Bạn có muốn mình viết kèm luôn phần **chạy backend** để README hoàn chỉnh hơn không?