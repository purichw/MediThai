// CMS schema — defines every editable page/section/field for the admin portal.
// Field keys match data-i18n keys in translations.js.
// Special keys: hero_bg_url (image), announce (html)

export type FieldType = 'text' | 'richtext' | 'image' | 'html' | 'number' | 'list';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  bilingual: boolean;
  placeholder?: string;
  // list-type fields only:
  itemFields?: FieldDef[];   // schema of each item (no nested lists)
  itemLabelKey?: string;     // which item field to show as the card title in the editor
  itemName?: string;         // e.g. 'ตำแหน่งงาน' — used for the "+ เพิ่ม" button
  defaults?: Record<string, string>[]; // current live content — editor seeds from this; pages use as fallback
}

export interface SectionDef {
  key: string;
  label: string;
  icon: string;
  fields: FieldDef[];
}

export interface PageDef {
  slug: string;
  label: string;
  description: string;
  icon: string;
  sections: SectionDef[];
}

const bi = (key: string, label: string, type: FieldType = 'text'): FieldDef =>
  ({ key, label, type, bilingual: true });
const mono = (key: string, label: string, type: FieldType = 'text'): FieldDef =>
  ({ key, label, type, bilingual: false });
// Repeating list of structured items. Bilingual item fields are stored flat
// as `<key>_th` / `<key>_en`; mono fields as `<key>`.
const list = (key: string, label: string, opts: {
  itemName: string;
  itemLabelKey: string;
  itemFields: FieldDef[];
  defaults?: Record<string, string>[];
}): FieldDef => ({
  key, label, type: 'list', bilingual: false,
  itemFields: opts.itemFields,
  itemLabelKey: opts.itemLabelKey,
  itemName: opts.itemName,
  defaults: opts.defaults ?? [],
});

// Helper to read a saved list (or fall back to schema defaults) on the page side
export function cmsList(
  db: Record<string, any>, sectionKey: string, fieldKey: string,
  pageSlug: string,
): Record<string, string>[] {
  const saved = db?.[sectionKey]?.meta?.[fieldKey];
  if (Array.isArray(saved) && saved.length) return saved;
  const page = CMS_PAGE_MAP[pageSlug];
  const field = page?.sections.find(s => s.key === sectionKey)?.fields.find(f => f.key === fieldKey);
  return field?.defaults ?? [];
}

export const CMS_PAGES: PageDef[] = [
  // ─── HOME ───────────────────────────────────────────────────────────────────
  {
    slug: 'home',
    label: 'หน้าแรก',
    description: 'Hero, สถิติ, ศูนย์การแพทย์, แพทย์, แพ็กเกจ และส่วนอื่น ๆ ใน Homepage',
    icon: '🏠',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        icon: '🎯',
        fields: [
          bi('hero_tag',      'แท็กบน Hero'),
          bi('hero_title_1',  'หัวข้อ บรรทัด 1'),
          bi('hero_title_2',  'หัวข้อ บรรทัด 2 (สีน้ำเงิน)'),
          bi('hero_title_3',  'หัวข้อ บรรทัด 3'),
          bi('hero_desc',     'คำอธิบายหลัก', 'richtext'),
          bi('hero_btn1',     'ปุ่มหลัก'),
          bi('hero_btn2',     'ปุ่มรอง'),
          mono('hero_stat1_num', 'สถิติ 1 — ตัวเลข'),
          bi('hero_stat1_lbl',   'สถิติ 1 — ป้ายกำกับ'),
          mono('hero_stat2_num', 'สถิติ 2 — ตัวเลข'),
          bi('hero_stat2_lbl',   'สถิติ 2 — ป้ายกำกับ'),
          mono('hero_stat3_num', 'สถิติ 3 — ตัวเลข'),
          bi('hero_stat3_lbl',   'สถิติ 3 — ป้ายกำกับ'),
          mono('hero_bg_url',    'รูปพื้นหลัง Hero (URL)', 'image'),
        ],
      },
      {
        key: 'quick_cards',
        label: 'Quick Cards (บน Hero)',
        icon: '🃏',
        fields: [
          bi('qc1_title', 'Card 1 — หัวข้อ'), bi('qc1_desc', 'Card 1 — คำอธิบาย'),
          bi('qc2_title', 'Card 2 — หัวข้อ'), bi('qc2_desc', 'Card 2 — คำอธิบาย'),
          bi('qc3_title', 'Card 3 — หัวข้อ'), bi('qc3_desc', 'Card 3 — คำอธิบาย'),
          bi('qc4_title', 'Card 4 — หัวข้อ'), bi('qc4_desc', 'Card 4 — คำอธิบาย'),
        ],
      },
      {
        key: 'quick_actions',
        label: 'Quick Actions Bar',
        icon: '⚡',
        fields: [
          bi('qa1_title', 'Action 1 — หัวข้อ'), bi('qa1_desc', 'Action 1 — คำอธิบาย'),
          bi('qa2_title', 'Action 2 — หัวข้อ'), bi('qa2_desc', 'Action 2 — คำอธิบาย'),
          bi('qa3_title', 'Action 3 — หัวข้อ'), bi('qa3_desc', 'Action 3 — คำอธิบาย'),
          bi('qa4_title', 'Action 4 — หัวข้อ'), bi('qa4_desc', 'Action 4 — คำอธิบาย'),
        ],
      },
      {
        key: 'stats',
        label: 'Stats Bar (ตัวเลขสำคัญ)',
        icon: '📊',
        fields: [
          mono('stat1_num', 'สถิติ 1 — ตัวเลข', 'number'), bi('stat1_lbl', 'สถิติ 1 — ป้ายกำกับ'),
          mono('stat2_num', 'สถิติ 2 — ตัวเลข', 'number'), bi('stat2_lbl', 'สถิติ 2 — ป้ายกำกับ'),
          mono('stat3_num', 'สถิติ 3 — ตัวเลข', 'number'), bi('stat3_lbl', 'สถิติ 3 — ป้ายกำกับ'),
          mono('stat4_num', 'สถิติ 4 — ตัวเลข', 'number'), bi('stat4_lbl', 'สถิติ 4 — ป้ายกำกับ'),
        ],
      },
      {
        key: 'specialties',
        label: 'ศูนย์การแพทย์เฉพาะทาง',
        icon: '🏥',
        fields: [
          bi('sec_spec_tag',   'Tag'),
          bi('sec_spec_title', 'หัวข้อหลัก'),
          bi('sec_spec_sub',   'คำอธิบาย', 'richtext'),
          bi('spec1', 'ศูนย์ 1 — ชื่อ'), bi('spec1d', 'ศูนย์ 1 — คำอธิบาย'),
          bi('spec2', 'ศูนย์ 2 — ชื่อ'), bi('spec2d', 'ศูนย์ 2 — คำอธิบาย'),
          bi('spec3', 'ศูนย์ 3 — ชื่อ'), bi('spec3d', 'ศูนย์ 3 — คำอธิบาย'),
          bi('spec4', 'ศูนย์ 4 — ชื่อ'), bi('spec4d', 'ศูนย์ 4 — คำอธิบาย'),
          bi('spec5', 'ศูนย์ 5 — ชื่อ'), bi('spec5d', 'ศูนย์ 5 — คำอธิบาย'),
          bi('spec6', 'ศูนย์ 6 — ชื่อ'), bi('spec6d', 'ศูนย์ 6 — คำอธิบาย'),
          bi('spec7', 'ศูนย์ 7 — ชื่อ'), bi('spec7d', 'ศูนย์ 7 — คำอธิบาย'),
          bi('spec8', 'ศูนย์ 8 — ชื่อ'), bi('spec8d', 'ศูนย์ 8 — คำอธิบาย'),
        ],
      },
      {
        key: 'trust',
        label: 'Why MediThai (จุดแข็ง)',
        icon: '🏆',
        fields: [
          bi('sec_trust_tag',   'Tag'),
          bi('sec_trust_title', 'หัวข้อหลัก'),
          bi('sec_trust_sub',   'คำอธิบาย'),
          bi('trust1_h', 'จุดแข็ง 1 — หัวข้อ'), bi('trust1_p', 'จุดแข็ง 1 — รายละเอียด', 'richtext'),
          bi('trust2_h', 'จุดแข็ง 2 — หัวข้อ'), bi('trust2_p', 'จุดแข็ง 2 — รายละเอียด', 'richtext'),
          bi('trust3_h', 'จุดแข็ง 3 — หัวข้อ'), bi('trust3_p', 'จุดแข็ง 3 — รายละเอียด', 'richtext'),
          bi('trust4_h', 'จุดแข็ง 4 — หัวข้อ'), bi('trust4_p', 'จุดแข็ง 4 — รายละเอียด', 'richtext'),
        ],
      },
      {
        key: 'doctors_section',
        label: 'Section แพทย์',
        icon: '👨‍⚕️',
        fields: [
          bi('sec_doc_tag',   'Tag'),
          bi('sec_doc_title', 'หัวข้อหลัก'),
          bi('sec_doc_sub',   'คำอธิบาย', 'richtext'),
        ],
      },
      {
        key: 'packages_section',
        label: 'Section แพ็กเกจ',
        icon: '📦',
        fields: [
          bi('sec_pkg_tag',   'Tag'),
          bi('sec_pkg_title', 'หัวข้อหลัก'),
          bi('sec_pkg_sub',   'คำอธิบาย', 'richtext'),
        ],
      },
      {
        key: 'map_section',
        label: 'Section แผนที่/สาขา',
        icon: '🗺️',
        fields: [
          bi('sec_map_tag',   'Tag'),
          bi('sec_map_title', 'หัวข้อหลัก'),
          bi('sec_map_sub',   'คำอธิบาย'),
        ],
      },
      {
        key: 'articles_section',
        label: 'Section บทความ',
        icon: '📰',
        fields: [
          bi('sec_art_tag',   'Tag'),
          bi('sec_art_title', 'หัวข้อหลัก'),
          bi('sec_art_sub',   'คำอธิบาย'),
        ],
      },
      {
        key: 'testimonials',
        label: 'Section รีวิวผู้ป่วย',
        icon: '💬',
        fields: [
          bi('sec_test_tag',   'Tag'),
          bi('sec_test_title', 'หัวข้อหลัก'),
        ],
      },
      {
        key: 'app_section',
        label: 'Section แอปพลิเคชัน',
        icon: '📱',
        fields: [
          bi('sec_app_tag',    'Tag'),
          bi('sec_app_title',  'หัวข้อ บรรทัด 1'),
          bi('sec_app_title2', 'หัวข้อ บรรทัด 2'),
          bi('app_f1', 'Feature 1'), bi('app_f2', 'Feature 2'),
          bi('app_f3', 'Feature 3'), bi('app_f4', 'Feature 4'), bi('app_f5', 'Feature 5'),
          bi('app_ios', 'ปุ่ม App Store'), bi('app_and', 'ปุ่ม Google Play'),
        ],
      },
      {
        key: 'newsletter',
        label: 'Newsletter / รับข่าวสาร',
        icon: '✉️',
        fields: [
          bi('news_title', 'หัวข้อ'),
          bi('news_sub',   'คำอธิบาย'),
          bi('news_ph',    'Placeholder อีเมล'),
          bi('news_btn',   'ปุ่ม Subscribe'),
        ],
      },
    ],
  },

  // ─── GLOBAL ─────────────────────────────────────────────────────────────────
  {
    slug: 'global',
    label: 'Global (ทุกหน้า)',
    description: 'Navigation, Footer, Announcement และ UI text ที่ปรากฏในทุกหน้า',
    icon: '🌐',
    sections: [
      {
        key: 'announcement',
        label: 'Announcement Banner',
        icon: '📣',
        fields: [
          mono('announce', 'ข้อความ Announcement (รองรับ HTML)', 'html'),
        ],
      },
      {
        key: 'nav',
        label: 'Navigation Bar',
        icon: '🧭',
        fields: [
          bi('logo_name',     'โลโก้ — ชื่อ'),
          bi('logo_sub',      'โลโก้ — ชื่อรอง'),
          bi('nav_home',      'เมนู: หน้าแรก'),
          bi('nav_hospitals', 'เมนู: โรงพยาบาล'),
          bi('nav_services',  'เมนู: บริการ'),
          bi('nav_doctors',   'เมนู: แพทย์'),
          bi('nav_packages',  'เมนู: แพ็กเกจ'),
          bi('nav_library',   'เมนู: คลังความรู้'),
          bi('nav_about',     'เมนู: เกี่ยวกับเรา'),
          bi('nav_appt',      'เมนู: นัดหมาย'),
        ],
      },
      {
        key: 'nav_hospitals',
        label: 'Dropdown — โรงพยาบาล',
        icon: '🏥',
        fields: [
          bi('dd_bkk',   'MediThai กรุงเทพ'),
          bi('dd_heart', 'MediThai หัวใจ'),
          bi('dd_cancer','MediThai มะเร็ง'),
          bi('dd_spine', 'MediThai สมองและกระดูก'),
          bi('dd_kids',  'MediThai เด็ก'),
          bi('dd_chiang','MediThai เชียงใหม่'),
        ],
      },
      {
        key: 'nav_services',
        label: 'Dropdown — บริการ',
        icon: '⚕️',
        fields: [
          bi('dd_appt',     'นัดหมายแพทย์'),
          bi('dd_virtual',  'Virtual Visit'),
          bi('dd_second',   'Second Opinion'),
          bi('dd_records',  'เวชระเบียน'),
          bi('dd_billing',  'ค่าบริการ'),
          bi('dd_insurance','ประกันสุขภาพ'),
        ],
      },
      {
        key: 'footer',
        label: 'Footer',
        icon: '🦶',
        fields: [
          bi('ft_desc',     'คำอธิบาย Footer', 'richtext'),
          bi('ft_hotline',  'สายด่วน'),
          bi('ft_about',    'ลิงก์: เกี่ยวกับเรา'),
          bi('ft_services', 'ลิงก์: บริการ'),
          bi('ft_hospitals','ลิงก์: โรงพยาบาล'),
          bi('ft_contact',  'ลิงก์: ติดต่อ'),
          bi('ft_privacy',  'ลิงก์: นโยบาย'),
          bi('ft_terms',    'ลิงก์: ข้อกำหนด'),
          bi('ft_sitemap',  'ลิงก์: Sitemap'),
          bi('ft_copy',     'Copyright'),
        ],
      },
      {
        key: 'ui_labels',
        label: 'UI Labels (ปุ่ม / ข้อความทั่วไป)',
        icon: '🔤',
        fields: [
          bi('view_all',   'ดูทั้งหมด'),
          bi('doc_appt',   'ปุ่มนัดหมาย (การ์ดแพทย์)'),
          bi('doc_profile','ปุ่มโปรไฟล์แพทย์'),
          bi('pkg_buy',    'ปุ่มซื้อแพ็กเกจ'),
          bi('pkg_detail', 'ปุ่มรายละเอียดแพ็กเกจ'),
          bi('pkg_expires','ข้อความ "สิ้นสุด"'),
          bi('map_open',   'สถานะ "เปิดให้บริการ"'),
          bi('map_get_dir','ปุ่มเส้นทาง'),
          bi('map_view_all','ปุ่มดูสาขาทั้งหมด'),
          bi('art_read',   'ปุ่มอ่านบทความ'),
          bi('search_ph',  'Placeholder ค้นหาแพทย์'),
          bi('filter_spec','Filter สาขา (default)'),
          bi('filter_hosp','Filter โรงพยาบาล (default)'),
          bi('filter_lang','Filter ภาษา'),
        ],
      },
      {
        key: 'page_headers',
        label: 'Page Headers (ชื่อหน้าต่าง ๆ)',
        icon: '📋',
        fields: [
          bi('pg_doctors_title', 'หน้าแพทย์ — ชื่อหน้า'), bi('pg_doctors_sub', 'หน้าแพทย์ — คำอธิบาย'),
          bi('pg_appt_title',    'หน้านัดหมาย — ชื่อหน้า'), bi('pg_appt_sub', 'หน้านัดหมาย — คำอธิบาย'),
          bi('pg_pkg_title',     'หน้าแพ็กเกจ — ชื่อหน้า'), bi('pg_pkg_sub', 'หน้าแพ็กเกจ — คำอธิบาย'),
          bi('pg_loc_title',     'หน้าสาขา — ชื่อหน้า'),    bi('pg_loc_sub', 'หน้าสาขา — คำอธิบาย'),
          bi('pg_lib_title',     'หน้าบทความ — ชื่อหน้า'),  bi('pg_lib_sub', 'หน้าบทความ — คำอธิบาย'),
          bi('pg_about_title',   'หน้าเกี่ยวกับ — ชื่อหน้า'),bi('pg_about_sub', 'หน้าเกี่ยวกับ — คำอธิบาย'),
          bi('pg_contact_title', 'หน้าติดต่อ — ชื่อหน้า'),  bi('pg_contact_sub', 'หน้าติดต่อ — คำอธิบาย'),
        ],
      },
    ],
  },
];

