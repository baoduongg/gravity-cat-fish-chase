# Gravity Cat: Fish Chase — Asset Generation Prompts

Đính kèm 3 ảnh mockup gốc (`Gemini_Generated_Image_*.png`) làm reference cho mỗi lần generate, để giữ đồng bộ nhân vật/tông màu.

Copy khối **Style anchor** bên dưới vào cuối MỌI prompt.

## Style anchor (thêm vào cuối mọi prompt)

```
Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

---

## 1. `assets/cat-idle.png`

```
Cute chubby orange tabby cat character, sitting/standing idle pose, side view facing right, wearing small brown aviator goggles pushed up on its head and a red collar with a gold bell, big round friendly eyes, fluffy striped tail curled beside it.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 2. `assets/cat-run-1.png`

```
Same orange tabby cat character (brown aviator goggles on head, red collar with gold bell), dynamic running pose mid-stride — front paw reaching forward off the ground, back paw pushing off behind, body leaning slightly forward, tail trailing back for motion, side view facing right.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 3. `assets/cat-run-2.png`

```
Same orange tabby cat character (brown aviator goggles on head, red collar with gold bell), running pose — opposite stride from a front-paw-forward pose, i.e. back paw now reaching forward and front paw pushing off behind, same body lean and trailing tail, side view facing right, second frame of a 2-frame run cycle.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 4. `assets/cat-jump.png`

```
Same orange tabby cat character (brown aviator goggles on head, red collar with gold bell), mid-air jumping pose — all four legs tucked up under the body, tail curved upward, excited open-mouth expression, slight upward motion lines optional, side view facing right.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 5. `assets/cat-fall.png`

```
Same orange tabby cat character (brown aviator goggles on head, red collar with gold bell), mid-air falling/descending pose — legs stretched down reaching toward the ground, ears back, slightly worried wide-eyed expression, tail up for balance, side view facing right.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 6. `assets/cat-hurt.png`

```
Same orange tabby cat character (brown aviator goggles on head, red collar with gold bell), sad defeated pose after losing — sitting slumped forward, ears drooped, small dizzy swirl or teardrop near the eyes, tail limp on the ground, side view facing right, matching the mood of a "game over" screen.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 7. `assets/fish.png`

```
Small cute golden fish collectible icon, side view, pastel orange-to-yellow gradient body, one big round cute eye, simple fin and tail details, tiny sparkle accent optional, flat 2D game collectible icon.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 8. `assets/paw.png`

```
Cute pink cat paw-print icon, one large central pad plus four small toe pads, flat 2D game collectible icon, pastel pink with soft outline.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 9. `assets/obstacle-fishbone.png`

```
Large cartoon fish skeleton obstacle — a curved spine with rib bones and a fish head/tail at the ends, cream-white bone color with soft pastel shading, clearly readable ground-level game obstacle silhouette, side view.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 10. `assets/obstacle-cactus.png`

```
Cute cluster of two rounded cartoon cactus plants growing together, pastel green with lighter green highlight stripes, small friendly rounded thorns (not scary), clearly readable ground-level game obstacle silhouette, side view.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 11. `assets/obstacle-bird.png`

```
Small cute cartoon flying bird, pastel blue body with lighter blue belly, wings mid-flap spread wide, small orange beak, side view facing LEFT (flies toward the player who runs right-to-left relative to it), simple round cute eye.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 12. `assets/obstacle-yarn.png`

```
Cute rolled-up ball of pink/magenta knitting yarn obstacle, pastel color with soft fuzzy thread texture and a small loose thread tail curling out, clearly readable obstacle silhouette, side view.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, square 512x512 canvas, no drop shadow, no text, no watermark.
```

## 13. `assets/platform.png`

```
Cute floating 2D game platform piece, rounded pastel light-brown wooden log or soft stone slab with lush green grass and tiny flowers on top, modular side-scrolling platform asset, side view.

Art style: pastel flat cel-shaded 2D mobile game asset, soft thick outline, warm cartoon lighting, matching the attached reference screenshots exactly. Transparent background (PNG), object centered with padding, 512x256 canvas, no drop shadow, no text, no watermark.
```

---

Paste đúng các tên file trên vào `assets/` — code game đã wire sẵn, mở lại `index.html` là thấy ngay, không cần sửa gì thêm. Game cũng tích hợp sẵn bộ Vector Fallback siêu nét giúp chơi mượt mà ngay cả khi chưa có ảnh ngoài!

