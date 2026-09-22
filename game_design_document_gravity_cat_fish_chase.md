# 🐱 GRAVITY CAT: FISH CHASE — GAME DESIGN DOCUMENT (GDD)

---

## 📌 1. TỔNG QUAN TỰA GAME (GAME OVERVIEW)

* **Tên trò chơi:** Gravity Cat: Fish Chase
* **Thể loại:** Side-scrolling 2D Platformer, Endless Runner, Precision Jump, Web Game.
* **Nền tảng mục tiêu:** Trình duyệt Web (PC, Tablet, Mobile) - Chơi trực tiếp không cần cài đặt.
* **Định dạng đồ họa:** 2D Cartoon / Pastel Art Style.
* **Đối tượng người chơi:** Mọi lứa tuổi (Casual Gamers), đặc biệt là những người yêu thích động vật/mèo và game platformer vui nhộn.
* **Thông điệp cốt lõi:** Lối chơi cuộn cảnh mượt mà, kết hợp linh hoạt giữa di chuyển vị trí và căn nhịp nhảy chuẩn xác, tạo cảm giác phiêu lưu cuốn hút.

---

## 🎮 2. CƠ CHẾ LỐI CHƠI (CORE GAMEPLAY MECHANICS)

### 2.1. Thao tác điều khiển (Platformer Controls)
* **Trên PC:**
  * **Di chuyển Trái / Phải:** Phím **[A] / [D]** hoặc **[←] / [→]** (Cho phép mèo tiến lên trước đón cá hoặc lùi lại để căn góc nhảy).
  * **Nhảy / Nhảy đôi (Jump / Double Jump):** Phím **[SPACE]**, **[W]** hoặc **[↑]**.
* **Trên Mobile / Tablet:**
  * Cụm nút ảo **[◀] [▶]** góc trái để di chuyển.
  * Nút ảo **[▲]** (hoặc chạm nửa màn hình phải) để nhảy / nhảy đôi.

### 2.2. Cơ chế Cuộn cảnh & Không gian (Side-Scrolling & Platforms)
* **Bản đồ cuộn ngang (Side-scrolling):** Màn chơi liên tục cuộn từ phải sang trái với tốc độ tăng dần theo thời gian.
* **Hệ thống Địa hình & Bục nhảy (Platforms):**
  * **Mặt đất (Ground):** Thảm cỏ chạy dài với các bẫy gai, vũng nước, xương cá.
  * **Bục lơ lửng (Floating Platforms):** Bậc đá pastel, cành cây, đám mây bồng bềnh ở nhiều độ cao khác nhau để mèo nhảy lên né bẫy và ăn cá trên cao.
* **Độ tự do di chuyển:** Mèo có thể điều chỉnh vị trí linh hoạt theo chiều ngang (trong phạm vi màn hình) để né tránh chướng ngại vật rơi xuống hoặc chọn bục đáp an toàn.

### 2.3. Vòng lặp Gameplay (Game Loop)
```
[ Bắt đầu nhanh (1s) ] ➔ [ Chạy, Nhảy bục & Ăn cá ] ➔ [ Di chuyển né bẫy ] ➔ [ Tốc độ cuộn tăng dần ] ➔ [ Va chạm / Rơi / Thua ] ➔ [ Chơi lại tức thì ]
```

### 2.4. Chướng ngại vật & Thu thập
* **Vật phẩm thu thập (Collectibles):**
  * **Cá vàng (Fish):** Cộng điểm cơ bản và tích trữ mua vật phẩm.
  * **Dấu chân mèo (Paw Prints):** Xuất hiện theo chuỗi uốn lượn trên các bục nhảy.
  * **Cơ chế Combo:** Ăn liên tục các chuỗi cá/dấu chân mà không bỏ lỡ để kích hoạt **Combo Multiplier (x2, x3, x5 điểm)**.
* **Chướng ngại vật & Cạm bẫy (Obstacles):**
  * **Dưới đất / Trên bục:** Bộ xương cá, bụi gai xương rồng, bẫy dại.
  * **Trên không & Chuyển động:** Chim nhỏ bay ngược chiều, quả cầu len lăn tới, hạt sồi rơi.

---

## 🔥 3. YẾU TỐ TẠO ĐỘ GÂY NGHIỆM & GIỮ CHÂN NGƯỜI CHƠI (HOOK & RETENTION)

1. **Hiệu ứng "Near-Miss" (Né sát nút):**
   * Khi Mèo nhảy vượt chướng ngại vật ở khoảng cách siêu gần (chỉ vài pixel), game kích hoạt hiệu ứng quay chậm (*Slow-motion*) 0.3s kèm âm thanh *"Meow!"* hào hứng.
2. **Instant Restart (Tái đấu tức thì):**
   * Không có màn hình chờ hay chuyển cảnh dài dòng. Khi thua, hiệu ứng biến mất đáng yêu xuất hiện và chỉ mất 0.5s để người chơi nhấn phím bắt đầu lượt mới.
3. **Thử thách theo tốc độ (Escalation):**
   * Tốc độ di chuyển tăng dần theo thời gian.
   * Càng về sau, khoảng cách giữa các chướng ngại vật càng hẹp, đòi hỏi người chơi nhập tâm hoàn toàn (Flow State).
4. **Hệ thống cá nhân hóa & Mở khóa (Cosmetics Shop):**
   * Dùng tổng số cá thu thập được để mở khóa:
     * **Skin Mèo:** Mèo Đen, Mèo Tam Thể, Mèo Hoàng Gia, Mèo Bánh Mì...
     * **Hiệu ứng vệt chạy (Trail Effect):** Vệt Cầu Vồng, Vệt Bong Bóng, Vệt Trái Tim.

---

## 🎨 4. PHONG CÁCH HÌNH ẢNH & ÂM THANH (ART & AUDIO)

### 4.1. Visual Style
* **Màu sắc:** Tông màu Pastel tươi sáng, ấm áp (Vàng nắng, Xanh lá mạ, Hồng nhạt, Xanh mây).
* **Bối cảnh:** Rừng cây thần tiên đầy mộng mơ với các chi tiết ngộ nghĩnh như nhà mèo, cuộn len, mây hình dấu chân.
* **Giao diện (UI):** Tối giản, nét chữ mượt mà, dễ nhìn trên mọi kích thước màn hình.

### 4.2. Audio Design
* **Nhạc nền (BGM):** Giai điệu Bossa Nova / Chiptune Lofi vui tươi, nhịp điệu nhanh dần theo tiến trình chơi nhưng không gây ức chế.
* **Sound Effects (SFX):**
  * Tiếng *"Boing"* / *"Hop"* khi nhảy và nhảy đôi.
  * Tiếng *"Chomp"* giòn tan khi ăn cá vàng.
  * Tiếng *"Meow~"* đáng yêu khi đạt combo cao hoặc né sát nút.

---

## 🛠️ 5. YÊU CẦU KỸ THUẬT (TECHNICAL SPECIFICATIONS)

* **Game Engine khuyến nghị:** Phaser.js v3 (hoặc PixiJS) — Tối ưu hóa cực tốt cho HTML5 Canvas 2D.
* **Tỷ lệ màn hình:** Responsive Layout (16:9 cho PC, tự động scale phù hợp cho màn hình dọc Mobile).
* **Dung lượng Target:** < 8 MB (đảm bảo tải trang dưới 2 giây trên mạng 4G/Wifi).
* **Lưu trữ dữ liệu:** Lưu `High Score` và `Tổng số Cá` vào `LocalStorage` của trình duyệt.