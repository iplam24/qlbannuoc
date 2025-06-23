DROP DATABASE IF EXISTS quan_ly_quan_nuoc;

CREATE DATABASE quan_ly_quan_nuoc;

USE quan_ly_quan_nuoc;

-- Bảng vai trò
CREATE TABLE vai_tro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_vai_tro VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

CREATE TABLE nguoi_dung (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_tai_khoan VARCHAR(12) NOT NULL,
    mat_khau VARCHAR(100) CHARACTER SET utf8mb4,
    so_dien_thoai VARCHAR(15),
    ho_ten VARCHAR(100) CHARACTER SET utf8mb4,
    email VARCHAR(100),
    id_vai_tro INT,
    img VARCHAR(255),
    da_xoa int DEFAULT 0,
    FOREIGN KEY (id_vai_tro) REFERENCES vai_tro (id)
);


CREATE TABLE dia_chi_nhan_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nguoi_dung INT NOT NULL,
    dia_chi TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    so_dien_thoai VARCHAR(15),
    nguoi_nhan VARCHAR(100) CHARACTER SET utf8mb4,
    mac_dinh BOOLEAN DEFAULT FALSE,
    da_xoa int DEFAULT 0,
    FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id)
);


-- Bảng sản phẩm (đồ uống)
CREATE TABLE san_pham (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_san_pham NVARCHAR (255),
    gia DECIMAL(10, 2),
    luot_ban INT,
    img VARCHAR(255),
    da_xoa int DEFAULT 0
);

-- Bảng trạng thái đơn hàng (để quản lý các trạng thái một cách linh hoạt hơn)
CREATE TABLE trang_thai_don_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ten_trang_thai VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
);

-- Chèn các trạng thái mẫu
INSERT INTO
    trang_thai_don_hang (ten_trang_thai)
VALUES ('Đang chờ xác nhận'),
    ('Đang xử lý'),
    ('Giao hàng thành công'),
    ('Hoàn thành'),
    ('Đã hủy');

---
CREATE TABLE don_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nguoi_dung INT NOT NULL,
    id_dia_chi_nhan_hang INT,
    ngay_dat_hang DATETIME DEFAULT CURRENT_TIMESTAMP,
    tong_tien DECIMAL(10, 2) NOT NULL,
    id_trang_thai INT NOT NULL,
    ngay_cap_nhat_trang_thai DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ghi_chu TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung (id),
    FOREIGN KEY (id_trang_thai) REFERENCES trang_thai_don_hang (id),
    FOREIGN KEY (id_dia_chi_nhan_hang) REFERENCES dia_chi_nhan_hang(id)
);

---

-- Bảng chi tiết đơn hàng (liên kết sản phẩm với đơn hàng cụ thể)
CREATE TABLE chi_tiet_don_hang (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính riêng biệt cho từng dòng chi tiết
    id_don_hang INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_luong INT NOT NULL, -- Số lượng sản phẩm trong đơn hàng này
    gia_tai_thoi_diem_dat DECIMAL(10, 2) NOT NULL, -- Giá của sản phẩm tại thời điểm đặt hàng (quan trọng để lịch sử giá không bị thay đổi)
    FOREIGN KEY (id_don_hang) REFERENCES don_hang (id),
    FOREIGN KEY (id_san_pham) REFERENCES san_pham (id),
    UNIQUE (id_don_hang, id_san_pham) -- Đảm bảo mỗi sản phẩm chỉ xuất hiện một lần trong mỗi đơn hàng
);

---

-- Bảng thống kê doanh thu theo ngày
CREATE TABLE thong_ke_doanh_thu_ngay (
    ngay DATE PRIMARY KEY, -- Ngày thống kê
    doanh_thu DECIMAL(15, 2) DEFAULT 0.00, -- Tổng doanh thu trong ngày
    so_luong_don_hang_hoan_thanh INT DEFAULT 0 -- Số lượng đơn hàng hoàn thành trong ngày
);

-- Bảng giỏ hàng
CREATE TABLE gio_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_nguoi_dung INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_luong INT NOT NULL DEFAULT 1,
    ngay_them DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id),
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    UNIQUE (id_nguoi_dung, id_san_pham)
);


-- Vai trò mẫu
INSERT INTO
    vai_tro (ten_vai_tro)
VALUES ('Admin'),
    ('Nhân viên'),
    ('Khách hàng');

-- Người dùng mẫu
INSERT INTO
    nguoi_dung (
        ten_tai_khoan,
        mat_khau,
        so_dien_thoai,
        ho_ten,
        email,
        id_vai_tro,
        img
    )
VALUES (
        'admin',
        '$2b$10$DbRawLLUOLUHzv5eurbKYenDAuUc12tiyoq1lLaZdGgo/SPfQqROO',
        '0987654321',
        'Nguyễn Văn A',
        'admin01@example.com',
        1,
        'https://www.w3schools.com/w3images/avatar2.png'
    );

-- Sản phẩm mẫu
INSERT INTO
    san_pham (
        ten_san_pham,
        gia,
        luot_ban,
        img
    )
VALUES (
        'Trà sữa truyền thống',
        25000,
        100,
        '/upload/1.jpg'
    );