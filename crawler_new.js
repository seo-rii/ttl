import * as fs from 'fs';
import {writeFileSync} from 'fs';
import {sort} from "fast-sort";

let work = ['2025_1', '2025_2', '2025_3']

if (false) {
    work = []
    for(let year = 2012;year<=2025;year++) {
        for(let term = 1;term<=4;term++) {
            work.push(`${year}_${term}`)
        }
    }
}

function parseTime(times) {
    return (times || '').split('\n').map(s => {
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

async function main(year = 2024, term = 4, lang = 'ko', file = `static/${lang}/result_${year}_${term}.json`) {
    const raw = Object.values(await fetch('https://erp.kaist.ac.kr/sch/sles/SlesseCtr/findAllEstblSubjtList.do', {
        body: `_menuId=MTI0ODU1MjEwNTgwMTA3ODAwMDA%3D&_menuNm=%EC%A0%84%EC%B2%B4%EA%B0%9C%EC%84%A4%EA%B5%90%EA%B3%BC%EB%AA%A9%EC%A1%B0%ED%9A%8C&_pgmId=NzU0MzkyMTUwMjY%3D&%40d1%23syy=${year}&%40d1%23smtDivCd=${term}&%40d1%23deptCd=806&%40d1%23lwprtInclsYn=1&%40d1%23subjtCrseDivCd=&%40d1%23subjcDivCd=%2C13%2C32%2C12%2C75%2C30%2C31%2C76%2C73%2C74%2C10%2C70%2C71%2C11%2C77%2C34%2C72%2C35%2C36%2C37%2C38%2C39%2C40%2C41%2C42%2C43%2C33%2C78%2C96%2C95%2C93%2C94%2C92%2C90%2C91%2CZM%2CZN%2CZQ%2CZR%2CZW%2CZJ%2CZV%2CZZ%2CZL%2CZS%2CZY%2CZX%2CZO%2CZP%2CZT%2CZU%2CZK&%40d1%23subjtNm=&%40d1%23fromCdt=&%40d1%23toCdt=&%40d1%23englSubjtYn=&%40d1%23subjtCd=&%40d1%23chrgNm=&%40d1%23fromAtnlcPercpCnt=&%40d1%23toAtnlcPercpCnt=&%40d%23=%40d1%23&%40d1%23=dmCond&%40d1%23tp=dm&`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': `locale=${lang}`
        }
    }).then(r => r.json()))[0]

    const data = raw.map(r => {
        const dept = +r.deprtCd
        const type = r.subjcDivNm
        const code = r.subjtCd
        const old = r.subjtNo
        const title = r.subjtNm
        const group = (r.corseDvclsNo || '').trim() || ''
        const prof = (r.chrgInstrNmLisup || '').split(',').map(p => p.trim())
        const where = r.lecrmNm
        const credit = r.cdt
        const kcode = r.osysCmptCd
        const au = r.actvtUnitHrs || 0
        const cap = r.atnlcPercpCnt || 0
        const reg = r.atnlcPcnt || 0
        const time = parseTime(r.lctreTm)
        const exam = parseTime(r.examTm)

        return {dept, type, code, old, title, group, prof, where, time, exam, credit, kcode, au, cap, reg}
    }).filter(x => x)

    try {
            const addl = `./static/${lang}/add_${year}_${term}.json`
            const add = fs.readFileSync(addl)
            const addJson = JSON.parse(add)
            data.push(...addJson)
        } catch (e) {
        }
    
    const deptMap = {"833": {ko: '수리과학과', en: 'Department of Mathematical Sciences'}[lang]};
    raw.forEach(r => deptMap[r.deprtCd] = r.deprtNm)

    const res = {
        data, version: Date.now(), deptMap,
    }

    writeFileSync(file, JSON.stringify(res))
}

function other(lang = 'ko') {
    const fileNames = fs.readdirSync(`static/${lang}`)
    const files = fileNames.filter(name => name.startsWith('result_')).map(name => {
        const li = name.split('_')
        return {year: +li[1], term: +li[2].split('.')[0], name}
    })
    const subjects = {}, titles = {}, oldMap = {}
    files.forEach(({year, term, name}) => {
        const data = fs.readFileSync(`static/${lang}/${name}`)
        const json = JSON.parse(data)
        json.data.forEach(subject => {
            if (subject.code.includes('URP')) return
            if (!subjects[subject.code]) {
                subjects[subject.code] = ['', {}]
                titles[subject.code] = []
            }
            titles[subject.code].push(subject.title)
            oldMap[subject.old] = subject.code

            const key = ((year - 2000) * 10 + term) + ''
            if (!subjects[subject.code][1][key]) subjects[subject.code][1][key] = []
            subjects[subject.code][1][key].push([subject.group, subject.prof.length === 1 ? subject.prof[0] : subject.prof, subject.title])
        })
    })

    const ignoreSets = ['졸업연구', '개별연구', 'URP', '논문연구'];
    for (const code in subjects) {
        const titleCnt = titles[code].reduce((obj, item) => {
            obj[item] = (obj[item] || 0) + 1
            return obj
        }, {})

        const title = Object.keys(titleCnt).sort((a, b) => titleCnt[b] - titleCnt[a])[0]
        if (ignoreSets.some(ignore => title.includes(ignore))) {
            delete subjects[code]
            continue
        }
        subjects[code][0] = title

        const li = []
        for (const key in subjects[code][1]) {
            for (const s of subjects[code][1][key]) {
                if (s[2] === title) s.pop()
            }
            li.push([+key, subjects[code][1][key]])
        }
        subjects[code][1] = sort(li).desc(['0'])
    }
    writeFileSync(`static/${lang}/other.json`, JSON.stringify(subjects))
    writeFileSync(`static/${lang}/oldmap.json`, JSON.stringify(oldMap))
}

Promise.all(work.map(w => {
    const li = w.split('_')
    return [main(+li[0], +li[1], 'ko'), main(+li[0], +li[1], 'en')]
}).flat()).then(() => {
    other('ko')
    other('en')
    console.log('done')
})