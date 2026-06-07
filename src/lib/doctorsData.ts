export interface Doctor {
  id: string;
  nameTh: string;
  nameEn: string;
  titleTh: string;
  titleEn: string;
  specialty: string;
  specialtyEn: string;
  hospital: string;
  hospitalEn: string;
  hospitalKey: string;
  color: string;
  tags: string[];
  bioTh: string;
  bioEn: string;
  education: { th: string; en: string }[];
  awards: { th: string; en: string }[];
  schedule: { day: string; dayEn: string; time: string }[];
  languages: string[];
  experience: number;
}

export const doctors: Doctor[] = [
  {
    id: 'chatithanong-yodwuthi',
    nameTh: 'นพ. ชาติทนง ยอดวุฒิ',
    nameEn: 'Dr. Chatithanong Yodwuthi',
    titleTh: 'อายุรแพทย์โรคหัวใจและหลอดเลือด',
    titleEn: 'Interventional Cardiologist',
    specialty: 'ศูนย์หัวใจ',
    specialtyEn: 'Heart Center',
    hospital: 'MediThai หัวใจ',
    hospitalEn: 'MediThai Heart Hospital',
    hospitalKey: 'heart',
    color: '#EF4444',
    tags: ['MitraClip', 'Electrophysiology', 'Heart Failure'],
    bioTh: 'แพทย์ผู้เชี่ยวชาญด้านหัวใจและหลอดเลือดที่มีประสบการณ์กว่า 18 ปี เชี่ยวชาญพิเศษด้านการรักษาด้วย MitraClip, Electrophysiology และภาวะหัวใจล้มเหลว ได้รับการฝึกอบรมจากสถาบันชั้นนำระดับโลกและเป็นที่รู้จักด้านการทำหัตถการหัวใจที่ซับซ้อน',
    bioEn: 'An experienced interventional cardiologist with over 18 years of practice. Specializes in MitraClip procedures, electrophysiology, and heart failure management. Trained at world-class institutions and recognized for complex cardiac interventions.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล', en: 'MD, Mahidol University' },
      { th: 'วุฒิบัตรอายุรศาสตร์โรคหัวใจ จุฬาลงกรณ์มหาวิทยาลัย', en: 'Cardiology Fellowship, Chulalongkorn University' },
      { th: 'Interventional Cardiology Fellowship, Cleveland Clinic, USA', en: 'Interventional Cardiology Fellowship, Cleveland Clinic, USA' },
    ],
    awards: [
      { th: 'รางวัลแพทย์ดีเด่น สมาคมแพทย์โรคหัวใจแห่งประเทศไทย 2566', en: 'Outstanding Physician Award, Heart Association of Thailand 2023' },
      { th: 'Certificate of Excellence, Transcatheter Cardiovascular Therapeutics (TCT)', en: 'Certificate of Excellence, TCT Conference' },
    ],
    schedule: [
      { day: 'จันทร์', dayEn: 'Monday', time: '09:00 – 17:00' },
      { day: 'พุธ', dayEn: 'Wednesday', time: '09:00 – 17:00' },
      { day: 'ศุกร์', dayEn: 'Friday', time: '08:00 – 12:00' },
    ],
    languages: ['ไทย', 'English'],
    experience: 18,
  },
  {
    id: 'saranya-ngamrasmeewong',
    nameTh: 'พญ. ศรัณยา งามรัศมีวงศ์',
    nameEn: 'Dr. Saranya Ngamrasmeewong',
    titleTh: 'รังสีแพทย์วินิจฉัย (Breast Imaging)',
    titleEn: 'Diagnostic Radiologist – Breast Imaging',
    specialty: 'ศูนย์มะเร็ง',
    specialtyEn: 'Cancer Center',
    hospital: 'MediThai มะเร็ง',
    hospitalEn: 'MediThai Cancer Center',
    hospitalKey: 'cancer',
    color: '#8B5CF6',
    tags: ['AI Mammography', 'Breast MRI', 'Biopsy'],
    bioTh: 'รังสีแพทย์ผู้เชี่ยวชาญด้าน Breast Imaging ที่บุกเบิกการใช้ AI ในการตรวจมะเร็งเต้านมในประเทศไทย มีประสบการณ์ 14 ปีในการวินิจฉัยโรคด้วยภาพถ่ายทางรังสีขั้นสูง',
    bioEn: 'A pioneering radiologist in AI-assisted breast cancer screening in Thailand, with 14 years of experience in advanced diagnostic imaging.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยเชียงใหม่', en: 'MD, Chiang Mai University' },
      { th: 'วุฒิบัตรรังสีวิทยาวินิจฉัย จุฬาลงกรณ์มหาวิทยาลัย', en: 'Diagnostic Radiology, Chulalongkorn University' },
      { th: 'Fellowship in Breast Imaging, MD Anderson Cancer Center, USA', en: 'Fellowship in Breast Imaging, MD Anderson Cancer Center, USA' },
    ],
    awards: [
      { th: 'รางวัลนักวิจัยดีเด่น ราชวิทยาลัยรังสีแพทย์แห่งประเทศไทย 2565', en: 'Outstanding Researcher, Royal College of Radiologists of Thailand 2022' },
    ],
    schedule: [
      { day: 'อังคาร', dayEn: 'Tuesday', time: '08:00 – 16:00' },
      { day: 'พฤหัสบดี', dayEn: 'Thursday', time: '08:00 – 16:00' },
      { day: 'เสาร์', dayEn: 'Saturday', time: '09:00 – 13:00' },
    ],
    languages: ['ไทย', 'English'],
    experience: 14,
  },
  {
    id: 'sarinporn-manitsirigun',
    nameTh: 'พญ. ศรินพร มานิตย์ศิริกุล',
    nameEn: 'Dr. Sarinporn Manitsirigun',
    titleTh: 'อายุรแพทย์ระบบประสาท',
    titleEn: 'Neurologist',
    specialty: 'ศูนย์สมองและระบบประสาท',
    specialtyEn: 'Brain & Spine Center',
    hospital: 'MediThai สมองและกระดูก',
    hospitalEn: 'MediThai Brain & Spine',
    hospitalKey: 'spine',
    color: '#10B981',
    tags: ['Neurology', 'Stroke', 'Epilepsy'],
    bioTh: 'อายุรแพทย์ระบบประสาทที่เชี่ยวชาญด้านโรคหลอดเลือดสมองและโรคลมชัก มีประสบการณ์ 12 ปี เป็นหนึ่งในผู้นำด้าน Stroke Fast Track ของประเทศไทย',
    bioEn: 'Neurologist specializing in cerebrovascular disease and epilepsy with 12 years of experience. One of Thailand\'s leading experts in Stroke Fast Track protocols.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยขอนแก่น', en: 'MD, Khon Kaen University' },
      { th: 'วุฒิบัตรประสาทวิทยา โรงพยาบาลรามาธิบดี', en: 'Neurology, Ramathibodi Hospital' },
      { th: 'Cerebrovascular Fellowship, Johns Hopkins Hospital, USA', en: 'Cerebrovascular Fellowship, Johns Hopkins Hospital, USA' },
    ],
    awards: [
      { th: 'รางวัลอาจารย์แพทย์ดีเด่น คณะแพทยศาสตร์ รามาธิบดี 2566', en: 'Outstanding Medical Faculty Award, Ramathibodi 2023' },
    ],
    schedule: [
      { day: 'จันทร์', dayEn: 'Monday', time: '13:00 – 17:00' },
      { day: 'พุธ', dayEn: 'Wednesday', time: '08:00 – 16:00' },
      { day: 'ศุกร์', dayEn: 'Friday', time: '13:00 – 17:00' },
    ],
    languages: ['ไทย', 'English'],
    experience: 12,
  },
  {
    id: 'padungkiat-tangpirultham',
    nameTh: 'นพ. ผดุงเกียรติ ตั้งพิรุฬห์ธรรม',
    nameEn: 'Dr. Padungkiat Tangpirultham',
    titleTh: 'ศัลยแพทย์ทรวงอก (มะเร็งปอด)',
    titleEn: 'Thoracic Surgeon – Lung Cancer',
    specialty: 'ศูนย์มะเร็ง',
    specialtyEn: 'Cancer Center',
    hospital: 'MediThai มะเร็ง',
    hospitalEn: 'MediThai Cancer Center',
    hospitalKey: 'cancer',
    color: '#F59E0B',
    tags: ['da Vinci Robot', 'Lung Cancer', 'VATS'],
    bioTh: 'ศัลยแพทย์ทรวงอกผู้เชี่ยวชาญด้านการผ่าตัดมะเร็งปอดด้วยหุ่นยนต์ da Vinci และการผ่าตัดส่องกล้อง VATS มีประสบการณ์ 16 ปี เป็นผู้นำการผ่าตัดทรวงอกแบบ minimally invasive ในประเทศไทย',
    bioEn: 'Thoracic surgeon specializing in robotic da Vinci and VATS lung cancer surgery. 16 years of experience and a leader in minimally invasive thoracic surgery in Thailand.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย', en: 'MD, Chulalongkorn University' },
      { th: 'วุฒิบัตรศัลยกรรมทรวงอก โรงพยาบาลศิริราช', en: 'Thoracic Surgery, Siriraj Hospital' },
      { th: 'Robotic Thoracic Surgery Fellowship, Memorial Sloan Kettering, USA', en: 'Robotic Thoracic Surgery Fellowship, Memorial Sloan Kettering, USA' },
    ],
    awards: [
      { th: 'รางวัล Best Paper, มะเร็งวิทยาสมาคมแห่งประเทศไทย 2564', en: 'Best Paper Award, Cancer Society of Thailand 2021' },
    ],
    schedule: [
      { day: 'อังคาร', dayEn: 'Tuesday', time: '09:00 – 17:00' },
      { day: 'พฤหัสบดี', dayEn: 'Thursday', time: '09:00 – 17:00' },
    ],
    languages: ['ไทย', 'English', 'Français'],
    experience: 16,
  },
  {
    id: 'sarit-hongwilai',
    nameTh: 'นพ. ศริษฏ์ หงษ์วิไล',
    nameEn: 'Dr. Sarit Hongwilai',
    titleTh: 'ศัลยแพทย์กระดูกและข้อ',
    titleEn: 'Orthopedic Surgeon',
    specialty: 'ศูนย์กระดูกและข้อ',
    specialtyEn: 'Orthopedics',
    hospital: 'MediThai สมองและกระดูก',
    hospitalEn: 'MediThai Brain & Spine',
    hospitalKey: 'spine',
    color: '#2554A0',
    tags: ['Robotic UKA', 'Joint Replacement', 'Sports Medicine'],
    bioTh: 'ศัลยแพทย์กระดูกและข้อผู้เชี่ยวชาญด้านการผ่าตัดเปลี่ยนข้อเข่าด้วยหุ่นยนต์ และเวชศาสตร์การกีฬา มีประสบการณ์ 15 ปี เป็นผู้บุกเบิกการใช้ Robotic UKA ในประเทศไทย',
    bioEn: 'Orthopedic surgeon specializing in robotic knee replacement and sports medicine. 15 years of experience and pioneer of Robotic UKA in Thailand.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล (เกียรตินิยม)', en: 'MD with Honors, Mahidol University' },
      { th: 'วุฒิบัตรออร์โธปิดิกส์ โรงพยาบาลรามาธิบดี', en: 'Orthopedic Surgery, Ramathibodi Hospital' },
      { th: 'Sports Medicine & Robotic Surgery Fellowship, Hospital for Special Surgery, USA', en: 'Sports Medicine & Robotic Surgery Fellowship, Hospital for Special Surgery, USA' },
    ],
    awards: [
      { th: 'รางวัลศัลยแพทย์กระดูกดีเด่น ราชวิทยาลัยศัลยแพทย์แห่งประเทศไทย 2566', en: 'Outstanding Orthopedic Surgeon, Royal College of Surgeons of Thailand 2023' },
    ],
    schedule: [
      { day: 'จันทร์', dayEn: 'Monday', time: '08:00 – 16:00' },
      { day: 'พุธ', dayEn: 'Wednesday', time: '13:00 – 17:00' },
      { day: 'เสาร์', dayEn: 'Saturday', time: '08:00 – 12:00' },
    ],
    languages: ['ไทย', 'English'],
    experience: 15,
  },
  {
    id: 'natthaphon-arayawuttikun',
    nameTh: 'นพ. ณัฐพล อารยวุฒิกุล',
    nameEn: 'Dr. Natthaphon Arayawuttikun',
    titleTh: 'ศัลยแพทย์หัวใจและทรวงอก',
    titleEn: 'Cardiac & Thoracic Surgeon',
    specialty: 'ศูนย์หัวใจ',
    specialtyEn: 'Heart Center',
    hospital: 'MediThai หัวใจ',
    hospitalEn: 'MediThai Heart Hospital',
    hospitalKey: 'heart',
    color: '#EF4444',
    tags: ['MICS', 'Open Heart Surgery', 'CABG'],
    bioTh: 'ศัลยแพทย์หัวใจที่เชี่ยวชาญการผ่าตัดหัวใจแบบ Minimally Invasive (MICS) และการผ่าตัดทำทางเบี่ยงหลอดเลือดหัวใจ (CABG) มีประสบการณ์ 13 ปี เป็นผู้นำด้านการผ่าตัดหัวใจแบบแผลเล็กในไทย',
    bioEn: 'Cardiac surgeon specializing in Minimally Invasive Cardiac Surgery (MICS) and CABG with 13 years of experience. Thailand\'s leading practitioner of small-incision heart surgery.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยมหิดล', en: 'MD, Mahidol University' },
      { th: 'วุฒิบัตรศัลยกรรมหัวใจและทรวงอก โรงพยาบาลศิริราช', en: 'Cardiac Surgery, Siriraj Hospital' },
      { th: 'MICS Fellowship, Leipzig Heart Center, Germany', en: 'MICS Fellowship, Leipzig Heart Center, Germany' },
    ],
    awards: [
      { th: 'Young Surgeon Award, Asian Society for Cardiovascular & Thoracic Surgery 2565', en: 'Young Surgeon Award, ASCVTS 2022' },
    ],
    schedule: [
      { day: 'อังคาร', dayEn: 'Tuesday', time: '09:00 – 17:00' },
      { day: 'พฤหัสบดี', dayEn: 'Thursday', time: '09:00 – 17:00' },
      { day: 'เสาร์', dayEn: 'Saturday', time: '09:00 – 12:00' },
    ],
    languages: ['ไทย', 'English', 'Deutsch'],
    experience: 13,
  },
  {
    id: 'chayaphon-cheerathanom',
    nameTh: 'นพ. ชยพล ชีถนอม',
    nameEn: 'Dr. Chayaphon Cheerathanom',
    titleTh: 'อายุรแพทย์ทั่วไป โรคเบาหวาน',
    titleEn: 'Internal Medicine – Diabetes & Endocrinology',
    specialty: 'อายุรกรรม',
    specialtyEn: 'Internal Medicine',
    hospital: 'MediThai กรุงเทพ',
    hospitalEn: 'MediThai Bangkok',
    hospitalKey: 'bkk',
    color: '#16A34A',
    tags: ['Diabetes', 'Endocrinology', 'CKM Syndrome'],
    bioTh: 'อายุรแพทย์ผู้เชี่ยวชาญโรคเบาหวานและระบบต่อมไร้ท่อ มีประสบการณ์ 10 ปี เชี่ยวชาญพิเศษด้าน Cardiorenal-Metabolic (CKM) Syndrome และการดูแลผู้ป่วยเบาหวานแบบองค์รวม',
    bioEn: 'Internal medicine specialist in diabetes and endocrinology with 10 years of experience. Expert in Cardiorenal-Metabolic (CKM) Syndrome and holistic diabetes management.',
    education: [
      { th: 'แพทยศาสตรบัณฑิต มหาวิทยาลัยเชียงใหม่', en: 'MD, Chiang Mai University' },
      { th: 'วุฒิบัตรอายุรศาสตร์ โรงพยาบาลรามาธิบดี', en: 'Internal Medicine, Ramathibodi Hospital' },
      { th: 'Endocrinology Fellowship, National University Hospital, Singapore', en: 'Endocrinology Fellowship, National University Hospital, Singapore' },
    ],
    awards: [],
    schedule: [
      { day: 'จันทร์', dayEn: 'Monday', time: '09:00 – 17:00' },
      { day: 'พุธ', dayEn: 'Wednesday', time: '09:00 – 12:00' },
      { day: 'ศุกร์', dayEn: 'Friday', time: '09:00 – 17:00' },
    ],
    languages: ['ไทย', 'English'],
    experience: 10,
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find(d => d.id === id);
}