// ─── HOSPITAL PAGES (shared section template) ─────────────────────────────
function hospitalSections(): SectionDef[] {
  return [
    {
      key: 'hero',
      label: 'Hero Section',
      icon: '🏥',
      fields: [
        bi('hero_badge', 'Badge (แท็กบน Hero)'),
        bi('hero_title', 'ชื่อโรงพยาบาล'),
        bi('hero_desc',  'คำอธิบายหลัก', 'richtext'),
        mono('stat1_num', 'Stat 1 — ตัวเลข'),
        bi('stat1_lbl',  'Stat 1 — ป้ายกำกับ'),
        mono('stat2_num', 'Stat 2 — ตัวเลข'),
        bi('stat2_lbl',  'Stat 2 — ป้ายกำกับ'),
        mono('stat3_num', 'Stat 3 — ตัวเลข'),
        bi('stat3_lbl',  'Stat 3 — ป้ายกำกับ'),
        mono('stat4_num', 'Stat 4 — ตัวเลข (rating)'),
        bi('stat4_lbl',  'Stat 4 — ป้ายกำกับ'),
      ],
    },
    {
      key: 'contact',
      label: 'ข้อมูลติดต่อ',
      icon: '📞',
      fields: [
        bi('address', 'ที่อยู่'),
        mono('phone', 'เบอร์โทร'),
        bi('hours', 'เวลาทำการ'),
      ],
    },
  ];
}

// ─── OTHER PAGES ──────────────────────────────────────────────────────────────
// Simple hero section shared by most pages
function simpleHero(extraFields: FieldDef[] = []): SectionDef[] {
  return [{
    key: 'hero',
    label: 'Page Hero',
    icon: '🎯',
    fields: [
      bi('pg_title', 'ชื่อหน้า (h1)'),
      bi('pg_desc',  'คำอธิบาย', 'richtext'),
      ...extraFields,
    ],
  }];
}

