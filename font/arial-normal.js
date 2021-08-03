import { jsPDF } from "jspdf"
var font = 'undefined';
var callAddFont = function () {
this.addFileToVFS('arial-normal.ttf', font);
this.addFont('arial-normal.ttf', 'arial', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