// Map a Supabase row to the Doctor interface
function rowToDoctor(row: Record<string, unknown>): Doctor {
  return {
    id:          row.id as string,
    nameTh:      row.name_th as string,
    nameEn:      row.name_en as string,
    titleTh:     row.title_th as string,
    titleEn:     row.title_en as string,
    specialty:   row.specialty as string,
    specialtyEn: row.specialty_en as string,
    hospital:    row.hospital as string,
    hospitalEn:  row.hospital_en as string,
    hospitalKey: row.hospital_key as string,
    color:       row.color as string,
    tags:        (row.tags as string[]) ?? [],
    bioTh:       row.bio_th as string,
    bioEn:       row.bio_en as string,
    education:   (row.education as { th: string; en: string }[]) ?? [],
    awards:      (row.awards as { th: string; en: string }[]) ?? [],
    schedule:    (row.schedule as { day: string; dayEn: string; time: string }[]) ?? [],
    languages:   (row.languages as string[]) ?? [],
    experience:  row.experience as number,
  };
}

export async function getDoctorsFromDB(): Promise<Doctor[]> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('experience', { ascending: false });
    if (error || !data?.length) return doctors;
    return data.map(rowToDoctor);
  } catch {
    return doctors;
  }
}

export async function getDoctorByIdFromDB(id: string): Promise<Doctor | undefined> {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    if (error || !data) return getDoctorById(id);
    return rowToDoctor(data);
  } catch {
    return getDoctorById(id);
  }
}
