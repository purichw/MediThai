-- Doctors table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS doctors (
  id           TEXT PRIMARY KEY,
  name_th      TEXT    NOT NULL,
  name_en      TEXT    NOT NULL,
  title_th     TEXT    NOT NULL,
  title_en     TEXT    NOT NULL,
  specialty    TEXT    NOT NULL,
  specialty_en TEXT    NOT NULL,
  hospital     TEXT    NOT NULL,
  hospital_en  TEXT    NOT NULL,
  hospital_key TEXT    NOT NULL,
  color        TEXT    DEFAULT '#1B3A6B',
  tags         TEXT[]  DEFAULT '{}',
  bio_th       TEXT,
  bio_en       TEXT,
  education    JSONB   DEFAULT '[]',
  awards       JSONB   DEFAULT '[]',
  schedule     JSONB   DEFAULT '[]',
  languages    TEXT[]  DEFAULT '{}',
  experience   INTEGER DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doctors_public_read" ON doctors FOR SELECT USING (is_active = true);

-- Seed data (matches doctorsData.ts)
INSERT INTO doctors VALUES
(
  'chatithanong-yodwuthi',
  'นพ. ชาติทนง ยอดวุฒิ', 'Dr. Chatithanong Yodwuthi',
  'อายุรแพทย์โรคหัวใจและหลอดเลือด', 'Interventional Cardiologist',
  'ศูนย์หัวใจ', 'Heart Center',
  'MediThai หัวใจ', 'MediThai Heart Hospital', 'heart',
  '#EF4444',
  ARRAY['MitraClip','Electrophysiology','Heart Failure'],
  'แพทย์ผู้เชี่ยวชาญด้านหัวใจและหลอดเลือดที่มีประสบการณ์กว่า 18 ปี เชี่ยวชาญพิเศษด้านการรักษาด้วย MitraClip, Electrophysiology และภาวะหัวใจล้มเหลว',
  'An experienced interventional cardiologist with over 18 years of practice. Specializes in MitraClip procedures, electrophysiology, and heart failure management.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล","en":"MD, Mahidol University"},{"th":"วุฒิบัตรอายุรศาสตร์โรคหัวใจ จุฬาลงกรณ์มหาวิทยาลัย","en":"Cardiology Fellowship, Chulalongkorn University"},{"th":"Interventional Cardiology Fellowship, Cleveland Clinic, USA","en":"Interventional Cardiology Fellowship, Cleveland Clinic, USA"}]',
  '[{"th":"รางวัลแพทย์ดีเด่น สมาคมแพทย์โรคหัวใจแห่งประเทศไทย 2566","en":"Outstanding Physician Award, Heart Association of Thailand 2023"}]',
  '[{"day":"จันทร์","dayEn":"Monday","time":"09:00 – 17:00"},{"day":"พุธ","dayEn":"Wednesday","time":"09:00 – 17:00"},{"day":"ศุกร์","dayEn":"Friday","time":"08:00 – 12:00"}]',
  ARRAY['ไทย','English'], 18, true, now()
),
(
  'saranya-ngamrasmeewong',
  'พญ. ศรัณยา งามรัศมีวงศ์', 'Dr. Saranya Ngamrasmeewong',
  'รังสีแพทย์วินิจฉัย (Breast Imaging)', 'Diagnostic Radiologist – Breast Imaging',
  'ศูนย์มะเร็ง', 'Cancer Center',
  'MediThai มะเร็ง', 'MediThai Cancer Center', 'cancer',
  '#8B5CF6',
  ARRAY['AI Mammography','Breast MRI','Biopsy'],
  'รังสีแพทย์ผู้เชี่ยวชาญด้าน Breast Imaging ที่บุกเบิกการใช้ AI ในการตรวจมะเร็งเต้านมในประเทศไทย มีประสบการณ์ 14 ปี',
  'A pioneering radiologist in AI-assisted breast cancer screening in Thailand, with 14 years of experience in advanced diagnostic imaging.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยเชียงใหม่","en":"MD, Chiang Mai University"},{"th":"วุฒิบัตรรังสีวิทยาวินิจฉัย จุฬาลงกรณ์มหาวิทยาลัย","en":"Diagnostic Radiology, Chulalongkorn University"},{"th":"Fellowship in Breast Imaging, MD Anderson Cancer Center, USA","en":"Fellowship in Breast Imaging, MD Anderson Cancer Center, USA"}]',
  '[{"th":"รางวัลนักวิจัยดีเด่น ราชวิทยาลัยรังสีแพทย์แห่งประเทศไทย 2565","en":"Outstanding Researcher, Royal College of Radiologists of Thailand 2022"}]',
  '[{"day":"อังคาร","dayEn":"Tuesday","time":"08:00 – 16:00"},{"day":"พฤหัสบดี","dayEn":"Thursday","time":"08:00 – 16:00"},{"day":"เสาร์","dayEn":"Saturday","time":"09:00 – 13:00"}]',
  ARRAY['ไทย','English'], 14, true, now()
),
(
  'sarinporn-manitsirigun',
  'พญ. ศรินพร มานิตย์ศิริกุล', 'Dr. Sarinporn Manitsirigun',
  'อายุรแพทย์ระบบประสาท', 'Neurologist',
  'ศูนย์สมองและระบบประสาท', 'Brain & Spine Center',
  'MediThai สมองและกระดูก', 'MediThai Brain & Spine', 'spine',
  '#10B981',
  ARRAY['Neurology','Stroke','Epilepsy'],
  'อายุรแพทย์ระบบประสาทที่เชี่ยวชาญด้านโรคหลอดเลือดสมองและโรคลมชัก มีประสบการณ์ 12 ปี',
  'Neurologist specializing in cerebrovascular disease and epilepsy with 12 years of experience.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยขอนแก่น","en":"MD, Khon Kaen University"},{"th":"วุฒิบัตรประสาทวิทยา โรงพยาบาลรามาธิบดี","en":"Neurology, Ramathibodi Hospital"},{"th":"Cerebrovascular Fellowship, Johns Hopkins Hospital, USA","en":"Cerebrovascular Fellowship, Johns Hopkins Hospital, USA"}]',
  '[{"th":"รางวัลอาจารย์แพทย์ดีเด่น คณะแพทยศาสตร์ รามาธิบดี 2566","en":"Outstanding Medical Faculty Award, Ramathibodi 2023"}]',
  '[{"day":"จันทร์","dayEn":"Monday","time":"13:00 – 17:00"},{"day":"พุธ","dayEn":"Wednesday","time":"08:00 – 16:00"},{"day":"ศุกร์","dayEn":"Friday","time":"13:00 – 17:00"}]',
  ARRAY['ไทย','English'], 12, true, now()
),
(
  'padungkiat-tangpirultham',
  'นพ. ผดุงเกียรติ ตั้งพิรุฬห์ธรรม', 'Dr. Padungkiat Tangpirultham',
  'ศัลยแพทย์ทรวงอก (มะเร็งปอด)', 'Thoracic Surgeon – Lung Cancer',
  'ศูนย์มะเร็ง', 'Cancer Center',
  'MediThai มะเร็ง', 'MediThai Cancer Center', 'cancer',
  '#F59E0B',
  ARRAY['da Vinci Robot','Lung Cancer','VATS'],
  'ศัลยแพทย์ทรวงอกผู้เชี่ยวชาญด้านการผ่าตัดมะเร็งปอดด้วยหุ่นยนต์ da Vinci และการผ่าตัดส่องกล้อง VATS มีประสบการณ์ 16 ปี',
  'Thoracic surgeon specializing in robotic da Vinci and VATS lung cancer surgery. 16 years of experience.',
  '[{"th":"แพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย","en":"MD, Chulalongkorn University"},{"th":"วุฒิบัตรศัลยกรรมทรวงอก โรงพยาบาลศิริราช","en":"Thoracic Surgery, Siriraj Hospital"},{"th":"Robotic Thoracic Surgery Fellowship, Memorial Sloan Kettering, USA","en":"Robotic Thoracic Surgery Fellowship, Memorial Sloan Kettering, USA"}]',
  '[{"th":"รางวัล Best Paper, มะเร็งวิทยาสมาคมแห่งประเทศไทย 2564","en":"Best Paper Award, Cancer Society of Thailand 2021"}]',
  '[{"day":"อังคาร","dayEn":"Tuesday","time":"09:00 – 17:00"},{"day":"พฤหัสบดี","dayEn":"Thursday","time":"09:00 – 17:00"}]',
  ARRAY['ไทย','English','Français'], 16, true, now()
),
(
  'sarit-hongwilai',
  'นพ. ศริษฏ์ หงษ์วิไล', 'Dr. Sarit Hongwilai',
  'ศัลยแพทย์กระดูกและข้อ', 'Orthopedic Surgeon',
  'ศูนย์กระดูกและข้อ', 'Orthopedics',
  'MediThai สมองและกระดูก', 'MediThai Brain & Spine', 'spine',
  '#2554A0',
  ARRAY['Robotic UKA','Joint Replacement','Sports Medicine'],
  'ศัลยแพทย์กระดูกและข้อผู้เชี่ยวชาญด้านการผ่าตัดเปลี่ยนข้อเข่าด้วยหุ่นยนต์ มีประสบการณ์ 15 ปี',
  'Orthopedic surgeon specializing in robotic knee replacement and sports medicine. 15 years of experience.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล (เกียรตินิยม)","en":"MD with Honors, Mahidol University"},{"th":"วุฒิบัตรออร์โธปิดิกส์ โรงพยาบาลรามาธิบดี","en":"Orthopedic Surgery, Ramathibodi Hospital"},{"th":"Sports Medicine & Robotic Surgery Fellowship, Hospital for Special Surgery, USA","en":"Sports Medicine & Robotic Surgery Fellowship, Hospital for Special Surgery, USA"}]',
  '[{"th":"รางวัลศัลยแพทย์กระดูกดีเด่น ราชวิทยาลัยศัลยแพทย์แห่งประเทศไทย 2566","en":"Outstanding Orthopedic Surgeon, Royal College of Surgeons of Thailand 2023"}]',
  '[{"day":"จันทร์","dayEn":"Monday","time":"08:00 – 16:00"},{"day":"พุธ","dayEn":"Wednesday","time":"13:00 – 17:00"},{"day":"เสาร์","dayEn":"Saturday","time":"08:00 – 12:00"}]',
  ARRAY['ไทย','English'], 15, true, now()
),
(
  'natthaphon-arayawuttikun',
  'นพ. ณัฐพล อารยวุฒิกุล', 'Dr. Natthaphon Arayawuttikun',
  'ศัลยแพทย์หัวใจและทรวงอก', 'Cardiac & Thoracic Surgeon',
  'ศูนย์หัวใจ', 'Heart Center',
  'MediThai หัวใจ', 'MediThai Heart Hospital', 'heart',
  '#EF4444',
  ARRAY['MICS','Open Heart Surgery','CABG'],
  'ศัลยแพทย์หัวใจที่เชี่ยวชาญการผ่าตัดหัวใจแบบ Minimally Invasive (MICS) มีประสบการณ์ 13 ปี',
  'Cardiac surgeon specializing in Minimally Invasive Cardiac Surgery (MICS) and CABG with 13 years of experience.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล","en":"MD, Mahidol University"},{"th":"วุฒิบัตรศัลยกรรมหัวใจและทรวงอก โรงพยาบาลศิริราช","en":"Cardiac Surgery, Siriraj Hospital"},{"th":"MICS Fellowship, Leipzig Heart Center, Germany","en":"MICS Fellowship, Leipzig Heart Center, Germany"}]',
  '[{"th":"Young Surgeon Award, Asian Society for Cardiovascular & Thoracic Surgery 2565","en":"Young Surgeon Award, ASCVTS 2022"}]',
  '[{"day":"อังคาร","dayEn":"Tuesday","time":"09:00 – 17:00"},{"day":"พฤหัสบดี","dayEn":"Thursday","time":"09:00 – 17:00"},{"day":"เสาร์","dayEn":"Saturday","time":"09:00 – 12:00"}]',
  ARRAY['ไทย','English','Deutsch'], 13, true, now()
),
(
  'chayaphon-cheerathanom',
  'นพ. ชยพล ชีถนอม', 'Dr. Chayaphon Cheerathanom',
  'อายุรแพทย์ทั่วไป โรคเบาหวาน', 'Internal Medicine – Diabetes & Endocrinology',
  'อายุรกรรม', 'Internal Medicine',
  'MediThai กรุงเทพ', 'MediThai Bangkok', 'bkk',
  '#16A34A',
  ARRAY['Diabetes','Endocrinology','CKM Syndrome'],
  'อายุรแพทย์ผู้เชี่ยวชาญโรคเบาหวานและระบบต่อมไร้ท่อ มีประสบการณ์ 10 ปี',
  'Internal medicine specialist in diabetes and endocrinology with 10 years of experience.',
  '[{"th":"แพทยศาสตรบัณฑิต มหาวิทยาลัยเชียงใหม่","en":"MD, Chiang Mai University"},{"th":"วุฒิบัตรอายุรศาสตร์ โรงพยาบาลรามาธิบดี","en":"Internal Medicine, Ramathibodi Hospital"},{"th":"Endocrinology Fellowship, National University Hospital, Singapore","en":"Endocrinology Fellowship, National University Hospital, Singapore"}]',
  '[]',
  '[{"day":"จันทร์","dayEn":"Monday","time":"09:00 – 17:00"},{"day":"พุธ","dayEn":"Wednesday","time":"09:00 – 12:00"},{"day":"ศุกร์","dayEn":"Friday","time":"09:00 – 17:00"}]',
  ARRAY['ไทย','English'], 10, true, now()
)
ON CONFLICT (id) DO NOTHING;
