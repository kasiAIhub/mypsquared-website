import jsPDFa from 'jspdf';
console.log('save:', typeof jsPDFa.prototype.save);
console.log('proto keys:', Object.keys(jsPDFa.prototype).slice(0,20));
const inst = new (jsPDFa as any)();
console.log('inst save:', typeof inst.save);
console.log('inst output:', typeof inst.output);
