import * as fs from 'fs';
import jspdfDefault from 'jspdf';
const inst = new (jspdfDefault as any)();
Object.getPrototypeOf(inst).save = function(name: string) {
  const buf = this.output('arraybuffer');
  fs.writeFileSync('/tmp/' + name, Buffer.from(buf));
  console.log('SAVED', name);
  return this;
};
const { default: jsPDF } = jspdfDefault as any ? { default: jspdfDefault } : await import('jspdf');
