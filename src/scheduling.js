export const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const result = (status,label) => ({status,label});
export function scheduleMatch(a,o) {
 if (!a.windows?.length || !a.startDate || !a.endDate || !a.hours) return result('unknown','Add your availability to check');
 if (o.format && a.format !== 'Either' && a.format !== o.format) return result('conflict','Work format conflicts with your preference');
 if (o.hours && Number(o.hours)>Number(a.hours)) return result('conflict','Exceeds your weekly hour limit');
 if (!o.startDate || !o.endDate) return o.negotiable ? result('flexible','Flexible scheduling—confirm with employer') : result('unknown','Schedule details needed—confirm with employer');
 if (o.startDate < a.startDate || o.endDate > a.endDate) return result('conflict','Opportunity dates fall outside your availability');
 if (o.negotiable) return result('flexible','Flexible scheduling—confirm with employer');
 if (!o.windows?.length || !o.hours || !o.format) return result('unknown','Schedule details needed—confirm with employer');
 const fits = o.windows.every(w=>a.windows.some(v=>v.day===w.day && v.start<=w.start && v.end>=w.end));
 return fits ? result('fits','Fits your stated availability') : result('conflict','Schedule conflict');
}
export function scheduleSummary(v) {
 return [v.startDate && v.endDate ? `${v.startDate} to ${v.endDate}` : 'Dates to confirm', ...(v.windows||[]).map(w=>`${w.day} ${w.start}–${w.end} ET`), v.hours ? `${v.hours} hours/week` : '', v.format || '', v.negotiable ? 'Negotiable' : ''].filter(Boolean).join(' · ');
}
