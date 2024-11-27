import xlsx from "xlsx";
import * as fs from "fs";

const other = JSON.parse(fs.readFileSync('static/other.json').toString());

const times = [
    [{date: 0, sh: 9, sm: 0, eh: 10, em: 30}, {date: 2, sh: 9, sm: 0, eh: 10, em: 30}],
    [{date: 0, sh: 10, sm: 30, eh: 12, em: 0}, {date: 2, sh: 10, sm: 30, eh: 12, em: 0}],
    [{date: 0, sh: 13, sm: 0, eh: 14, em: 30}, {date: 2, sh: 13, sm: 0, eh: 14, em: 30}],
    [{date: 0, sh: 14, sm: 30, eh: 16, em: 0}, {date: 2, sh: 14, sm: 30, eh: 16, em: 0}],
    [{date: 0, sh: 16, sm: 0, eh: 17, em: 30}, {date: 2, sh: 16, sm: 0, eh: 17, em: 30}],

    [{date: 1, sh: 9, sm: 0, eh: 10, em: 30}, {date: 3, sh: 9, sm: 0, eh: 10, em: 30}],
    [{date: 1, sh: 10, sm: 30, eh: 12, em: 0}, {date: 3, sh: 10, sm: 30, eh: 12, em: 0}],
    [{date: 1, sh: 13, sm: 0, eh: 14, em: 30}, {date: 3, sh: 13, sm: 0, eh: 14, em: 30}],
    [{date: 1, sh: 14, sm: 30, eh: 16, em: 0}, {date: 3, sh: 14, sm: 30, eh: 16, em: 0}],
    [{date: 1, sh: 16, sm: 0, eh: 17, em: 30}, {date: 3, sh: 16, sm: 0, eh: 17, em: 30}],
]

const addTimes = [
    [{date: 4, sh: 10, sm: 0, eh: 11, em: 0}],
    [{date: 4, sh: 11, sm: 0, eh: 12, em: 0}],
    [{date: 4, sh: 13, sm: 0, eh: 14, em: 0}],
    [{date: 4, sh: 14, sm: 0, eh: 15, em: 0}],
]

const add = fs.readFileSync('add.txt').toString().split('\n').map(i => i.trim());
const addRes = {};
let addC = 0;
for(const i of add) {
    if (i === '') {
        addC++;
    } else {
        const code = 'MAS' + i.slice(0, 3);
        const divs = i.slice(3).split('');
        for(const group of divs) 
            addRes[code + group] = addTimes[addC];
    }
}

const nm = fs.readFileSync('t.txt').toString().split('\n').map(i => i.trim());
const res = [];
let curr = [];
for(const i of nm) {
    if (i === '') {
        res.push(curr);
        curr = [];
    } else {
        curr.push(i);
    }
}
res.push(curr);

const dump = []
for(let i=0;i<res.length;i++) {
    for(const l of res[i]) {
        const r = l.split(',');
        const dept = 151;
        const type = '';
        const code = 'MAS' + r[0].slice(0, 3);
        const divs = r[0].slice(3).split('');
        const title = other[code]?.[0] || '';
        const prof = [r[1]];
        const where = r[2];
        const time = times[i];
        const exam = [];
        const credit = 3;
        const kcode = '';
        if(!divs.length) 
            dump.push({dept, type, code, title, group: '', prof, where, time, exam, credit, kcode})
        for(const group of divs) 
            {

                dump.push({dept, type, code, title, group, prof, where, time: [...time, ...(
                    addRes[code + group] || []
                )], exam, credit, kcode})
            }
    }

}

fs.writeFileSync('add_2025_1.json', JSON.stringify(dump, null, 4));
//return {dept, type, code, title, group, prof, where, time, exam, credit, kcode};