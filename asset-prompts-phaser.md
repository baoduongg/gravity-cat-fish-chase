# Gravity Cat: Fish Chase — Prompt tạo ảnh (bản Phaser)

Mỗi prompt bên dưới là **một khối hoàn chỉnh, độc lập** — copy nguyên khối, paste thẳng vào công cụ tạo ảnh (Midjourney, DALL-E, Gemini, v.v.), không cần ghép thêm gì.

Tên file/đường dẫn ghi ngay phía trên mỗi prompt — đặt đúng tên đó khi lưu ảnh.

## Về nền màu chroma-key

Tất cả prompt đều yêu cầu **nền màu magenta thuần `#FF00FF`** (thay vì nền
trong suốt) — vì nhiều công cụ AI tạo ảnh làm nền "trong suốt" không sạch
(viền răng cưa, còn sót viền mờ). Dùng nền màu chroma-key giúp việc tách
nền bằng công cụ chuyên dụng (remove.bg, Photoshop's Select Color Range,
GIMP's Fuzzy Select...) cho kết quả sắc nét hơn nhiều.

Đã chọn màu **magenta** (không phải xanh lá — lựa chọn chroma-key phổ biến
hơn) vì trong bộ prompt này có vài vật thể màu xanh lá thật (bụi xương
rồng, nút Play màu xanh lá) — nếu dùng nền xanh lá sẽ bị xung đột, tool
tách nền có thể ăn luôn vào phần xanh của vật thể. Không có vật thể nào
trong bộ này dùng màu magenta thuần, chỉ có tông hồng nhạt/pastel nên an
toàn.

**Sau khi tạo ảnh xong, trước khi paste vào `assets/`:** dùng công cụ tách
nền (remove.bg, hoặc chọn màu `#FF00FF` bằng công cụ Magic Wand/Select by
Color rồi xóa) để loại bỏ nền magenta, xuất lại thành PNG nền trong suốt
thật sự, rồi mới đặt vào đúng thư mục.

---

## 1. Nhân vật mèo — 6 skin × 6 pose = 36 ảnh

### Skin `orange` — Mèo Cam Béo (mặc định)

`assets/cat/orange/idle.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/orange/run-1.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/orange/run-2.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/orange/jump.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/orange/fall.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/orange/hurt.png`
```
Cute chubby orange tabby cat character, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

### Skin `black` — Mèo Đen Ninja

`assets/cat/black/idle.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/black/run-1.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/black/run-2.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/black/jump.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/black/fall.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/black/hurt.png`
```
Cute chubby black cat character (ninja-styled), wearing small brown aviator goggles pushed up on its head and a hot-pink collar with a gold bell, big round friendly eyes, fluffy black tail, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

### Skin `calico` — Mèo Tam Thể

`assets/cat/calico/idle.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/calico/run-1.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/calico/run-2.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/calico/jump.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/calico/fall.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/calico/hurt.png`
```
Cute chubby calico (tri-color: cream, orange, black patches) cat character, wearing small brown aviator goggles pushed up on its head and an orange collar with a gold bell, big round friendly eyes, fluffy tri-color tail, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

### Skin `royal` — Mèo Hoàng Gia

`assets/cat/royal/idle.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/royal/run-1.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/royal/run-2.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/royal/jump.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/royal/fall.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/royal/hurt.png`
```
Cute chubby golden-yellow cat character wearing a small sparkling gold crown on its head instead of goggles, and a purple velvet collar with a gold bell, big round friendly eyes, fluffy golden tail, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

### Skin `bread` — Mèo Bánh Mì

`assets/cat/bread/idle.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/bread/run-1.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/bread/run-2.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/bread/jump.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/bread/fall.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/bread/hurt.png`
```
Cute chubby cat character shaped like a golden-brown loaf of bread (bread-loaf body texture and color), small brown aviator goggles pushed up on its head, red collar with gold bell, big round friendly eyes, tiny fluffy tail poking out from the bread body, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

### Skin `space` — Mèo Phi Hành

`assets/cat/space/idle.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, sitting/standing idle pose, tail curled beside it. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/space/run-1.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, dynamic running pose mid-stride, front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/space/run-2.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, running pose, opposite stride from a front-paw-forward pose (back paw reaching forward, front paw pushing off behind), same body lean and trailing tail, second frame of a 2-frame run cycle. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/space/jump.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, mid-air jumping pose, all four legs tucked up under the body, tail curved upward, excited open-mouth expression. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/space/fall.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, mid-air falling/descending pose, legs stretched down toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/cat/space/hurt.png`
```
Cute chubby light-blue cat character wearing a small round transparent astronaut helmet instead of goggles, and a silver collar with a gold bell, big round friendly eyes, fluffy tail, side view facing right, sad defeated pose after losing, sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## 2. Vật phẩm thu thập

`assets/fish.png`
```
Small cute golden fish collectible icon, side view, pastel orange-to-yellow gradient body, one big round cute eye, simple fin and tail details, tiny sparkle accent optional, flat 2D game collectible icon. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/paw.png`
```
Cute pink cat paw-print icon, one large central pad plus four small toe pads, flat 2D game collectible icon, pastel pink with soft outline. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## 3. Vật cản

`assets/obstacle-fishbone.png`
```
Large cartoon fish skeleton obstacle — a curved spine with rib bones and a fish head/tail at the ends, cream-white bone color with soft pastel shading, clearly readable ground-level game obstacle silhouette, side view. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/obstacle-cactus.png`
```
Cute cluster of two rounded cartoon cactus plants growing together, pastel green with lighter green highlight stripes, small friendly rounded thorns (not scary), clearly readable ground-level game obstacle silhouette, side view. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/obstacle-bird.png`
```
Small cute cartoon flying bird, pastel blue body with lighter blue belly, wings mid-flap spread wide, small orange beak, side view facing LEFT (flies toward the player), simple round cute eye. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/obstacle-yarn.png`
```
Cute rolled-up ball of pastel pink knitting yarn obstacle, soft fuzzy thread texture and a small loose thread tail curling out, clearly readable obstacle silhouette, side view. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## 4. Bục nhảy

`assets/platform.png` — **canvas 512x256** (chữ nhật, không phải vuông)
```
Cute floating 2D game platform piece, rounded pastel light-brown wooden log or soft stone slab with lush green grass and tiny flowers on top, modular side-scrolling platform asset, side view. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, 512x256 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## 5. Hiệu ứng vệt chạy (Trail)

`assets/trails/wind.png`
```
Simple soft white wind streak/wisp shape, small particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/trails/rainbow.png`
```
Small simple rainbow-colored sparkle streak, particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/trails/bubble.png`
```
Small simple pastel soap bubble circle with a light shine highlight, particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/trails/heart.png`
```
Small simple pastel pink heart shape, particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/trails/star.png`
```
Small simple golden 4-point sparkle star shape, particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/trails/sakura.png`
```
Small simple pastel pink cherry blossom petal shape, particle icon for a game trail effect. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## 6. Giao diện (UI)

`assets/ui/btn-play.png`
```
Rounded pastel green 'play' button shape with a simple play triangle icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-retry.png`
```
Rounded pastel orange 'retry' button shape with a circular arrow/refresh icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-home.png`
```
Rounded pastel blue 'home' button shape with a simple house icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-shop.png`
```
Rounded pastel pink 'shop' button shape with a simple shopping bag icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-leaderboard.png`
```
Rounded pastel yellow 'leaderboard' button shape with a simple trophy icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-settings.png`
```
Rounded pastel gray 'settings' button shape with a simple gear icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-share.png` *(hiện chưa dùng trong UI, có thể bỏ qua)*
```
Rounded pastel purple 'share' button shape with a simple share/network icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/btn-close.png`
```
Small rounded pastel red 'close' button shape with a simple X icon, chunky cute cartoon UI button, no text. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, square 512x512 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/board-gameover.png` — **canvas 960x720** (tỉ lệ 4:3, không phải vuông)
```
Cute wooden signboard/plaque background panel, rounded corners, pastel brown wood texture with rope or hook details at top, large enough to hold a title and score text, no text baked in. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, 960x720 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/board-highscore.png` — **canvas 960x720** (tỉ lệ 4:3, không phải vuông)
```
Cute pastel pink rounded scoreboard panel background with a soft border, large enough to hold a list of rows, no text baked in. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, 960x720 canvas, no drop shadow cast by the object, no text, no watermark.
```

`assets/ui/plaque-wood.png` — **canvas 512x256** (chữ nhật, không phải vuông)
```
Small flat wooden plaque background shape, rounded rectangle, pastel wood texture, no text baked in. Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting. Solid flat chroma-key magenta background, color exactly #FF00FF, no gradient, no texture, no shadow on the background, object centered with padding, 512x256 canvas, no drop shadow cast by the object, no text, no watermark.
```

---

## Tổng kết số lượng ảnh cần tạo

| Nhóm | Số lượng |
|---|---|
| Mèo (6 skin × 6 pose) | 36 |
| Vật phẩm thu thập | 2 |
| Vật cản | 4 |
| Bục nhảy | 1 |
| Trail particle | 6 |
| UI | 11 |
| **Tổng** | **60** |

## Sau khi có ảnh

1. Đặt đúng tên file, đúng thư mục như trên vào thư mục `assets/` của dự án
   (tự tạo các thư mục con `assets/cat/<skin>/`, `assets/trails/`, `assets/ui/`
   nếu chưa có).
2. Báo lại cho tôi — tôi sẽ sửa `src/scenes/BootScene.js` để `load.image(...)`
   các file thật này thay vì gọi `generateTexture()` vẽ bằng code. Mọi scene
   khác chỉ tham chiếu texture theo **tên key** (`cat-orange-idle`, `fish`,
   `ui-btn-play`...), không phụ thuộc cách texture được tạo ra, nên không
   cần sửa gì thêm ở phần còn lại của game.
