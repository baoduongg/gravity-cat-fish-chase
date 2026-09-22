# 🐱 Gravity Cat: Fish Chase

> **Tựa game 2D Side-scrolling Platformer phong cách Pastel nhẹ nhàng, vui nhộn và gây nghiện trên nền tảng Web!**

![HTML5 Canvas](https://img.shields.io/badge/Engine-HTML5%20Canvas%202D-orange?style=flat-square)
![JavaScript](https://img.shields.io/badge/Language-Vanilla%20JavaScript-yellow?style=flat-square)
![CSS3](https://img.shields.io/badge/Styling-Vanilla%20CSS3%20(Pastel)-blue?style=flat-square)
![Web Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20Synth-green?style=flat-square)

---

## 📖 1. Giới thiệu tổng quan

**Gravity Cat: Fish Chase** là tựa game chạy cuộn cảnh kết hợp nhảy bục (Side-scrolling Platformer / Endless Runner). Người chơi điều khiển chú Mèo Cam đeo kính phi công phiêu lưu qua vùng đất kỳ diệu, khéo léo né tránh các cạm bẫy dưới đất và trên không, nhảy lên các bục lơ lửng để gom cá vàng và tích lũy điểm số kỷ lục.

---

## ✨ 2. Tính năng nổi bật

* 🎮 **Vật lý Platformer mượt mà:** Di chuyển trái/phải linh hoạt, Nhảy & Nhảy đôi (Double Jump), hỗ trợ kỹ thuật *Coyote Time* và *Jump Buffering* giúp thao tác cực nhạy.
* ☁️ **Hệ thống Bục nhảy đa tầng (Floating Platforms):** Bục lơ lửng xuất hiện ở nhiều độ cao khác nhau với cơ chế đáp bục một chiều (*One-way collision*).
* ⚡ **Hiệu ứng Near-Miss (Né sát nút):** Kích hoạt quay chậm *Slow-motion 0.35s* và thông báo *"MEOW! ✨"* khi lướt qua bẫy trong gang tấc.
* 🐾 **Hệ thống Combo Multiplier:** Ăn chuỗi cá liên tiếp không bỏ lỡ để nhân hệ số điểm **x2, x3, x5**.
* 🛍️ **Tủ đồ & Mở khóa (Cosmetics Shop):**
  * **5 Bộ Skin Mèo:** *Mèo Cam Béo, Mèo Đen Ninja, Mèo Tam Thể, Mèo Hoàng Gia, Mèo Bánh Mì*.
  * **4 Hiệu ứng Vệt chạy (Trails):** *Gió Thoảng, Cầu Vồng Lấp Lánh, Bong Bóng Nước, Trái Tim Hồng*.
* 🎵 **Hệ thống Âm thanh Tự sinh (Web Audio API):**
  * Tích hợp trọn bộ hiệu ứng SFX (tiếng nhảy, đớp cá, meow, va chạm).
  * Nhạc nền Chiptune Lofi vui tươi, nhẹ nhàng với nút bật/tắt âm thanh trực tiếp.
* 📱 **Hỗ trợ đa nền tảng:** Tự động co giãn màn hình (Responsive), hỗ trợ cụm phím ảo D-Pad & Jump trên thiết bị cảm ứng (Mobile/Tablet).
* 💾 **Lưu trữ cục bộ:** Tự động lưu Kỷ lục (Best Score), Tổng số cá và các vật phẩm đã mở khóa vào `localStorage`.

---

## 🕹️ 3. Hướng dẫn điều khiển

### 💻 Trên máy tính (PC / Laptop):
| Thao tác | Phím bấm |
| :--- | :--- |
| **Di chuyển Trái / Phải** | Phím **`A` / `D`** hoặc **`←` / `→`** |
| **Nhảy / Nhảy đôi (Double Jump)** | Phím **`SPACE`**, **`W`** hoặc **`↑`** |
| **Bật / Tắt âm thanh** | Nút **`🔊 / 🔇`** ở góc phải màn hình |

### 📱 Trên Điện thoại / Máy tính bảng (Touch):
| Thao tác | Nút cảm ứng |
| :--- | :--- |
| **Di chuyển** | Cụm nút ảo **`◀`** **`▶`** ở góc trái màn hình |
| **Nhảy / Nhảy đôi** | Nút ảo lớn **`▲ JUMP`** ở góc phải màn hình |

---

## 🚀 4. Hướng dẫn chạy game

Không cần cài đặt bất kỳ thư viện hay môi trường phức tạp nào:

### Cách 1: Mở trực tiếp
Nhấp đúp chuột vào file **`index.html`** để mở game trên bất kỳ trình duyệt web hiện đại nào (Chrome, Safari, Firefox, Edge).

### Cách 2: Chạy qua Local Server (Khuyên dùng)
Dùng tiện ích mở rộng như **Live Server** trong VS Code / Antigravity IDE hoặc chạy lệnh terminal:

```bash
# Sử dụng npx serve (Node.js)
npx serve .

# Hoặc dùng Python 3
python3 -m http.server 8000
```
Sau đó truy cập: `http://localhost:8000` (hoặc cổng tương ứng).

---

## 📂 5. Cấu trúc thư mục dự án

```text
gravity-cat-fish/
├── index.html                                   # Giao diện chính, HUD, Shop Modal & Screen overlays
├── style.css                                    # Thiết kế giao diện pastel, glassmorphism & animation
├── game.js                                      # Game Engine, vật lý, đồ họa Canvas 2D, âm thanh & logic
├── game_design_document_gravity_cat_fish_chase.md # Tài liệu thiết kế chi tiết tựa game (GDD)
├── asset-prompts.md                             # Hướng dẫn tạo tài nguyên hình ảnh với AI prompts
├── assets/                                      # Thư mục chứa hình ảnh sprites (tùy chọn)
└── README.md                                    # Tài liệu hướng dẫn dự án
```

---

## 🎨 6. Tùy biến hình ảnh (Assets)

Game được trang bị sẵn **Bộ kết xuất Vector Canvas 2D** nên hiển thị sắc nét và hoạt động hoàn chỉnh ngay cả khi thư mục `assets/` đang trống.

Nếu bạn muốn thay thế bằng hình ảnh sprite vẽ tay hoặc AI generate:
1. Xem hướng dẫn và bộ prompt chuẩn hóa tại file [`asset-prompts.md`](./asset-prompts.md).
2. Lưu các file ảnh PNG (nền trong suốt) vào thư mục `assets/` theo đúng danh sách tên định sẵn (`cat-run-1.png`, `fish.png`, `obstacle-cactus.png`,...).
3. Tải lại trang, game sẽ tự động ưu tiên nạp các sprite ảnh mới!

---

*Chúc bạn có những giây phút thư giãn vui vẻ cùng chú Mèo Cam trong Gravity Cat: Fish Chase! 🐱✨*
