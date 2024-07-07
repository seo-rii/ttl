import xlsx from "xlsx";
import * as fs from "fs";

function parseTime(times) {
    return (times || '').split(',').map(s => {
        s = s.trim();
        if (!s) return null;
        try {
            let date = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(s.slice(0, 3));
            if (date === -1) date = ['월', '화', '수', '목', '금', '토', '일'].indexOf(s.slice(0, 1))
            const sh = s && +s.split(' ')[1].split(':')[0];
            const sm = s && +s.split(' ')[1].split(':')[1].split('~')[0];
            const eh = s && +s.split(' ')[1].split(':')[1].split('~')[1].split(':')[0];
            const em = s && +s.split(' ')[1].split(':')[2];
            return {date, sh, sm, eh, em}
        } catch (e) {
            return null;
        }
    }).filter(x => x)
}

const workbook = xlsx.readFile('179_1.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = xlsx.utils.sheet_to_json(sheet);
const data = json.slice(2, 2 + 68).map(row => {
    const dept = 151;
    const type = row.__EMPTY || '';
    const code = row.__EMPTY_1 || '';
    const title = row.__EMPTY_7 || '';
    const group = (row.__EMPTY_6 || '').trim();
    const prof = (row.__EMPTY_10 || '').replaceAll('\r', '').replaceAll('\n', '').split(',').map(i => i.trim());
    const where = row.__EMPTY_19 || '';
    const time = parseTime(row.__EMPTY_15);
    const exam = [];
    const credit = +row.__EMPTY_9.split(':')[2] || 0;
    return {dept, type, code, title, group, prof, where, time, exam, credit};
})

fs.writeFileSync('mas.json', JSON.stringify(data, null, 4));