const OTHER_PAGES: PageDef[] = [
  { slug:'doctors',         label:'ค้นหาแพทย์',           description:'หน้ารายชื่อแพทย์',                    icon:'👨‍⚕️', sections: simpleHero() },
  { slug:'appointments',    label:'นัดหมายออนไลน์',        description:'หน้าจองนัดหมาย',                      icon:'📅',  sections: simpleHero() },
  {
    slug: 'telehealth', label: 'พบแพทย์ออนไลน์', description: 'หน้า Telehealth — จุดเด่น ขั้นตอน ราคา', icon: '💻',
    sections: [
      ...simpleHero(),
      {
        key: 'benefits', label: 'จุดเด่น Telehealth', icon: '✨',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'จุดเด่น', {
            itemName: 'จุดเด่น', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'), bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'house-medical', color: '#0891B2', title_th: 'ไม่ต้องเดินทาง', title_en: 'No Travel Needed', desc_th: 'พบแพทย์จากบ้าน ที่ทำงาน หรือทุกที่ที่มีอินเทอร์เน็ต ประหยัดเวลาและค่าเดินทาง', desc_en: 'See a doctor from home, work, or anywhere with internet — save time and travel costs.' },
              { icon: 'clock', color: '#10B981', title_th: 'นัดได้ทันที', title_en: 'Instant Appointments', desc_th: 'มีสล็อตนัดหมายตั้งแต่เช้าถึงค่ำ ไม่ต้องรอคิวนาน', desc_en: 'Appointment slots from morning to evening — no long queues.' },
              { icon: 'shield-halved', color: '#8B5CF6', title_th: 'ปลอดภัย เป็นส่วนตัว', title_en: 'Safe & Private', desc_th: 'ระบบเข้ารหัสทุกการสนทนา ปฏิบัติตามมาตรฐาน PDPA', desc_en: 'Every conversation is encrypted, PDPA compliant.' },
              { icon: 'file-medical', color: '#F59E0B', title_th: 'รับ e-Prescription', title_en: 'e-Prescription', desc_th: 'แพทย์สามารถออกใบสั่งยาอิเล็กทรอนิกส์ได้ทันที', desc_en: 'Doctors can issue electronic prescriptions instantly.' },
              { icon: 'user-doctor', color: '#EF4444', title_th: 'แพทย์เชี่ยวชาญตัวจริง', title_en: 'Real Specialist Doctors', desc_th: 'พบแพทย์จาก MediThai ที่มีความเชี่ยวชาญจริง ไม่ใช่ AI', desc_en: 'Consult real MediThai specialists — not AI.' },
              { icon: 'globe', color: '#1B3A6B', title_th: 'รองรับหลายภาษา', title_en: 'Multilingual Support', desc_th: 'มีล่ามหรือแพทย์ที่พูดภาษาอังกฤษ จีน และญี่ปุ่นได้', desc_en: 'Interpreters or doctors who speak English, Chinese, and Japanese.' },
            ],
          }),
        ],
      },
      {
        key: 'steps', label: 'ขั้นตอนการใช้งาน', icon: '🔢',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'ขั้นตอน', {
            itemName: 'ขั้นตอน', itemLabelKey: 'title_th',
            itemFields: [bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { title_th: 'เลือกแพทย์และเวลา', title_en: 'Choose doctor and time', desc_th: 'เลือกแพทย์ตามความเชี่ยวชาญที่ต้องการ และเลือกช่วงเวลาที่สะดวก', desc_en: 'Pick a doctor by specialty and a convenient time slot.' },
              { title_th: 'ชำระค่าบริการ', title_en: 'Pay for the service', desc_th: 'ชำระผ่านบัตรเครดิต / QR Code / PromptPay — ปลอดภัย 100%', desc_en: 'Pay by credit card / QR Code / PromptPay — 100% secure.' },
              { title_th: 'รับลิงก์เข้าห้องประชุม', title_en: 'Receive your meeting link', desc_th: 'ระบบส่งลิงก์ไปยังอีเมลและ SMS ก่อนนัด 15 นาที', desc_en: 'A link is sent to your email and SMS 15 minutes before the appointment.' },
              { title_th: 'พบแพทย์ผ่านวิดีโอคอล', title_en: 'Meet your doctor on video', desc_th: 'คลิกลิงก์ พบแพทย์ได้ทันที ไม่ต้องติดตั้งแอปใดๆ', desc_en: 'Click the link and meet your doctor — no app installation needed.' },
            ],
          }),
        ],
      },
      {
        key: 'pricing', label: 'ค่าบริการ (3 แพลน)', icon: '💰',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('plans', 'แพลน', {
            itemName: 'แพลน', itemLabelKey: 'plan_th',
            itemFields: [
              bi('plan', 'ชื่อแพลน'), mono('price', 'ราคา'), bi('unit', 'หน่วย (บาท / ครั้ง)'),
              bi('features', 'รายการ (1 บรรทัด = 1 ข้อ)'), mono('featured', 'แนะนำ? (yes)'),
            ],
            defaults: [
              { plan_th: 'ปรึกษาทั่วไป', plan_en: 'General Consultation', price: '590', unit_th: 'บาท / ครั้ง', unit_en: 'THB / visit', features_th: 'พบแพทย์อายุรกรรมทั่วไป\n30 นาที\ne-Prescription\nสรุปผลส่งอีเมล', features_en: 'General internal medicine doctor\n30 minutes\ne-Prescription\nSummary sent by email', featured: '' },
              { plan_th: 'แพทย์เชี่ยวชาญ', plan_en: 'Specialist', price: '990', unit_th: 'บาท / ครั้ง', unit_en: 'THB / visit', features_th: 'เลือกแพทย์เชี่ยวชาญ\n45 นาที\ne-Prescription\nสรุปผลส่งอีเมล\nนัด Follow-up ฟรี 1 ครั้ง', features_en: 'Choose your specialist\n45 minutes\ne-Prescription\nSummary sent by email\n1 free follow-up', featured: 'yes' },
              { plan_th: 'ปรึกษาต่อเนื่อง', plan_en: 'Continuous Care', price: '1,590', unit_th: 'บาท / เดือน', unit_en: 'THB / month', features_th: 'ปรึกษาไม่จำกัดครั้ง\nแพทย์ประจำตัว\nChat กับแพทย์ได้ตลอด\nรายงานสุขภาพรายเดือน', features_en: 'Unlimited consultations\nPersonal doctor\nChat with your doctor anytime\nMonthly health report', featured: '' },
            ],
          }),
        ],
      },
    ],
  },
  { slug:'symptoms',        label:'ตรวจสอบอาการ',          description:'หน้า Symptom Checker',                icon:'🔍',  sections: simpleHero() },
  { slug:'medical-records', label:'ขอเวชระเบียน',          description:'หน้าขอสำเนาเวชระเบียน',               icon:'📄',  sections: simpleHero() },
  { slug:'bill-payment',    label:'ชำระค่าบริการ',         description:'หน้าชำระค่ารักษา',                    icon:'💳',  sections: simpleHero() },
  {
    slug: 'executive-health', label: 'Executive Health', description: 'หน้า Executive Health — เหตุผล + โปรแกรม 3 ระดับ', icon: '👔',
    sections: [
      ...simpleHero(),
      {
        key: 'why', label: 'ทำไมต้อง Executive Health', icon: '❓',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'), bi('para', 'ย่อหน้าอธิบาย', 'richtext'),
          bi('points', 'จุดเด่น (1 บรรทัด = 1 ข้อ)'),
          bi('stat_heading', 'หัวข้อการ์ดสถิติ'),
          list('shock_stats', 'สถิติน่าตกใจ', {
            itemName: 'สถิติ', itemLabelKey: 'label_th',
            itemFields: [mono('num', 'ตัวเลข'), bi('label', 'คำอธิบาย')],
            defaults: [
              { num: '68%', label_th: 'ของผู้บริหารไม่ตรวจสุขภาพครบถ้วนในรอบ 2 ปี', label_en: 'of executives skipped a full check-up in the last 2 years' },
              { num: '43%', label_th: 'มีภาวะความดันโลหิตสูงโดยไม่รู้ตัว', label_en: 'have undiagnosed high blood pressure' },
              { num: '31%', label_th: 'มีไขมันในเลือดสูงผิดปกติ', label_en: 'have abnormally high blood lipids' },
              { num: '1 ใน 5', label_th: 'มีความเสี่ยงโรคหัวใจในอีก 10 ปี', label_en: '1 in 5 face heart disease risk within 10 years' },
            ],
          }),
        ],
      },
      {
        key: 'programs', label: 'โปรแกรม 3 ระดับ', icon: '📦',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'), bi('note', 'หมายเหตุท้าย'),
          list('plans', 'โปรแกรม', {
            itemName: 'โปรแกรม', itemLabelKey: 'name',
            itemFields: [
              mono('name', 'ชื่อโปรแกรม'), mono('price', 'ราคา'), bi('badge', 'ป้าย (เช่น แนะนำ)'),
              mono('color', 'สี (hex)'), bi('items', 'รายการตรวจ (1 บรรทัด = 1 ข้อ)'),
            ],
            defaults: [
              { name: 'Executive Essential', price: '12,900', badge_th: '', color: '#0891B2', items_th: 'ตรวจเลือดครบ 40+ รายการ\nECG\nChest X-ray\nตรวจสายตา การได้ยิน\nBMI และองค์ประกอบร่างกาย\nตรวจปัสสาวะ อุจจาระ\nพบแพทย์อายุรกรรมสรุปผล', items_en: '40+ blood tests\nECG\nChest X-ray\nVision & hearing tests\nBMI & body composition\nUrine & stool tests\nResults review with internist' },
              { name: 'Executive Premium', price: '24,900', badge_th: 'แนะนำ', badge_en: 'Recommended', color: '#1B3A6B', items_th: 'ทุกอย่างใน Essential\nCT Calcium Score (ประเมินหัวใจ)\nEchocardiogram\nตรวจมะเร็งลำไส้ใหญ่ (Colonoscopy)\nTumor Markers 8 ชนิด\nBrain MRI\nพบแพทย์ผู้เชี่ยวชาญ 3 ท่าน\nรายงานโดยละเอียด + แผนสุขภาพ 1 ปี', items_en: 'Everything in Essential\nCT Calcium Score\nEchocardiogram\nColonoscopy\n8 tumor markers\nBrain MRI\n3 specialist consultations\nDetailed report + 1-year health plan' },
              { name: 'Executive Elite', price: '49,900', badge_th: 'ครบที่สุด', badge_en: 'Most Complete', color: '#8B5CF6', items_th: 'ทุกอย่างใน Premium\nFull Body MRI\nGenomic Risk Assessment (DNA)\nCoronary CT Angiography\nFunctional Medicine Panel\nปรึกษาโภชนาการ + แพลนออกกำลังกาย\nติดตามผลทุก 3 เดือนตลอด 1 ปี\nบริการ Concierge ตลอด 24 ชม.', items_en: 'Everything in Premium\nFull body MRI\nGenomic risk assessment (DNA)\nCoronary CT angiography\nFunctional medicine panel\nNutrition consult + exercise plan\nQuarterly follow-ups for 1 year\n24/7 concierge service' },
            ],
          }),
        ],
      },
      {
        key: 'cta', label: 'CTA องค์กร', icon: '📣',
        fields: [bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบาย')],
      },
    ],
  },
  {
    slug: 'loyalty', label: 'MediThai Card', description: 'หน้าโปรแกรมสะสมแต้ม — ระดับสมาชิก + วิธีสะสม', icon: '🎫',
    sections: [
      ...simpleHero(),
      {
        key: 'tiers', label: 'ระดับสมาชิก', icon: '🏅',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'ระดับ', {
            itemName: 'ระดับ', itemLabelKey: 'name',
            itemFields: [
              mono('name', 'ชื่อระดับ'), mono('emoji', 'Emoji'), mono('color', 'สี (hex)'),
              bi('thb', 'ยอดสะสม (เช่น 0–9,999)'), bi('points', 'อัตราแต้ม'),
              bi('perks', 'สิทธิประโยชน์ (1 บรรทัด = 1 ข้อ)'),
            ],
            defaults: [
              { name: 'Silver', emoji: '🥈', color: '#94A3B8', thb_th: '0–9,999', points_th: '1 แต้ม / 100 บาท', points_en: '1 pt / 100 THB', perks_th: 'ส่วนลด 5% แพ็กเกจ\nข่าวสารสมาชิก\nTelehealth ราคาพิเศษ', perks_en: '5% package discount\nMember newsletter\nSpecial Telehealth rates' },
              { name: 'Gold', emoji: '🥇', color: '#F59E0B', thb_th: '10,000–49,999', points_th: '1.5 แต้ม / 100 บาท', points_en: '1.5 pts / 100 THB', perks_th: 'ส่วนลด 10% แพ็กเกจ\nตรวจสุขภาพฟรี 1 ครั้ง/ปี\nPriority Queue\nTelehealth ฟรี 2 ครั้ง/ปี', perks_en: '10% package discount\nFree annual health check\nPriority queue\n2 free Telehealth visits/year' },
              { name: 'Platinum', emoji: '💠', color: '#0891B2', thb_th: '50,000–199,999', points_th: '2 แต้ม / 100 บาท', points_en: '2 pts / 100 THB', perks_th: 'ส่วนลด 15% ทุกบริการ\nตรวจสุขภาพ Premium ฟรี\nห้อง VIP หากนอนพัก\nDedicated Care Manager\nTelehealth ฟรีไม่จำกัด', perks_en: '15% off all services\nFree premium health check\nVIP room for admissions\nDedicated care manager\nUnlimited free Telehealth' },
              { name: 'Diamond', emoji: '💎', color: '#1B3A6B', thb_th: '200,000+ บาท/ปี', points_th: '3 แต้ม / 100 บาท', points_en: '3 pts / 100 THB', perks_th: 'ส่วนลด 20% ทุกบริการ\nExecutive Health ฟรี\nConcierge 24/7\nรถรับ-ส่ง VIP\nSecond Opinion ฟรี 1 ครั้ง/ปี\nครอบครัวร่วมได้รับสิทธิ์', perks_en: '20% off all services\nFree Executive Health\n24/7 concierge\nVIP transport\n1 free second opinion/year\nFamily benefits included' },
            ],
          }),
        ],
      },
      {
        key: 'earn', label: 'วิธีสะสมแต้ม + แลกแต้ม', icon: '💳',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'วิธีสะสม', {
            itemName: 'วิธีสะสม', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'), bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'stethoscope', color: '#0891B2', title_th: 'ค่าบริการตรวจรักษา', title_en: 'Medical Services', desc_th: 'ทุก 100 บาท = 1 แต้ม (ขึ้นอยู่กับระดับสมาชิก)', desc_en: 'Every 100 THB = 1 point (depending on tier)' },
              { icon: 'box-open', color: '#8B5CF6', title_th: 'ซื้อแพ็กเกจสุขภาพ', title_en: 'Health Packages', desc_th: 'แต้มโบนัส 2 เท่าสำหรับแพ็กเกจตรวจสุขภาพ', desc_en: 'Double bonus points on health check packages' },
              { icon: 'video', color: '#10B981', title_th: 'Telehealth', title_en: 'Telehealth', desc_th: 'ทุกครั้งที่ใช้บริการ Telehealth รับ 50 แต้ม', desc_en: 'Earn 50 points per Telehealth visit' },
              { icon: 'user-plus', color: '#F59E0B', title_th: 'แนะนำเพื่อน', title_en: 'Refer a Friend', desc_th: 'แนะนำเพื่อนสมัครสมาชิก รับ 200 แต้ม', desc_en: 'Earn 200 points per friend referral' },
            ],
          }),
          list('redeem', 'แลกแต้มเป็น', {
            itemName: 'รายการแลก', itemLabelKey: 'text_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), bi('text', 'ข้อความ')],
            defaults: [
              { icon: 'tag', text_th: '100 แต้ม = ส่วนลด ฿10', text_en: '100 pts = ฿10 discount' },
              { icon: 'heart-pulse', text_th: '500 แต้ม = ตรวจสุขภาพ Basic', text_en: '500 pts = Basic health check' },
              { icon: 'video', text_th: '1,000 แต้ม = Telehealth 1 ครั้ง', text_en: '1,000 pts = 1 Telehealth visit' },
            ],
          }),
        ],
      },
      {
        key: 'cta', label: 'CTA สมัครสมาชิก', icon: '📣',
        fields: [bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบาย'), bi('btn', 'ข้อความปุ่ม')],
      },
    ],
  },
  {
    slug: 'corporate', label: 'บริการองค์กร', description: 'หน้าบริการสุขภาพองค์กร — สถิติ บริการ แพ็กเกจ', icon: '🏢',
    sections: [
      ...simpleHero(),
      {
        key: 'stats', label: 'สถิติ 4 ช่อง', icon: '📊',
        fields: [
          list('items', 'สถิติ', {
            itemName: 'สถิติ', itemLabelKey: 'label_th',
            itemFields: [mono('num', 'ตัวเลข'), bi('label', 'ป้ายกำกับ'), mono('icon', 'ไอคอน (fa6-solid)')],
            defaults: [
              { num: '200+', label_th: 'องค์กรที่ไว้วางใจ', label_en: 'Trusted Organizations', icon: 'building-columns' },
              { num: '30,000+', label_th: 'พนักงานในโครงการ', label_en: 'Employees Covered', icon: 'users' },
              { num: '15%', label_th: 'ลดการลาป่วยโดยเฉลี่ย', label_en: 'Average Sick-Leave Reduction', icon: 'chart-line' },
              { num: '24/7', label_th: 'สายด่วนองค์กร', label_en: 'Corporate Hotline', icon: 'headset' },
            ],
          }),
        ],
      },
      {
        key: 'services', label: 'บริการองค์กร', icon: '⚕️',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'บริการ', {
            itemName: 'บริการ', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'), bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'heart-pulse', color: '#EF4444', title_th: 'ตรวจสุขภาพประจำปีพนักงาน', title_en: 'Annual Employee Health Checks', desc_th: 'โปรแกรมตรวจสุขภาพที่ออกแบบตามความต้องการขององค์กร พร้อมรายงาน dashboard สรุปผลสุขภาพหมู่คณะ', desc_en: 'Health-check programs tailored to your organization, with a dashboard summarizing group health.' },
              { icon: 'video', color: '#0891B2', title_th: 'Telehealth สำหรับพนักงาน', title_en: 'Telehealth for Employees', desc_th: 'พนักงานสามารถปรึกษาแพทย์ออนไลน์ได้ตลอดเวลา ลดการหยุดงานเพื่อไปโรงพยาบาล', desc_en: 'Employees can consult doctors online anytime — fewer hospital absences.' },
              { icon: 'user-doctor', color: '#8B5CF6', title_th: 'On-Site Medical Service', title_en: 'On-Site Medical Service', desc_th: 'ทีมแพทย์และพยาบาลมาให้บริการที่สำนักงาน ทำวัคซีน ตรวจเบื้องต้น และให้คำปรึกษา', desc_en: 'Doctors and nurses come to your office for vaccinations, screenings, and consultations.' },
              { icon: 'brain', color: '#10B981', title_th: 'โปรแกรมดูแลสุขภาพจิต', title_en: 'Mental Health Program', desc_th: 'บริการปรึกษาจิตแพทย์และนักจิตวิทยาสำหรับพนักงาน เพื่อลดความเครียดและ burnout', desc_en: 'Psychiatrist and psychologist consultations to reduce stress and burnout.' },
              { icon: 'chart-pie', color: '#F59E0B', title_th: 'Health Analytics Dashboard', title_en: 'Health Analytics Dashboard', desc_th: 'รายงานสถิติสุขภาพหมู่คณะ เทรนด์ความเสี่ยง และ ROI ของโปรแกรมสุขภาพ', desc_en: 'Group health statistics, risk trends, and wellness program ROI.' },
              { icon: 'shield-halved', color: '#1B3A6B', title_th: 'ประกันสุขภาพกลุ่ม', title_en: 'Group Health Insurance', desc_th: 'แพ็กเกจประกันสุขภาพกลุ่มร่วมกับบริษัทประกันชั้นนำ ครอบคลุมทั้งพนักงานและครอบครัว', desc_en: 'Group insurance packages with leading insurers, covering employees and families.' },
            ],
          }),
        ],
      },
      {
        key: 'packages', label: 'แพ็กเกจองค์กร', icon: '📦',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('plans', 'แพ็กเกจ', {
            itemName: 'แพ็กเกจ', itemLabelKey: 'name',
            itemFields: [
              mono('name', 'ชื่อแพ็กเกจ'), bi('size', 'ขนาดองค์กร'), mono('price', 'ราคา'), bi('per', 'หน่วย'),
              mono('color', 'สี (hex)'), mono('featured', 'แนะนำ? (yes)'),
              bi('inc', 'สิ่งที่รวม (1 บรรทัด = 1 ข้อ)'),
            ],
            defaults: [
              { name: 'SME Package', size_th: '5–49 คน', size_en: '5–49 employees', price: '2,900', per_th: 'บาท/ท่าน/ปี', per_en: 'THB/person/year', color: '#0891B2', featured: '', inc_th: 'ตรวจสุขภาพประจำปี Basic\nTelehealth ไม่จำกัดครั้ง\nสายด่วน HR 24/7\nรายงานสุขภาพหมู่คณะ', inc_en: 'Basic annual health check\nUnlimited Telehealth\n24/7 HR hotline\nGroup health report' },
              { name: 'Corporate Package', size_th: '50–499 คน', size_en: '50–499 employees', price: '4,900', per_th: 'บาท/ท่าน/ปี', per_en: 'THB/person/year', color: '#1B3A6B', featured: 'yes', inc_th: 'ตรวจสุขภาพประจำปี Premium\nTelehealth + On-Site visit 2 ครั้ง/ปี\nปรึกษาจิตแพทย์\nHealth Dashboard\nส่วนลดพิเศษสำหรับผู้บริหาร', inc_en: 'Premium annual health check\nTelehealth + 2 on-site visits/year\nPsychiatrist consultations\nHealth dashboard\nExecutive discounts' },
              { name: 'Enterprise Package', size_th: '500+ คน', size_en: '500+ employees', price: 'ติดต่อ', per_th: 'ราคาพิเศษ', per_en: 'Custom pricing', color: '#8B5CF6', featured: '', inc_th: 'ออกแบบโปรแกรมเฉพาะองค์กร\nทีม Account Manager ประจำ\nOn-Site Clinic\nIntegration กับ HR System\nSLA ระดับ Enterprise', inc_en: 'Custom program design\nDedicated account manager\nOn-site clinic\nHR system integration\nEnterprise SLA' },
            ],
          }),
        ],
      },
    ],
  },
  { slug:'health-library',  label:'คลังความรู้',           description:'หน้าบทความสุขภาพ',                    icon:'📚',  sections: simpleHero() },
  { slug:'calculators',     label:'โปรแกรมคำนวณ',          description:'หน้าเครื่องมือคำนวณสุขภาพ',           icon:'🧮',  sections: simpleHero() },
  {
    slug: 'patient-stories', label: 'เรื่องราวผู้ป่วย', description: 'หน้า Patient Stories — สถิติ + เรื่องราว + CTA', icon: '💬',
    sections: [
      ...simpleHero(),
      {
        key: 'stats', label: 'สถิติ 4 ช่อง', icon: '📊',
        fields: [
          list('items', 'สถิติ', {
            itemName: 'สถิติ', itemLabelKey: 'label_th',
            itemFields: [mono('num', 'ตัวเลข'), bi('label', 'ป้ายกำกับ'), mono('icon', 'ไอคอน (fa6-solid)')],
            defaults: [
              { num: '98%', label_th: 'ความพึงพอใจผู้ป่วย', label_en: 'Patient Satisfaction', icon: 'face-smile' },
              { num: '50,000+', label_th: 'ผู้ป่วยที่ดูแลต่อปี', label_en: 'Patients Cared per Year', icon: 'users' },
              { num: '200+', label_th: 'แพทย์เชี่ยวชาญ', label_en: 'Specialist Doctors', icon: 'user-doctor' },
              { num: '6', label_th: 'โรงพยาบาลในเครือ', label_en: 'Network Hospitals', icon: 'hospital' },
            ],
          }),
        ],
      },
      {
        key: 'stories', label: 'เรื่องราวผู้ป่วย', icon: '💬',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบายใต้หัวข้อ'),
          list('items', 'เรื่องราว', {
            itemName: 'เรื่องราว', itemLabelKey: 'name_th',
            itemFields: [
              bi('name', 'ชื่อผู้ป่วย'), bi('condition', 'โรค/การรักษา'), bi('hospital', 'โรงพยาบาล'),
              bi('quote', 'คำพูดผู้ป่วย'), bi('detail', 'รายละเอียดการรักษา'),
              mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'),
            ],
            defaults: [
              { name_th: 'คุณสมชาย วงศ์สุวรรณ', name_en: 'Mr. Somchai Wongsuwan', condition_th: 'โรคหัวใจ', condition_en: 'Heart Disease', hospital_th: 'MediThai หัวใจ', hospital_en: 'MediThai Heart', quote_th: 'หมอบอกว่าหัวใจผมตีบ 3 เส้น ต้องผ่าตัดด่วน ทีมแพทย์ MediThai ช่วยชีวิตผมไว้ได้ ตอนนี้กลับไปเล่นกีฬาได้ตามปกติแล้ว', quote_en: 'My doctor said I had triple vessel disease and needed urgent surgery. The MediThai team saved my life. I\'m back to playing sports normally now.', detail_th: 'คุณสมชายเข้ารับการผ่าตัดทำทางเบี่ยงหลอดเลือดหัวใจ (CABG) สำเร็จด้วยเทคนิค Minimally Invasive ใช้เวลาพักฟื้นเพียง 5 วัน', detail_en: 'Successful CABG bypass surgery using minimally invasive technique — recovered in just 5 days.', icon: 'heart-pulse', color: '#EF4444' },
              { name_th: 'คุณลดาวัลย์ พงษ์ประยูร', name_en: 'Ms. Ladawan Pongprayoon', condition_th: 'มะเร็งเต้านม', condition_en: 'Breast Cancer', hospital_th: 'MediThai มะเร็ง', hospital_en: 'MediThai Cancer', quote_th: 'ตรวจพบมะเร็งระยะแรก เพราะเข้าตรวจกับโปรแกรม AI Mammography ของ MediThai รักษาหายเลยโดยไม่ต้องผ่าตัดเอาเต้านมออก', quote_en: 'My cancer was found early thanks to MediThai\'s AI Mammography program. I was treated successfully without mastectomy.', detail_th: 'พบมะเร็งระยะ 1A จากการตรวจคัดกรองด้วย AI เข้ารับการรักษาด้วยการผ่าตัดแบบอนุรักษ์ร่วมกับรังสีรักษา ปัจจุบันครบ 3 ปีโดยไม่มีการกลับเป็นซ้ำ', detail_en: 'Stage 1A cancer found via AI screening; treated with breast-conserving surgery and radiotherapy. 3 years with no recurrence.', icon: 'ribbon', color: '#8B5CF6' },
              { name_th: 'คุณปิยะ แสงทอง', name_en: 'Mr. Piya Saengthong', condition_th: 'โรคหลอดเลือดสมอง', condition_en: 'Stroke', hospital_th: 'MediThai สมองและกระดูก', hospital_en: 'MediThai Spine', quote_th: 'เกิดอาการ stroke กลางดึก ถูกนำส่งมาที่ MediThai ภายใน 30 นาที ทีม stroke fast track ให้ยาละลายลิ่มเลือดทันเวลา ตอนนี้ฟื้นตัวสมบูรณ์แล้ว', quote_en: 'I had a stroke in the middle of the night. The stroke fast track team gave me clot-busting medication in time. I\'ve fully recovered.', detail_th: 'เข้าสู่ Stroke Fast Track ภายใน 45 นาที ได้รับยา tPA ทางหลอดเลือดดำสำเร็จ ฟื้นตัวเต็ม 100% ภายใน 1 เดือน', detail_en: 'Entered Stroke Fast Track within 45 minutes, received IV tPA successfully — 100% recovery in 1 month.', icon: 'brain', color: '#10B981' },
              { name_th: 'คุณวรรณา เมืองมา', name_en: 'Ms. Wanna Muangma', condition_th: 'เปลี่ยนข้อเข่า', condition_en: 'Knee Replacement', hospital_th: 'MediThai สมองและกระดูก', hospital_en: 'MediThai Spine', quote_th: 'ปวดเข่ามา 10 ปี เดินลำบากมาก พอได้ผ่าตัดเปลี่ยนข้อเข่าด้วยหุ่นยนต์กับ MediThai แค่ 6 สัปดาห์ก็ออกไปเดินห้างได้แล้ว', quote_en: 'I suffered knee pain for 10 years. After robotic knee replacement at MediThai, I was walking in the mall after just 6 weeks.', detail_th: 'ได้รับการผ่าตัดเปลี่ยนข้อเข่าเทียมด้วยหุ่นยนต์ ROSA ความแม่นยำสูง ฟื้นตัวเร็วกว่าวิธีทั่วไป 40%', detail_en: 'ROSA robotic knee replacement with high precision — 40% faster recovery than conventional surgery.', icon: 'person-walking', color: '#2554A0' },
              { name_th: 'คุณเจมส์ แอนเดอร์สัน', name_en: 'Mr. James Anderson', condition_th: 'ตรวจสุขภาพประจำปี', condition_en: 'Annual Health Check', hospital_th: 'MediThai กรุงเทพ', hospital_en: 'MediThai Bangkok', quote_th: 'As an expat in Bangkok, I was worried about finding quality healthcare. MediThai\'s staff speak excellent English, the facilities are world-class, and results came back same day.', quote_en: 'As an expat in Bangkok, I was worried about finding quality healthcare. MediThai\'s staff speak excellent English, the facilities are world-class, and results came back same day.', detail_th: 'ตรวจพบ pre-diabetes ในระยะแรก ได้รับคำแนะนำและแผนการดูแลสุขภาพเฉพาะบุคคล ปัจจุบันค่าน้ำตาลกลับสู่ปกติ', detail_en: 'Early pre-diabetes detected; received a personalized health plan. Blood sugar now back to normal.', icon: 'microscope', color: '#0891B2' },
              { name_th: 'คุณมนัสนันท์ ดีเจริญ', name_en: 'Ms. Manatsanan Deecharoen', condition_th: 'มะเร็งปอด', condition_en: 'Lung Cancer', hospital_th: 'MediThai มะเร็ง', hospital_en: 'MediThai Cancer', quote_th: 'ไม่เคยสูบบุหรี่เลยแต่เป็นมะเร็งปอด แพทย์ MediThai ผ่าตัดด้วยหุ่นยนต์ da Vinci บาดแผลเล็กมาก กลับบ้านได้ใน 3 วัน ชีวิตปกติทุกอย่าง', quote_en: 'I never smoked but got lung cancer. MediThai doctors operated with the da Vinci robot — tiny incisions, home in 3 days, life completely normal.', detail_th: 'ตรวจพบมะเร็งปอดระยะ 1B จาก Low-dose CT scan ผ่าตัดด้วยหุ่นยนต์ da Vinci ใช้เวลาพักฟื้น 3 วัน ผลการรักษาดีเยี่ยม', detail_en: 'Stage 1B lung cancer found via low-dose CT; da Vinci robotic surgery, 3-day recovery, excellent outcome.', icon: 'lungs', color: '#F59E0B' },
            ],
          }),
        ],
      },
      {
        key: 'cta', label: 'CTA แชร์เรื่องราว', icon: '📣',
        fields: [bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบาย'), bi('btn', 'ข้อความปุ่ม')],
      },
    ],
  },
  {
    slug: 'about', label: 'เกี่ยวกับเรา', description: 'หน้าเกี่ยวกับ MediThai — ครบทุก section', icon: 'ℹ️',
    sections: [
      ...simpleHero(),
      {
        key: 'intro', label: 'แนะนำองค์กร + สถิติ', icon: '🏢',
        fields: [
          bi('tag', 'แท็กหัวข้อ'),
          bi('heading', 'หัวข้อใหญ่'),
          bi('para1', 'ย่อหน้า 1', 'richtext'),
          bi('para2', 'ย่อหน้า 2', 'richtext'),
          list('stats', 'สถิติ 4 ช่อง', {
            itemName: 'สถิติ', itemLabelKey: 'label_th',
            itemFields: [mono('num', 'ตัวเลข'), mono('suffix', 'ต่อท้าย (เช่น +)'), bi('label', 'ป้ายกำกับ')],
            defaults: [
              { num: '25', suffix: '', label_th: 'ปีแห่งประสบการณ์', label_en: 'Years of Experience' },
              { num: '200', suffix: '+', label_th: 'แพทย์เชี่ยวชาญ', label_en: 'Specialist Doctors' },
              { num: '6', suffix: '', label_th: 'โรงพยาบาลในเครือ', label_en: 'Network Hospitals' },
              { num: '50000', suffix: '', label_th: 'ผู้ป่วยต่อปี', label_en: 'Patients per Year' },
            ],
          }),
        ],
      },
      {
        key: 'vmv', label: 'วิสัยทัศน์ พันธกิจ ค่านิยม', icon: '🎯',
        fields: [
          bi('heading', 'หัวข้อการ์ด'),
          bi('vision', 'วิสัยทัศน์', 'richtext'),
          bi('mission', 'พันธกิจ', 'richtext'),
          list('values', 'ค่านิยม', {
            itemName: 'ค่านิยม', itemLabelKey: 'text_th',
            itemFields: [bi('text', 'ข้อความ')],
            defaults: [
              { text_th: 'Excellence — ความเป็นเลิศทางการแพทย์', text_en: 'Excellence — Medical excellence' },
              { text_th: 'Care — ดูแลด้วยหัวใจ', text_en: 'Care — Caring with heart' },
              { text_th: 'Innovation — นวัตกรรมต่อเนื่อง', text_en: 'Innovation — Continuous innovation' },
              { text_th: 'Integrity — ซื่อสัตย์โปร่งใส', text_en: 'Integrity — Honest and transparent' },
            ],
          }),
        ],
      },
      {
        key: 'mission_cards', label: 'พันธกิจ 3 การ์ด', icon: '🃏',
        fields: [
          bi('tag', 'แท็กหัวข้อ'),
          bi('heading', 'หัวข้อ'),
          list('cards', 'การ์ดพันธกิจ', {
            itemName: 'การ์ด', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (ชื่อ fa6-solid)'), bi('title', 'หัวข้อการ์ด'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'magnifying-glass-plus', title_th: 'วินิจฉัยแม่นยำ', title_en: 'Accurate Diagnosis', desc_th: 'เทคโนโลยีการวินิจฉัยระดับโลก AI-assisted imaging, Genomics และการวิเคราะห์ที่แม่นยำ ให้คุณได้รับการรักษาที่ถูกต้องตั้งแต่ต้น', desc_en: 'World-class diagnostic technology — AI-assisted imaging, genomics, and precise analysis so you receive the right treatment from the start.' },
              { icon: 'hand-holding-heart', title_th: 'รักษาด้วยความเอาใจใส่', title_en: 'Care with Compassion', desc_th: 'ทีมแพทย์และพยาบาลที่พร้อมดูแลคุณอย่างใกล้ชิด ด้วยความเมตตาและความเชี่ยวชาญที่ได้รับการยอมรับในระดับสากล', desc_en: 'Doctors and nurses who care for you closely, with internationally recognized compassion and expertise.' },
              { icon: 'rocket', title_th: 'นวัตกรรมต่อเนื่อง', title_en: 'Continuous Innovation', desc_th: 'ลงทุนในการวิจัยและพัฒนาเทคโนโลยีการแพทย์อย่างต่อเนื่อง เพื่อให้ผู้ป่วยได้รับการรักษาที่ดีที่สุดในทุกยุค', desc_en: 'Continuous investment in medical research and technology so patients always receive the best available care.' },
            ],
          }),
        ],
      },
      {
        key: 'timeline', label: 'ประวัติความเป็นมา (Timeline)', icon: '🕰️',
        fields: [
          bi('tag', 'แท็กหัวข้อ'),
          bi('heading', 'หัวข้อ'),
          list('items', 'เหตุการณ์', {
            itemName: 'เหตุการณ์', itemLabelKey: 'title_th',
            itemFields: [mono('year', 'ปี (เช่น 2544 / 2001)'), bi('title', 'หัวข้อ'), bi('desc', 'รายละเอียด')],
            defaults: [
              { year: '2544 / 2001', title_th: 'ก่อตั้งโรงพยาบาล MediThai กรุงเทพ', title_en: 'MediThai Bangkok founded', desc_th: 'เปิดให้บริการในฐานะโรงพยาบาลเอกชนขนาด 200 เตียง ย่านเพชรบุรีตัดใหม่', desc_en: 'Opened as a 200-bed private hospital in the New Phetchaburi area.' },
              { year: '2550 / 2007', title_th: 'ขยายเป็น "เครือโรงพยาบาล"', title_en: 'Became a hospital network', desc_th: 'เปิด MediThai หัวใจ — โรงพยาบาลเฉพาะทางด้านโรคหัวใจแห่งแรก', desc_en: 'Opened MediThai Heart — the first specialized heart hospital.' },
              { year: '2556 / 2013', title_th: 'ได้รับการรับรอง JCI ครั้งแรก', title_en: 'First JCI accreditation', desc_th: 'โรงพยาบาลเอกชนไทยลำดับที่ 3 ที่ผ่าน Joint Commission International', desc_en: 'The 3rd Thai private hospital accredited by Joint Commission International.' },
              { year: '2560 / 2017', title_th: 'เปิด MediThai มะเร็ง + สมองฯ', title_en: 'Opened MediThai Cancer + Spine', desc_th: 'นำหุ่นยนต์ da Vinci มาใช้เป็นรายแรกในภูมิภาค', desc_en: 'First in the region to adopt the da Vinci surgical robot.' },
              { year: '2565 / 2022', title_th: 'ติด Newsweek World\'s Best Hospitals', title_en: 'Listed in Newsweek World\'s Best Hospitals', desc_th: 'ได้รับการจัดอันดับเป็น 1 ใน 10 โรงพยาบาลดีที่สุดในเอเชีย', desc_en: 'Ranked among the top 10 hospitals in Asia.' },
              { year: '2569 / 2026', title_th: 'เปิด MediThai เชียงใหม่', title_en: 'Opened MediThai Chiang Mai', desc_th: 'ขยายสู่ภาคเหนือ รองรับผู้ป่วยนานาชาติและ Medical Tourism', desc_en: 'Expanded to the North, serving international patients and medical tourism.' },
            ],
          }),
        ],
      },
      {
        key: 'accreditations', label: 'รางวัลและการรับรอง', icon: '🏆',
        fields: [
          bi('tag', 'แท็กหัวข้อ'),
          bi('heading', 'หัวข้อ'),
          list('items', 'การรับรอง', {
            itemName: 'การรับรอง', itemLabelKey: 'title',
            itemFields: [mono('emoji', 'Emoji'), mono('title', 'ชื่อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { emoji: '🏆', title: 'Newsweek', desc_th: "World's Best Hospital 2024 · 2025 · 2026", desc_en: "World's Best Hospital 2024 · 2025 · 2026" },
              { emoji: '🌐', title: 'JCI', desc_th: 'Joint Commission International Accredited Hospital', desc_en: 'Joint Commission International Accredited Hospital' },
              { emoji: '🇹🇭', title: 'HA Thailand', desc_th: 'Hospital Accreditation ทุก 6 สาขา', desc_en: 'Hospital Accreditation — all 6 branches' },
              { emoji: '📋', title: 'ISO 9001:2015', desc_th: 'Quality Management System Certified', desc_en: 'Quality Management System Certified' },
              { emoji: '🔬', title: 'CAP', desc_th: 'College of American Pathologists Lab Accreditation', desc_en: 'College of American Pathologists Lab Accreditation' },
              { emoji: '💊', title: 'FDA Thailand', desc_th: 'ได้รับการรับรองจาก อย. ประเทศไทย', desc_en: 'Certified by the Thai FDA' },
              { emoji: '🌿', title: 'Green Hospital', desc_th: 'มาตรฐานโรงพยาบาลสีเขียว ระดับ Gold', desc_en: 'Green Hospital standard — Gold level' },
              { emoji: '♿', title: 'Barrier-Free', desc_th: 'มาตรฐานความสะดวกสำหรับผู้พิการ ระดับ A', desc_en: 'Accessibility standard — Level A' },
            ],
          }),
        ],
      },
      {
        key: 'leadership', label: 'ทีมผู้บริหาร', icon: '👥',
        fields: [
          bi('tag', 'แท็กหัวข้อ'),
          bi('heading', 'หัวข้อ'),
          list('people', 'ผู้บริหาร', {
            itemName: 'ผู้บริหาร', itemLabelKey: 'name_th',
            itemFields: [bi('name', 'ชื่อ'), bi('role', 'ตำแหน่ง'), mono('photo', 'รูปถ่าย', 'image')],
            defaults: [
              { name_th: 'ศ.นพ. วิชัย มหาสิริพงศ์', name_en: 'Prof. Dr. Wichai Mahasiripong', role_th: 'ประธานกรรมการบริหาร (CEO)', role_en: 'Chief Executive Officer (CEO)', photo: '' },
              { name_th: 'รศ.พญ. สุนิสา ธาราทิพย์', name_en: 'Assoc. Prof. Dr. Sunisa Tharathip', role_th: 'ผู้อำนวยการแพทย์ (CMO)', role_en: 'Chief Medical Officer (CMO)', photo: '' },
              { name_th: 'นาย ธนกฤต วิวัฒน์กุล', name_en: 'Mr. Thanakrit Wiwatkul', role_th: 'ผู้อำนวยการฝ่ายปฏิบัติการ (COO)', role_en: 'Chief Operating Officer (COO)', photo: '' },
              { name_th: 'นางสาว ปภาวรินทร์ เลิศมงคล', name_en: 'Ms. Papawarin Lertmongkol', role_th: 'ผู้อำนวยการฝ่ายการเงิน (CFO)', role_en: 'Chief Financial Officer (CFO)', photo: '' },
            ],
          }),
        ],
      },
    ],
  },
  {
    slug: 'expat-hub', label: 'Expat Hub', description: 'หน้า Healthcare for Expats — บริการ ประกัน รีวิว', icon: '🌍',
    sections: [
      ...simpleHero(),
      {
        key: 'services', label: 'บริการสำหรับ Expat', icon: '⚕️',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'บริการ', {
            itemName: 'บริการ', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'), bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'language', color: '#0891B2', title_th: 'English-Speaking Doctors', title_en: 'English-Speaking Doctors', desc_th: 'Our entire team communicates in English. Many doctors also speak Japanese, Chinese, Korean, and German.', desc_en: 'Our entire team communicates in English. Many doctors also speak Japanese, Chinese, Korean, and German.' },
              { icon: 'shield-halved', color: '#8B5CF6', title_th: 'International Insurance', title_en: 'International Insurance', desc_th: 'We work directly with AXA, BUPA, Cigna, Allianz, AIA, and 50+ international insurance providers for cashless billing.', desc_en: 'We work directly with AXA, BUPA, Cigna, Allianz, AIA, and 50+ international insurance providers for cashless billing.' },
              { icon: 'plane-arrival', color: '#10B981', title_th: 'Medical Visa Support', title_en: 'Medical Visa Support', desc_th: 'We provide medical certificates and documentation required for medical visa applications and extensions.', desc_en: 'We provide medical certificates and documentation required for medical visa applications and extensions.' },
              { icon: 'truck-medical', color: '#EF4444', title_th: 'Air Ambulance & Evacuation', title_en: 'Air Ambulance & Evacuation', desc_th: '24/7 coordination for medical evacuation to your home country if needed.', desc_en: '24/7 coordination for medical evacuation to your home country if needed.' },
              { icon: 'person-walking-with-cane', color: '#F59E0B', title_th: 'Continuity of Care', title_en: 'Continuity of Care', desc_th: 'We request your overseas medical records and ensure seamless continuation of your treatment plan.', desc_en: 'We request your overseas medical records and ensure seamless continuation of your treatment plan.' },
              { icon: 'video', color: '#1B3A6B', title_th: 'Telehealth in English', title_en: 'Telehealth in English', desc_th: 'Consult our English-speaking doctors online from anywhere in Thailand, 7 days a week.', desc_en: 'Consult our English-speaking doctors online from anywhere in Thailand, 7 days a week.' },
            ],
          }),
        ],
      },
      {
        key: 'insurance', label: 'บริษัทประกันที่รับ', icon: '🛡️',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบาย'), bi('note', 'ข้อความท้าย'),
          list('items', 'บริษัทประกัน', {
            itemName: 'บริษัท', itemLabelKey: 'name',
            itemFields: [mono('name', 'ชื่อบริษัท')],
            defaults: ['AXA', 'BUPA', 'Cigna', 'Allianz', 'AIA International', 'Pacific Cross', 'MSH International', 'Henner', 'APRIL International', 'Generali', 'Aetna', 'William Russell'].map(n => ({ name: n })),
          }),
        ],
      },
      {
        key: 'testimonials', label: 'รีวิวจาก Expat', icon: '💬',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'รีวิว', {
            itemName: 'รีวิว', itemLabelKey: 'name',
            itemFields: [mono('name', 'ชื่อ'), mono('flag', 'ธง emoji'), mono('country', 'ประเทศ'), bi('quote', 'คำพูด')],
            defaults: [
              { name: 'James Anderson', flag: '🇬🇧', country: 'UK', quote_th: 'The English-speaking staff and same-day results made all the difference. MediThai feels as good as any hospital back home — actually better.', quote_en: 'The English-speaking staff and same-day results made all the difference. MediThai feels as good as any hospital back home — actually better.' },
              { name: 'Yuki Tanaka', flag: '🇯🇵', country: 'Japan', quote_th: '日本語対応のスタッフもいて、健康診断から治療まですべてスムーズでした。バンコクでの医療体験は最高です。', quote_en: '日本語対応のスタッフもいて、健康診断から治療まですべてスムーズでした。バンコクでの医療体験は最高です。' },
              { name: 'Michael Chen', flag: '🇺🇸', country: 'USA', quote_th: 'Cigna direct billing worked perfectly. No forms to fill, no waiting for reimbursement. The quality of care rivals any hospital in the US.', quote_en: 'Cigna direct billing worked perfectly. No forms to fill, no waiting for reimbursement. The quality of care rivals any hospital in the US.' },
            ],
          }),
        ],
      },
      {
        key: 'cta', label: 'International Patient Center', icon: '📞',
        fields: [bi('heading', 'หัวข้อ'), bi('sub', 'คำอธิบาย'), mono('phone', 'เบอร์โทร'), mono('email', 'อีเมล')],
      },
    ],
  },
  {
    slug: 'careers', label: 'ร่วมงานกับเรา', description: 'หน้าสมัครงาน — ตำแหน่งงาน + สวัสดิการ', icon: '💼',
    sections: [
      ...simpleHero(),
      {
        key: 'benefits', label: 'สวัสดิการ', icon: '🎁',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'สวัสดิการ', {
            itemName: 'สวัสดิการ', itemLabelKey: 'title_th',
            itemFields: [mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'), bi('title', 'หัวข้อ'), bi('desc', 'คำอธิบาย')],
            defaults: [
              { icon: 'hand-holding-medical', color: '#0891B2', title_th: 'ตรวจสุขภาพฟรีทุกปี', title_en: 'Free Annual Health Check', desc_th: 'พนักงานและครอบครัวได้รับสิทธิ์ตรวจสุขภาพฟรีทุกปี', desc_en: 'Free annual health checks for employees and family.' },
              { icon: 'graduation-cap', color: '#8B5CF6', title_th: 'ทุนการศึกษา', title_en: 'Education Grants', desc_th: 'ทุนสนับสนุนการอบรมและพัฒนาวิชาชีพต่อเนื่อง', desc_en: 'Grants for training and continuous professional development.' },
              { icon: 'coins', color: '#F59E0B', title_th: 'โบนัสและสวัสดิการ', title_en: 'Bonus & Benefits', desc_th: 'โบนัสประจำปี เบี้ยเลี้ยง และสวัสดิการที่แข่งขันได้', desc_en: 'Annual bonus, allowances, and competitive benefits.' },
              { icon: 'scale-balanced', color: '#10B981', title_th: 'Work-Life Balance', title_en: 'Work-Life Balance', desc_th: 'วันหยุดพักร้อน ลาป่วย และความยืดหยุ่นในการทำงาน', desc_en: 'Vacation, sick leave, and flexible working.' },
              { icon: 'users', color: '#EF4444', title_th: 'ทีมที่แข็งแกร่ง', title_en: 'Strong Team', desc_th: 'ทำงานร่วมกับแพทย์และผู้เชี่ยวชาญระดับนานาชาติ', desc_en: 'Work alongside international doctors and experts.' },
              { icon: 'chart-line', color: '#1B3A6B', title_th: 'ความก้าวหน้าในสายอาชีพ', title_en: 'Career Growth', desc_th: 'เส้นทางอาชีพที่ชัดเจนและโอกาสเติบโต', desc_en: 'Clear career paths and growth opportunities.' },
              { icon: 'building-columns', color: '#EA580C', title_th: 'เทคโนโลยีล้ำสมัย', title_en: 'Cutting-edge Technology', desc_th: 'ทำงานกับเครื่องมือและเทคโนโลยีการแพทย์ที่ทันสมัยที่สุด', desc_en: 'Work with the most advanced medical technology.' },
              { icon: 'earth-asia', color: '#059669', title_th: 'เครือข่ายระดับโลก', title_en: 'Global Network', desc_th: 'โอกาสแลกเปลี่ยนกับโรงพยาบาลชั้นนำต่างประเทศ', desc_en: 'Exchange opportunities with leading hospitals abroad.' },
            ],
          }),
        ],
      },
      {
        key: 'jobs', label: 'ตำแหน่งงาน', icon: '📋',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          bi('cta_text', 'ข้อความท้าย (ส่ง Resume)'),
          list('items', 'ตำแหน่งงาน', {
            itemName: 'ตำแหน่งงาน', itemLabelKey: 'title_th',
            itemFields: [
              bi('title', 'ชื่อตำแหน่ง'), bi('dept', 'แผนก'), bi('location', 'สถานที่'),
              mono('type', 'ประเภท (Full-time)'), mono('color', 'สี (hex)'), mono('urgent', 'ด่วน? (yes เพื่อแสดงป้าย)'),
            ],
            defaults: [
              { title_th: 'พยาบาลวิชาชีพ (ICU หัวใจ)', title_en: 'Registered Nurse (Cardiac ICU)', dept_th: 'ศูนย์หัวใจ', dept_en: 'Heart Center', location_th: 'MediThai หัวใจ', location_en: 'MediThai Heart', type: 'Full-time', color: '#EF4444', urgent: 'yes' },
              { title_th: 'นักรังสีการแพทย์', title_en: 'Radiologic Technologist', dept_th: 'ศูนย์มะเร็ง', dept_en: 'Cancer Center', location_th: 'MediThai มะเร็ง', location_en: 'MediThai Cancer', type: 'Full-time', color: '#8B5CF6', urgent: '' },
              { title_th: 'Full Stack Developer', title_en: 'Full Stack Developer', dept_th: 'เทคโนโลยีสารสนเทศ', dept_en: 'Information Technology', location_th: 'MediThai กรุงเทพ / Remote', location_en: 'MediThai Bangkok / Remote', type: 'Full-time', color: '#0891B2', urgent: '' },
              { title_th: 'นักกายภาพบำบัด', title_en: 'Physical Therapist', dept_th: 'ศูนย์กระดูกและข้อ', dept_en: 'Orthopedic Center', location_th: 'MediThai สมองและกระดูก', location_en: 'MediThai Spine', type: 'Full-time', color: '#2554A0', urgent: '' },
              { title_th: 'แพทย์ประจำบ้าน (Resident Doctor)', title_en: 'Resident Doctor', dept_th: 'อายุรกรรม', dept_en: 'Internal Medicine', location_th: 'MediThai กรุงเทพ', location_en: 'MediThai Bangkok', type: 'Full-time', color: '#16A34A', urgent: 'yes' },
              { title_th: 'เจ้าหน้าที่ประสานงานผู้ป่วยต่างชาติ (EN/CN/JP)', title_en: 'International Patient Coordinator (EN/CN/JP)', dept_th: 'บริหาร', dept_en: 'Administration', location_th: 'MediThai กรุงเทพ', location_en: 'MediThai Bangkok', type: 'Full-time', color: '#F59E0B', urgent: '' },
              { title_th: 'กุมารแพทย์', title_en: 'Pediatrician', dept_th: 'ศูนย์เด็ก', dept_en: 'Children\'s Center', location_th: 'MediThai เด็ก', location_en: 'MediThai Children', type: 'Full-time', color: '#10B981', urgent: '' },
              { title_th: 'Digital Marketing Specialist', title_en: 'Digital Marketing Specialist', dept_th: 'การตลาด', dept_en: 'Marketing', location_th: 'MediThai กรุงเทพ', location_en: 'MediThai Bangkok', type: 'Full-time', color: '#1B3A6B', urgent: '' },
            ],
          }),
        ],
      },
    ],
  },
  {
    slug: 'giving', label: 'ร่วมสนับสนุน', description: 'หน้ากองทุน — ผลงาน + โครงการ', icon: '❤️',
    sections: [
      ...simpleHero(),
      {
        key: 'impact', label: 'ตัวเลขผลงาน', icon: '📊',
        fields: [
          list('items', 'ตัวเลข', {
            itemName: 'ตัวเลข', itemLabelKey: 'label_th',
            itemFields: [mono('num', 'ตัวเลข'), bi('label', 'ป้ายกำกับ'), mono('icon', 'ไอคอน (fa6-solid)')],
            defaults: [
              { num: '2,400+', label_th: 'ผู้ป่วยได้รับการช่วยเหลือ', label_en: 'Patients Helped', icon: 'users' },
              { num: '฿45M+', label_th: 'มูลค่าความช่วยเหลือรวม', label_en: 'Total Aid Value', icon: 'hand-holding-heart' },
              { num: '12', label_th: 'โครงการที่ดำเนินอยู่', label_en: 'Active Programs', icon: 'list-check' },
              { num: '98%', label_th: 'ของเงินบริจาคถึงผู้รับ', label_en: 'Of Donations Reach Recipients', icon: 'circle-check' },
            ],
          }),
        ],
      },
      {
        key: 'programs', label: 'โครงการ', icon: '🤝',
        fields: [
          bi('tag', 'แท็กหัวข้อ'), bi('heading', 'หัวข้อ'),
          list('items', 'โครงการ', {
            itemName: 'โครงการ', itemLabelKey: 'title_th',
            itemFields: [
              mono('icon', 'ไอคอน (fa6-solid)'), mono('color', 'สี (hex)'),
              bi('title', 'ชื่อโครงการ'), bi('desc', 'คำอธิบาย'), mono('funded', '% ที่ได้รับทุนแล้ว (ตัวเลข)'),
            ],
            defaults: [
              { icon: 'child', color: '#10B981', title_th: 'เด็กขาดแคลนเข้าถึงการรักษา', title_en: 'Care Access for Underprivileged Children', desc_th: 'สนับสนุนค่ารักษาพยาบาลให้เด็กจากครอบครัวรายได้น้อยที่ป่วยด้วยโรคหัวใจ มะเร็ง และโรคเรื้อรัง', desc_en: 'Covering medical costs for children from low-income families with heart disease, cancer, and chronic illness.', funded: '68' },
              { icon: 'person-cane', color: '#0891B2', title_th: 'ผู้สูงอายุขาดแคลน', title_en: 'Underprivileged Elderly', desc_th: 'ช่วยเหลือผู้สูงอายุที่ไม่มีบัตรประกันสุขภาพหรือมีรายได้ไม่พอค่ารักษาให้เข้าถึงการดูแลสุขภาพ', desc_en: 'Helping elderly without health coverage or sufficient income access healthcare.', funded: '82' },
              { icon: 'graduation-cap', color: '#8B5CF6', title_th: 'ทุนการศึกษาพยาบาล', title_en: 'Nursing Scholarships', desc_th: 'มอบทุนการศึกษาให้นักศึกษาพยาบาลและแพทย์ที่มีความสามารถแต่ขาดแคลนทุนทรัพย์', desc_en: 'Scholarships for talented nursing and medical students in need.', funded: '45' },
              { icon: 'earth-asia', color: '#F59E0B', title_th: 'แพทย์อาสาชนบท', title_en: 'Rural Volunteer Doctors', desc_th: 'สนับสนุนโครงการส่งแพทย์และพยาบาลอาสาให้บริการประชาชนในพื้นที่ห่างไกล', desc_en: 'Sending volunteer doctors and nurses to serve remote communities.', funded: '55' },
              { icon: 'flask', color: '#EF4444', title_th: 'ทุนวิจัยทางการแพทย์', title_en: 'Medical Research Grants', desc_th: 'สนับสนุนการวิจัยโรคมะเร็งและโรคหัวใจ เพื่อพัฒนาวิธีการรักษาที่ดีขึ้นในอนาคต', desc_en: 'Funding cancer and heart disease research for better future treatments.', funded: '30' },
              { icon: 'house-chimney-medical', color: '#1B3A6B', title_th: 'คลินิกชุมชนฟรี', title_en: 'Free Community Clinics', desc_th: 'สนับสนุนคลินิกตรวจสุขภาพฟรีในชุมชนรายได้น้อย 3 ครั้งต่อปี', desc_en: 'Free health-check clinics in low-income communities, 3 times a year.', funded: '72' },
            ],
          }),
        ],
      },
    ],
  },
  { slug:'locations',       label:'สาขาของเรา',            description:'หน้าแผนที่สาขา',                      icon:'📍',  sections: simpleHero() },
  { slug:'contact',         label:'ติดต่อเรา',             description:'หน้าติดต่อ',                          icon:'📞',  sections: simpleHero() },
  { slug:'concierge',       label:'Surgery Concierge',     description:'หน้า MediCare Concierge',             icon:'🏥',  sections: simpleHero() },
  {
    slug: 'packages',
    label: 'แพ็กเกจสุขภาพ',
    description: 'หน้ารวมแพ็กเกจ — hero, promo bar, filter labels',
    icon: '📦',
    sections: [
      {
        key: 'hero',
        label: 'Page Hero',
        icon: '🎯',
        fields: [
          bi('pg_title', 'ชื่อหน้า (h1)'),
          bi('pg_desc',  'คำอธิบาย'),
        ],
      },
      {
        key: 'promo',
        label: 'Promo Bar (Health Pass)',
        icon: '🎟️',
        fields: [
          bi('promo_title', 'ชื่อ Promo'),
          bi('promo_sub',   'คำอธิบาย Promo'),
          bi('promo_btn',   'ปุ่ม Promo'),
        ],
      },
    ],
  },
];

