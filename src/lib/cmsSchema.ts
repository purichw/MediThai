// CMS schema — defines every editable page/section/field for the admin portal.
// Field keys match data-i18n keys in translations.js.
// Special keys: hero_bg_url (image), announce (html)

export type FieldType = 'text' | 'richtext' | 'image' | 'html' | 'number';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  bilingual: boolean;
  placeholder?: string;
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
const OTHER_PAGES: PageDef[] = [
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
