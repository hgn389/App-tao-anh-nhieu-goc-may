export interface SamplePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'sample-1',
    name: 'Chân dung Doanh nhân (Nam)',
    description: 'Âu phục lịch lãm, ánh sáng studio sang trọng',
    category: 'Doanh nhân',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-2',
    name: 'Người mẫu Thời trang (Nữ)',
    description: 'Chân dung tự nhiên, ánh sáng mềm, tóc dài buông',
    category: 'Thời trang',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-3',
    name: 'Phong cách Điện ảnh (Nam)',
    description: 'Ánh sáng tương phản cao dramatic, góc nghiêng điện ảnh',
    category: 'Điện ảnh',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-4',
    name: 'Phong cách Tối giản (Nữ)',
    description: 'Phông nền studio trung tính, nét mặt rõ ràng',
    category: 'Studio',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
];

export const LENS_OPTIONS = [
  { value: '14mm', label: '14mm (Siêu rộng - Dramatic Perspective)' },
  { value: '24mm', label: '24mm (Góc rộng - Môi trường)' },
  { value: '35mm', label: '35mm (Tiêu chuẩn Điện ảnh Cinematic)' },
  { value: '50mm', label: '50mm (Chuẩn mắt nhìn tự nhiên)' },
  { value: '85mm', label: '85mm (Chân dung xóa phông cổ điển)' },
  { value: '135mm', label: '135mm (Tele chân dung nén hậu cảnh)' },
  { value: 'macro', label: 'Macro (Cận cảnh chi tiết mắt/khuôn mặt)' },
];

export const ANGLE_OPTIONS = [
  { value: 'front', label: 'Chính diện (Front 0°)', badge: '0°' },
  { value: 'left_34', label: 'Góc 3/4 Trái (Left 45°)', badge: '45° L' },
  { value: 'right_34', label: 'Góc 3/4 Phải (Right 45°)', badge: '45° R' },
  { value: 'left_profile', label: 'Nghiêng trái 90° (Left Profile)', badge: '90° L' },
  { value: 'right_profile', label: 'Nghiêng phải 90° (Right Profile)', badge: '90° R' },
  { value: 'back', label: 'Từ phía sau lưng (Back 180°)', badge: '180°' },
  { value: 'ots', label: 'Over-The-Shoulder (Qua vai)', badge: 'OTS' },
  { value: 'low_angle', label: 'Góc thấp (Low angle ngước lên)', badge: 'LOW' },
  { value: 'high_angle', label: 'Góc cao (High angle nhìn xuống)', badge: 'HIGH' },
  { value: 'top_down', label: 'Từ trên đỉnh đầu (Top-down)', badge: 'TOP' },
  { value: 'worms_eye', label: 'Worm’s-eye (Sát mặt đất)', badge: 'WORM' },
  { value: 'dutch_tilt', label: 'Dutch Tilt (Góc nghiêng máy nghệ thuật)', badge: 'TILT' },
  { value: 'orbit_3d', label: 'Orbit 3D (Đa hướng xoay vòng)', badge: '3D' },
  { value: 'turnaround', label: 'Turnaround Sheet (Trọn bộ 5 góc chuẩn)', badge: 'SHEET' },
];

export const COLOR_STYLES = [
  { value: 'clean', label: 'Trong trẻo tự nhiên' },
  { value: 'realistic', label: 'Chân thực RAW' },
  { value: 'cinematic', label: 'Điện ảnh (Teal & Orange)' },
  { value: 'bright', label: 'Tươi sáng High-key' },
  { value: 'moody', label: 'Tối kịch tính Low-key' },
  { value: 'pastel', label: 'Pastel Hàn Quốc' },
  { value: 'cool', label: 'Tông lạnh Nordic' },
  { value: 'warm', label: 'Tông ấm Golden Hour' },
  { value: 'bw', label: 'Đen trắng Leica Monochrome' },
  { value: 'film_grain', label: 'Kodak Film Grain' },
];

export const BACKGROUNDS = [
  { value: 'auto', label: 'Auto (Hài hòa với góc chụp)' },
  { value: 'studio_lighting', label: 'Studio Ánh sáng chuyên nghiệp' },
  { value: 'grey_studio', label: 'Phông xám Studio tối giản' },
  { value: 'white_screen', label: 'Phông trắng vô cực (Seamless White)' },
  { value: 'green_screen', label: 'Phông xanh Green Screen (Keying)' },
  { value: 'outdoor', label: 'Ngoại cảnh công viên / Tự nhiên' },
  { value: 'street', label: 'Đường phố đô thị sầm uất' },
  { value: 'indoor', label: 'Nội thất phòng làm việc sang trọng' },
  { value: 'fantasy', label: 'Cổ phong / Huyền huyễn Fantasy' },
  { value: 'transparent', label: 'Tách nền trong suốt (Transparent)' },
];

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Vuông Instagram / Avatar)' },
  { value: '4:3', label: '4:3 (Chân dung tiêu chuẩn)' },
  { value: '3:4', label: '3:4 (Chân dung nghệ thuật)' },
  { value: '16:9', label: '16:9 (Ngang Điện ảnh / Youtube)' },
  { value: '9:16', label: '9:16 (Dọc TikTok / Reels / Stories)' },
  { value: '21:9', label: '21:9 (Siêu rộng Anamorphic)' },
];

export const RESOLUTIONS = [
  { value: 'hd', label: 'HD 1280×720 (Nhanh)' },
  { value: 'fhd', label: 'FHD 1920×1080 (Chuẩn)' },
  { value: '2k', label: '2K 2560×1440 (Chất lượng cao)' },
  { value: '4k', label: '4K Ultra HD (Sắc nét chi tiết)' },
];

export const QUICK_PROMPTS = [
  'Đổi sang góc chụp 3/4 trái nhìn thẳng vào ống kính',
  'Giữ nguyên biểu cảm, xoay góc nghiêng 90 độ sang phải',
  'Góc thấp ngước lên phong cách quyền lực doanh nhân',
  'Ánh sáng ven tóc rim-light điện ảnh sắc nét',
  'Turnaround 5 góc: trước, 3/4 trái, nghiêng trái, sau, 3/4 phải',
];