const HOSPITAL_PAGES: PageDef[] = [
  { slug:'hospital-heart',     label:'MediThai หัวใจ',           description:'หน้าโรงพยาบาลเฉพาะทางโรคหัวใจ',        icon:'❤️',  sections: hospitalSections() },
  { slug:'hospital-bkk',       label:'MediThai กรุงเทพ',          description:'หน้าโรงพยาบาลสำนักงานใหญ่',             icon:'🏥',  sections: hospitalSections() },
  { slug:'hospital-cancer',    label:'MediThai มะเร็ง',            description:'หน้าโรงพยาบาลเฉพาะทางโรคมะเร็ง',       icon:'🎗️', sections: hospitalSections() },
  { slug:'hospital-spine',     label:'MediThai สมองและกระดูก',    description:'หน้าโรงพยาบาลเฉพาะทางระบบประสาท',      icon:'🧠',  sections: hospitalSections() },
  { slug:'hospital-children',  label:'MediThai เด็ก',              description:'หน้าโรงพยาบาลเด็กเฉพาะทาง',            icon:'👶',  sections: hospitalSections() },
  { slug:'hospital-chiangmai', label:'MediThai เชียงใหม่',         description:'หน้าโรงพยาบาลสาขาเชียงใหม่',           icon:'🌸',  sections: hospitalSections() },
];

export const CMS_PAGES_ALL = [...CMS_PAGES, ...OTHER_PAGES, ...HOSPITAL_PAGES];

// Quick lookup by slug
export const CMS_PAGE_MAP: Record<string, PageDef> =
  Object.fromEntries(CMS_PAGES_ALL.map(p => [p.slug, p]));
