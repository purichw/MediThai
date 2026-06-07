import type { APIRoute } from 'astro';
import { createAdminSupabase } from '../../lib/supabase-server';

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { firstName, lastName, phone, email, idNumber, dob, patientType,
    insurance, serviceType, hospital, specialty, appointmentDate,
    appointmentTime, symptoms, medications, medicalHistory, userId } = body;

  if (!firstName || !lastName || !phone || !hospital || !specialty || !appointmentDate) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const appointmentNumber = `MTH-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`;

  const supabase = createAdminSupabase();
  const { error: dbError } = await supabase.from('appointments').insert({
    appointment_number: appointmentNumber,
    first_name: firstName,
    last_name: lastName,
    phone,
    email: email || null,
    id_number: idNumber || null,
    dob: dob || null,
    patient_type: patientType || 'new',
    insurance: insurance || null,
    service_type: serviceType || 'onsite',
    hospital,
    specialty,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime || null,
    symptoms: symptoms || null,
    medications: medications || null,
    medical_history: medicalHistory || null,
    status: 'pending',
    user_id: userId || null,
  });

  if (dbError) {
    console.error('DB insert error:', dbError.message);
    return new Response(JSON.stringify({ error: 'Failed to save appointment' }), { status: 500 });
  }

  // Send confirmation email if address provided
  if (email && import.meta.env.RESEND_API_KEY) {
    await sendConfirmationEmail({ email, firstName, lastName, hospital, specialty, appointmentDate, appointmentTime, appointmentNumber });
  }

  return new Response(JSON.stringify({ success: true, appointmentNumber }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

async function sendConfirmationEmail(data: {
  email: string; firstName: string; lastName: string;
  hospital: string; specialty: string;
  appointmentDate: string; appointmentTime: string | undefined;
  appointmentNumber: string;
}) {
  const { email, firstName, lastName, hospital, specialty, appointmentDate, appointmentTime, appointmentNumber } = data;

  const dateFormatted = new Date(appointmentDate).toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1B3A6B,#0891B2);padding:32px 40px;text-align:center">
          <div style="font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px">MediThai</div>
          <div style="font-size:13px;color:rgba(255,255,255,.7);margin-top:4px">Hospital Network</div>
        </td></tr>

        <!-- Success badge -->
        <tr><td style="padding:32px 40px 0;text-align:center">
          <div style="width:64px;height:64px;border-radius:50%;background:#DCFCE7;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:28px">✓</div>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#1B3A6B">นัดหมายสำเร็จแล้ว!</h1>
          <p style="color:#64748B;margin:8px 0 0;font-size:14px">ขอบคุณที่ไว้วางใจ MediThai คุณ${firstName} ${lastName}</p>
        </td></tr>

        <!-- Appointment details -->
        <tr><td style="padding:24px 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;overflow:hidden">
            <tr><td colspan="2" style="background:#1B3A6B;padding:12px 20px">
              <span style="color:#fff;font-weight:600;font-size:13px">รายละเอียดการนัดหมาย</span>
              <span style="color:#F59E0B;font-size:12px;float:right">${appointmentNumber}</span>
            </td></tr>
            ${[
              ['โรงพยาบาล', hospital],
              ['สาขาการแพทย์', specialty],
              ['วันที่', dateFormatted],
              ['เวลา', appointmentTime || 'จะแจ้งยืนยันภายหลัง'],
            ].map(([k, v]) => `
            <tr>
              <td style="padding:12px 20px;font-size:13px;color:#64748B;width:40%;border-bottom:1px solid #E2E8F0">${k}</td>
              <td style="padding:12px 20px;font-size:13px;color:#1E293B;font-weight:600;border-bottom:1px solid #E2E8F0">${v}</td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- Reminder -->
        <tr><td style="padding:0 40px 24px">
          <div style="background:#EFF6FF;border-radius:12px;padding:16px 20px;border-left:4px solid #0891B2">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1B3A6B">ข้อควรทราบก่อนมาพบแพทย์</p>
            <ul style="margin:0;padding-left:16px;font-size:13px;color:#475569;line-height:2">
              <li>กรุณามาก่อนเวลานัด 15–30 นาที</li>
              <li>นำบัตรประชาชนหรือหนังสือเดินทางมาด้วย</li>
              <li>หากต้องยกเลิกนัด กรุณาแจ้งล่วงหน้าอย่างน้อย 24 ชม.</li>
            </ul>
          </div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 32px;text-align:center">
          <a href="https://medithai-network.vercel.app/appointments" style="display:inline-block;background:#1B3A6B;color:#fff;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none">จัดการการนัดหมาย</a>
          <p style="margin:16px 0 0;font-size:12px;color:#94A3B8">สายด่วน: <strong style="color:#1B3A6B">1722</strong> · บริการ 24 ชั่วโมง</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:20px 40px;text-align:center;border-top:1px solid #E2E8F0">
          <p style="margin:0;font-size:11px;color:#94A3B8">© 2026 MediThai Hospital Network · <a href="https://medithai-network.vercel.app" style="color:#0891B2;text-decoration:none">medithai-network.vercel.app</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'MediThai <appointments@medithai.th>',
      to: email,
      subject: `ยืนยันการนัดหมาย ${appointmentNumber} | MediThai`,
      html,
    }),
  }).catch((err) => console.error('Email send failed:', err));
}
