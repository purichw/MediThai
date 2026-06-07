-- Packages table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS packages (
  id             UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     TIMESTAMPTZ DEFAULT now(),
  name_th        TEXT    NOT NULL,
  name_en        TEXT,
  category       TEXT    NOT NULL CHECK (category IN ('checkup','cancer','heart','surgery','vaccine','bundle')),
  hospital       TEXT,
  hospital_key   TEXT,
  price          NUMERIC NOT NULL,
  original_price NUMERIC,
  gender         TEXT    DEFAULT 'all' CHECK (gender IN ('all','male','female')),
  age_group      TEXT    DEFAULT 'all' CHECK (age_group IN ('all','young','middle','senior')),
  description_th TEXT,
  items          TEXT[]  DEFAULT '{}',
  is_featured    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_public_read" ON packages FOR SELECT USING (is_active = true);

-- Seed: 12 representative packages
INSERT INTO packages (name_th, name_en, category, hospital, hospital_key, price, original_price, gender, age_group, description_th, items, is_featured) VALUES
('ตรวจสุขภาพประจำปี Essential', 'Annual Health Check – Essential', 'checkup', 'MediThai กรุงเทพ', 'bkk', 1990, 2800, 'all', 'all', 'ตรวจสุขภาพพื้นฐานครอบคลุม 30 รายการ เหมาะสำหรับทุกวัย', ARRAY['CBC ความสมบูรณ์เม็ดเลือด','ตรวจปัสสาวะ','น้ำตาลในเลือด (FBS)','ไขมันในเลือด (Lipid Profile)','ตรวจการทำงานของตับ (LFT)','ตรวจการทำงานของไต (BUN/Cr)','เอกซเรย์ปอด','ECG คลื่นไฟฟ้าหัวใจ'], true),
('ตรวจสุขภาพ Premium Plus', 'Health Check Premium Plus', 'checkup', 'MediThai กรุงเทพ', 'bkk', 4990, 6500, 'all', 'middle', 'ครบครันกว่า 60 รายการ พร้อมแพ็กเกจสุขภาพหัวใจ', ARRAY['ทุกรายการ Essential','Thyroid (TSH,FT4)','HbA1c ค่าเฉลี่ยน้ำตาล 3 เดือน','Vitamin D','Echocardiogram','ปรึกษาแพทย์อายุรกรรม'], true),
('ตรวจมะเร็งสตรีครบชุด', 'Women Cancer Screening', 'cancer', 'MediThai มะเร็ง', 'cancer', 3490, 4900, 'female', 'all', 'คัดกรองมะเร็งสำคัญสำหรับสตรี 4 ชนิด', ARRAY['Mammogram + Ultrasound เต้านม','Pap Smear + HPV DNA Test','CA-125 มะเร็งรังไข่','AFP + CEA มะเร็งตับและลำไส้'], false),
('ตรวจมะเร็งชายครบชุด', 'Men Cancer Screening', 'cancer', 'MediThai มะเร็ง', 'cancer', 2990, 3900, 'male', 'all', 'คัดกรองมะเร็งสำคัญสำหรับชาย 4 ชนิด', ARRAY['PSA มะเร็งต่อมลูกหมาก','AFP + CEA มะเร็งตับ','CT ปอดขนาดต่ำ (Low-dose CT Chest)','Colonoscopy Screening'], false),
('ตรวจหัวใจ Basic', 'Cardiac Screening Basic', 'heart', 'MediThai หัวใจ', 'heart', 2490, 3200, 'all', 'middle', 'ตรวจหัวใจเบื้องต้น เหมาะสำหรับผู้มีความเสี่ยง', ARRAY['ECG 12-lead','Echocardiogram','Treadmill Exercise Test (EST)','Lipid Profile ครบชุด','ปรึกษาอายุรแพทย์โรคหัวใจ'], true),
('ตรวจหัวใจ Advanced CT Angiography', 'CT Coronary Angiography', 'heart', 'MediThai หัวใจ', 'heart', 12900, 16000, 'all', 'senior', 'ตรวจหลอดเลือดหัวใจด้วย CT ความละเอียดสูง', ARRAY['256-slice CT Coronary Angiography','Calcium Score','Cardiologist Consultation','รายงานผลภายใน 24 ชั่วโมง'], false),
('ผ่าตัดต้อกระจก (ตาเดียว)', 'Cataract Surgery – Single Eye', 'surgery', 'MediThai กรุงเทพ', 'bkk', 35000, 42000, 'all', 'senior', 'ผ่าตัดต้อกระจกด้วยเลนส์มาตรฐาน รวมค่าห้องพักคืนเดียว', ARRAY['ค่าผ่าตัด Phacoemulsification','เลนส์แก้วตาเทียมมาตรฐาน (Monofocal IOL)','ค่าห้องพักหลังผ่าตัด 1 คืน','ยาหลังผ่าตัด 1 เดือน','ติดตามผล 3 ครั้ง'], false),
('ผ่าตัดส่องกล้องถุงน้ำดี', 'Laparoscopic Cholecystectomy', 'surgery', 'MediThai กรุงเทพ', 'bkk', 55000, 70000, 'all', 'all', 'ผ่าตัดถุงน้ำดีด้วยการส่องกล้อง แผลเล็ก ฟื้นตัวเร็ว', ARRAY['ค่าผ่าตัดและค่าห้องผ่าตัด','วิสัญญี','ห้องพักหลังผ่าตัด 2 คืน','ค่าแพทย์ศัลยกรรม','ยาและเวชภัณฑ์หลังผ่าตัด'], false),
('วัคซีนไข้หวัดใหญ่ 4 สายพันธุ์', 'Influenza Vaccine – Quadrivalent', 'vaccine', 'MediThai กรุงเทพ', 'bkk', 590, 790, 'all', 'all', 'วัคซีนไข้หวัดใหญ่ประจำปี ป้องกัน 4 สายพันธุ์', ARRAY['วัคซีน Quadrivalent Influenza','ค่าฉีดวัคซีน','ใบรับรองการฉีดวัคซีน'], false),
('แพ็กเกจวัคซีน HPV 9 สายพันธุ์', 'HPV Vaccine – 9-valent (3 doses)', 'vaccine', 'MediThai กรุงเทพ', 'bkk', 9900, 12000, 'female', 'young', 'ป้องกันมะเร็งปากมดลูก ครบ 3 เข็ม', ARRAY['วัคซีน HPV Gardasil 9 ครบ 3 เข็ม','ค่าฉีด 3 ครั้ง','ปรึกษาสูตินรีแพทย์ก่อนฉีด'], false),
('Executive Health Check + Cardiac', 'Executive Health Check + Cardiac', 'bundle', 'MediThai กรุงเทพ', 'bkk', 18900, 24000, 'all', 'middle', 'ตรวจสุขภาพผู้บริหาร ครบ 80+ รายการ พร้อมตรวจหัวใจเชิงลึก', ARRAY['ตรวจสุขภาพ Premium Plus ทั้งหมด','CT Coronary Calcium Score','Carotid Ultrasound','ตรวจสายตาและจอประสาทตา','พบอายุรแพทย์และแพทย์หัวใจ','รายงานผลสรุปสุขภาพ (Health Report)'], true),
('Well-Woman Comprehensive Bundle', 'Well-Woman Comprehensive', 'bundle', 'MediThai มะเร็ง', 'cancer', 7900, 10500, 'female', 'middle', 'ดูแลสุขภาพสตรีครบวงจร ตรวจได้ที่ MediThai มะเร็ง', ARRAY['ตรวจสุขภาพพื้นฐาน Essential','Mammogram + Ultrasound เต้านม','Pap Smear + HPV DNA Test','Bone Density (DEXA Scan)','Thyroid Profile ครบชุด','ปรึกษาสูตินรีแพทย์'], true)
ON CONFLICT DO NOTHING;
