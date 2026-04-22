// Danh sách 63 tỉnh thành phố Việt Nam (trước sáp nhập) + trung ương
// Tọa độ trung tâm hành chính của mỗi tỉnh/thành phố

export interface Province {
  code: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
}

export const REGIONS = [
  'Đông Bắc Bộ',
  'Tây Bắc Bộ',
  'Đồng bằng sông Hồng',
  'Bắc Trung Bộ',
  'Duyên hải Nam Trung Bộ',
  'Tây Nguyên',
  'Đông Nam Bộ',
  'Đồng bằng sông Cửu Long',
] as const;

export const PROVINCES: Province[] = [
  // Đồng bằng sông Hồng
  { code: 'hanoi', name: 'Hà Nội', lat: 21.0285, lng: 105.8542, region: 'Đồng bằng sông Hồng' },
  { code: 'hcm', name: 'TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009, region: 'Đông Nam Bộ' },
  { code: 'haiphong', name: 'Hải Phòng', lat: 20.8449, lng: 106.6881, region: 'Đồng bằng sông Hồng' },
  { code: 'danang', name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'cantho', name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, region: 'Đồng bằng sông Cửu Long' },

  // Đông Bắc Bộ
  { code: 'hagiang', name: 'Hà Giang', lat: 22.8233, lng: 104.9840, region: 'Đông Bắc Bộ' },
  { code: 'caobang', name: 'Cao Bằng', lat: 22.6666, lng: 106.2522, region: 'Đông Bắc Bộ' },
  { code: 'backan', name: 'Bắc Kạn', lat: 22.1473, lng: 105.8348, region: 'Đông Bắc Bộ' },
  { code: 'tuyenquang', name: 'Tuyên Quang', lat: 21.8233, lng: 105.2181, region: 'Đông Bắc Bộ' },
  { code: 'laocai', name: 'Lào Cai', lat: 22.4856, lng: 103.9707, region: 'Đông Bắc Bộ' },
  { code: 'langson', name: 'Lạng Sơn', lat: 21.8460, lng: 106.7610, region: 'Đông Bắc Bộ' },
  { code: 'quangninh', name: 'Quảng Ninh', lat: 21.0064, lng: 107.2925, region: 'Đông Bắc Bộ' },
  { code: 'bacgiang', name: 'Bắc Giang', lat: 21.2730, lng: 106.1946, region: 'Đông Bắc Bộ' },
  { code: 'phutho', name: 'Phú Thọ', lat: 21.4227, lng: 105.2297, region: 'Đông Bắc Bộ' },
  { code: 'thainguyen', name: 'Thái Nguyên', lat: 21.5928, lng: 105.8442, region: 'Đông Bắc Bộ' },

  // Tây Bắc Bộ
  { code: 'yenbai', name: 'Yên Bái', lat: 21.7168, lng: 104.8986, region: 'Tây Bắc Bộ' },
  { code: 'dienbien', name: 'Điện Biên', lat: 21.3860, lng: 103.0230, region: 'Tây Bắc Bộ' },
  { code: 'laichau', name: 'Lai Châu', lat: 22.3964, lng: 103.4581, region: 'Tây Bắc Bộ' },
  { code: 'sonla', name: 'Sơn La', lat: 21.3270, lng: 103.9188, region: 'Tây Bắc Bộ' },
  { code: 'hoabinh', name: 'Hòa Bình', lat: 20.8171, lng: 105.3382, region: 'Tây Bắc Bộ' },

  // Đồng bằng sông Hồng (tiếp)
  { code: 'vinhphuc', name: 'Vĩnh Phúc', lat: 21.3089, lng: 105.6047, region: 'Đồng bằng sông Hồng' },
  { code: 'bacninh', name: 'Bắc Ninh', lat: 21.1861, lng: 106.0763, region: 'Đồng bằng sông Hồng' },
  { code: 'haiduong', name: 'Hải Dương', lat: 20.9402, lng: 106.3156, region: 'Đồng bằng sông Hồng' },
  { code: 'hungyen', name: 'Hưng Yên', lat: 20.6464, lng: 106.0511, region: 'Đồng bằng sông Hồng' },
  { code: 'hanam', name: 'Hà Nam', lat: 20.5835, lng: 105.9230, region: 'Đồng bằng sông Hồng' },
  { code: 'namdinh', name: 'Nam Định', lat: 20.4388, lng: 106.1621, region: 'Đồng bằng sông Hồng' },
  { code: 'thaibinh', name: 'Thái Bình', lat: 20.4463, lng: 106.3365, region: 'Đồng bằng sông Hồng' },
  { code: 'ninhbinh', name: 'Ninh Bình', lat: 20.2506, lng: 105.9745, region: 'Đồng bằng sông Hồng' },

  // Bắc Trung Bộ
  { code: 'thanhhoa', name: 'Thanh Hóa', lat: 19.8067, lng: 105.7852, region: 'Bắc Trung Bộ' },
  { code: 'nghean', name: 'Nghệ An', lat: 18.6737, lng: 105.6922, region: 'Bắc Trung Bộ' },
  { code: 'hatinh', name: 'Hà Tĩnh', lat: 18.3559, lng: 105.8877, region: 'Bắc Trung Bộ' },
  { code: 'quangbinh', name: 'Quảng Bình', lat: 17.4690, lng: 106.6222, region: 'Bắc Trung Bộ' },
  { code: 'quangtri', name: 'Quảng Trị', lat: 16.7516, lng: 107.1856, region: 'Bắc Trung Bộ' },
  { code: 'thuathienhue', name: 'Thừa Thiên Huế', lat: 16.4637, lng: 107.5909, region: 'Bắc Trung Bộ' },

  // Duyên hải Nam Trung Bộ
  { code: 'quangnam', name: 'Quảng Nam', lat: 15.5394, lng: 108.0191, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'quangngai', name: 'Quảng Ngãi', lat: 15.1214, lng: 108.8044, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'binhdinh', name: 'Bình Định', lat: 13.7765, lng: 109.2237, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'phuyen', name: 'Phú Yên', lat: 13.0882, lng: 109.0929, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'khanhhoa', name: 'Khánh Hòa', lat: 12.2388, lng: 109.1967, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'ninhthuan', name: 'Ninh Thuận', lat: 11.5752, lng: 108.9890, region: 'Duyên hải Nam Trung Bộ' },
  { code: 'binhthuan', name: 'Bình Thuận', lat: 10.9282, lng: 108.1022, region: 'Duyên hải Nam Trung Bộ' },

  // Tây Nguyên
  { code: 'kontum', name: 'Kon Tum', lat: 14.3498, lng: 108.0005, region: 'Tây Nguyên' },
  { code: 'gialai', name: 'Gia Lai', lat: 13.9832, lng: 108.0026, region: 'Tây Nguyên' },
  { code: 'daklak', name: 'Đắk Lắk', lat: 12.7100, lng: 108.2378, region: 'Tây Nguyên' },
  { code: 'daknong', name: 'Đắk Nông', lat: 12.0044, lng: 107.6878, region: 'Tây Nguyên' },
  { code: 'lamdong', name: 'Lâm Đồng', lat: 11.9404, lng: 108.4583, region: 'Tây Nguyên' },

  // Đông Nam Bộ
  { code: 'binhphuoc', name: 'Bình Phước', lat: 11.7512, lng: 106.7234, region: 'Đông Nam Bộ' },
  { code: 'tayninh', name: 'Tây Ninh', lat: 11.3352, lng: 106.1099, region: 'Đông Nam Bộ' },
  { code: 'binhduong', name: 'Bình Dương', lat: 11.3254, lng: 106.4770, region: 'Đông Nam Bộ' },
  { code: 'dongnai', name: 'Đồng Nai', lat: 10.9453, lng: 106.8244, region: 'Đông Nam Bộ' },
  { code: 'brvt', name: 'Bà Rịa - Vũng Tàu', lat: 10.5417, lng: 107.2430, region: 'Đông Nam Bộ' },

  // Đồng bằng sông Cửu Long
  { code: 'longan', name: 'Long An', lat: 10.5360, lng: 106.4054, region: 'Đồng bằng sông Cửu Long' },
  { code: 'tiengiang', name: 'Tiền Giang', lat: 10.4493, lng: 106.3421, region: 'Đồng bằng sông Cửu Long' },
  { code: 'bentre', name: 'Bến Tre', lat: 10.2434, lng: 106.3756, region: 'Đồng bằng sông Cửu Long' },
  { code: 'travinh', name: 'Trà Vinh', lat: 9.9347, lng: 106.3455, region: 'Đồng bằng sông Cửu Long' },
  { code: 'vinhlong', name: 'Vĩnh Long', lat: 10.2538, lng: 105.9722, region: 'Đồng bằng sông Cửu Long' },
  { code: 'dongthap', name: 'Đồng Tháp', lat: 10.4938, lng: 105.6882, region: 'Đồng bằng sông Cửu Long' },
  { code: 'angiang', name: 'An Giang', lat: 10.5216, lng: 105.1259, region: 'Đồng bằng sông Cửu Long' },
  { code: 'kiengiang', name: 'Kiên Giang', lat: 10.0125, lng: 105.0809, region: 'Đồng bằng sông Cửu Long' },
  { code: 'haugiang', name: 'Hậu Giang', lat: 9.7579, lng: 105.6413, region: 'Đồng bằng sông Cửu Long' },
  { code: 'soctrang', name: 'Sóc Trăng', lat: 9.6037, lng: 105.9800, region: 'Đồng bằng sông Cửu Long' },
  { code: 'baclieu', name: 'Bạc Liêu', lat: 9.2941, lng: 105.7216, region: 'Đồng bằng sông Cửu Long' },
  { code: 'camau', name: 'Cà Mau', lat: 9.1527, lng: 105.1961, region: 'Đồng bằng sông Cửu Long' },
];

// Các thành phố lớn hiển thị ưu tiên ở đầu danh sách
export const MAJOR_CITIES = ['hanoi', 'hcm', 'danang', 'haiphong', 'cantho'];

export function getProvinceByCode(code: string): Province | undefined {
  return PROVINCES.find((p) => p.code === code);
}
