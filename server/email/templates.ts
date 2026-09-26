type Locale = 'ka' | 'en'

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!)

function layout(title: string, content: string, preheader: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#070a12;color:#172033;font-family:Arial,'Noto Sans Georgian',sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070a12"><tr><td align="center" style="padding:28px 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px"><tr><td style="padding:18px 22px;color:#fff;font-size:22px;font-weight:700">Digital <span style="color:#5b7cff">Step</span></td></tr><tr><td style="background:#fff;border-radius:18px;padding:clamp(24px,6vw,42px)">${content}</td></tr><tr><td style="padding:22px;color:#8f9aaf;text-align:center;font-size:12px;line-height:1.6">© ${new Date().getUTCFullYear()} Digital Step · Security notification</td></tr></table></td></tr></table></body></html>`
}

export function subscriptionRequestTemplate(input:{name:string;email:string;currentPlan:string;requestedPlan:string;message?:string;timestamp:Date}){
  const subject=`Studio plan request — ${input.requestedPlan}`
  const rows=[['User',input.name],['Email',input.email],['Current plan',input.currentPlan],['Requested plan',input.requestedPlan],['Timestamp',input.timestamp.toISOString()]]
  const table=rows.map(([label,value])=>`<tr><td style="padding:8px;color:#667085">${escapeHtml(label)}</td><td style="padding:8px;font-weight:700">${escapeHtml(value)}</td></tr>`).join('')
  const note=input.message?`<h2 style="font-size:16px">Optional note</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(input.message)}</p>`:''
  const content=`<h1 style="margin:0 0 18px;font-size:25px;color:#111827">Digital Step Studio plan interest</h1><table role="presentation" width="100%" style="background:#f6f8fc;border-radius:12px;padding:10px">${table}</table>${note}`
  return {subject,html:layout(subject,content,'A customer requested a Studio plan.'),text:`${subject}\n\n${rows.map(row=>row.join(': ')).join('\n')}${input.message?`\n\nNote: ${input.message}`:''}`}
}

export function verificationTemplate(input: { firstName: string; code: string; ttlMinutes: number; locale: Locale }) {
  const ka = input.locale === 'ka'
  const subject = ka ? 'Digital Step — ელფოსტის დადასტურება' : 'Digital Step — Verify your email'
  const greeting = ka ? `გამარჯობა, ${input.firstName}` : `Hello, ${input.firstName}`
  const explanation = ka ? 'ელფოსტის დასადასტურებლად გამოიყენე ეს 6-ნიშნა კოდი:' : 'Use this 6-digit code to verify your email:'
  const expiry = ka ? `კოდი მოქმედებს ${input.ttlMinutes} წუთის განმავლობაში.` : `This code expires in ${input.ttlMinutes} minutes.`
  const security = ka ? 'თუ ეს ანგარიში შენ არ შეგიქმნია, წერილი უგულებელყავი.' : 'If you did not create this account, ignore this email.'
  const content = `<h1 style="margin:0 0 16px;font-size:26px;color:#111827">${escapeHtml(subject.replace('Digital Step — ', ''))}</h1><p style="font-size:16px;line-height:1.6">${escapeHtml(greeting)}</p><p style="font-size:16px;line-height:1.6">${escapeHtml(explanation)}</p><div style="margin:28px 0;padding:20px;border:1px solid #dce3ff;border-radius:14px;background:#f3f6ff;text-align:center;color:#243cff;font-size:34px;font-weight:700;letter-spacing:9px">${input.code}</div><p style="color:#526078;line-height:1.6">${escapeHtml(expiry)}</p><hr style="border:0;border-top:1px solid #e7eaf0;margin:25px 0"><p style="color:#6b7280;font-size:13px;line-height:1.6">${escapeHtml(security)}</p>`
  return { subject, html: layout(subject, content, explanation), text: `${greeting}\n\n${explanation}\n\n${input.code}\n\n${expiry}\n${security}` }
}

export function loginAlertTemplate(input: { firstName: string; occurredAt: Date; device: string; locale: Locale; securityUrl?: string }) {
  const ka = input.locale === 'ka'
  const subject = ka ? 'Digital Step — ახალი შესვლა' : 'Digital Step — New login'
  const title = ka ? 'ახალი შესვლა შენს ანგარიშზე' : 'Your account was just signed in'
  const advice = ka ? 'თუ ეს შენ არ იყავი, დაუყოვნებლივ შეცვალე პაროლი.' : "If this wasn't you, change your password immediately."
  const time = input.occurredAt.toISOString()
  const action = input.securityUrl ? `<p style="margin-top:28px"><a href="${escapeHtml(input.securityUrl)}" style="display:inline-block;background:#4f5bff;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:700">${ka ? 'უსაფრთხოების პარამეტრები' : 'Security settings'}</a></p>` : ''
  const content = `<h1 style="margin:0 0 18px;font-size:26px;color:#111827">${escapeHtml(title)}</h1><p style="line-height:1.6">${escapeHtml(ka ? `გამარჯობა, ${input.firstName}` : `Hello, ${input.firstName}`)}</p><table role="presentation" width="100%" style="margin:22px 0;background:#f6f8fc;border-radius:12px;padding:16px"><tr><td style="padding:7px;color:#667085">${ka ? 'დრო' : 'Time'}</td><td style="padding:7px">${time}</td></tr><tr><td style="padding:7px;color:#667085">${ka ? 'მოწყობილობა' : 'Device'}</td><td style="padding:7px;word-break:break-word">${escapeHtml(input.device)}</td></tr></table><p style="color:#b42318;line-height:1.6">${escapeHtml(advice)}</p>${action}`
  return { subject, html: layout(subject, content, title), text: `${title}\n\n${time}\n${input.device}\n\n${advice}${input.securityUrl ? `\n${input.securityUrl}` : ''}` }
}
