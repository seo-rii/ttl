import xlsx from 'xlsx';
import * as fs from 'fs';
import {fetch, Agent} from "undici";
import {writeFileSync} from 'fs';
import {sort} from "fast-sort";

const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ko-KR, ko',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Host': 'cais.kaist.ac.kr',
    'Origin': 'https://cais.kaist.ac.kr',
    'Referer': 'https://cais.kaist.ac.kr/totalOpeningCourse',
}

//fix dh key too small
const agent = new Agent({
    allowH2: true, connect: {
        rejectUnauthorized: false, ciphers: 'DEFAULT:@SECLEVEL=1',
    }
});

function parseTime(times) {
    return (times || '').split('\r\n').map(s => {
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

async function main(year = 2024, term = 3, file = `static/result_${year}_${term}.json`) {
    const body = `processType=excel&hid_sel_year=${year}&hid_sel_term=${term}&hid_dept_id=4879%2C3540%2C33%2C3799%2C8%2C4304%2C3728%2C3724%2C4562%2C5357%2C3517%2C4%2C3487%2C441%2C3895%2C4301%2C621%2C3844%2C3727%2C4201%2C977%2C2410%2C3596%2C973%2C5442%2C3990%2C4937%2C3689%2C3993%2C3486%2C3920%2C5123%2C98%2C3941%2C5356%2C4398%2C4303%2C4181%2C3919%2C4310%2C3560%2C3942%2C3558%2C210%2C4418%2C211%2C4417%2C3599%2C3716%2C4438%2C4302%2C4299%2C4335%2C4547%2C4548%2C4431%2C5204%2C3692%2C3484%2C4493%2C4264%2C5443%2C4311%2C4427%2C5294%2C5355%2C5015%2C3726%2C5296%2C5553%2C3520%2C5593%2C5358%2C0%2C4425%2C3539%2C4141%2C3485%2C110%2C3992%2C4200%2C5124%2C5554%2C3648%2C460%2C5278%2C5119%2C3548%2C5488%2C5259%2C970%2C936%2C4183%2C321%2C330%2C340%2C331%2C132%2C451%2C978%2C3725%2C3703%2C3499%2C151%2C140%2C141%2C976%2C421%2C911%2C912%2C3617%2C5441%2C979%2C3701%2C220%2C221%2C4014%2C4422%2C4724%2C4883%2C5064%2C142%2C3605%2C3521%2C2222%2C4305%2C3511%2C972%2C5489%2C3894%2C2044%2C4424%2C10%2C5366%2C3537%2C3559%2C920%2C100%2C3845%2C510%2C4423%2C531%2C980%2C3847%2C520%2C4421%2C532%2C4174%2C4312%2C3691%2C4306%2C3564%2C4094%2C933%2C931%2C4005%2C4144%2C2415%2C3723%2C3406%2C3997%2C5295%2C3846%2C4549%2C3978%2C3882%2C5122%2C3694%2C99%2C971%2C5365%2C611%2C4307%2C2710%2C934%2C440%2C981%2C4182%2C974%2C240%2C4419%2C212%2C3693%2C4420%2C450%2C150%2C2223&hid_subject_id=%25&sel_year=2024&sel_term=1&sel_dept=4879&sel_dept=3540&sel_dept=33&sel_dept=3799&sel_dept=8&sel_dept=4304&sel_dept=3728&sel_dept=3724&sel_dept=4562&sel_dept=5357&sel_dept=3517&sel_dept=4&sel_dept=3487&sel_dept=441&sel_dept=3895&sel_dept=4301&sel_dept=621&sel_dept=3844&sel_dept=3727&sel_dept=4201&sel_dept=977&sel_dept=2410&sel_dept=3596&sel_dept=973&sel_dept=5442&sel_dept=3990&sel_dept=4937&sel_dept=3689&sel_dept=3993&sel_dept=3486&sel_dept=3920&sel_dept=5123&sel_dept=98&sel_dept=3941&sel_dept=5356&sel_dept=4398&sel_dept=4303&sel_dept=4181&sel_dept=3919&sel_dept=4310&sel_dept=3560&sel_dept=3942&sel_dept=3558&sel_dept=210&sel_dept=4418&sel_dept=211&sel_dept=4417&sel_dept=3599&sel_dept=3716&sel_dept=4438&sel_dept=4302&sel_dept=4299&sel_dept=4335&sel_dept=4547&sel_dept=4548&sel_dept=4431&sel_dept=5204&sel_dept=3692&sel_dept=3484&sel_dept=4493&sel_dept=4264&sel_dept=5443&sel_dept=4311&sel_dept=4427&sel_dept=5294&sel_dept=5355&sel_dept=5015&sel_dept=3726&sel_dept=5296&sel_dept=5553&sel_dept=3520&sel_dept=5593&sel_dept=5358&sel_dept=0&sel_dept=4425&sel_dept=3539&sel_dept=4141&sel_dept=3485&sel_dept=110&sel_dept=3992&sel_dept=4200&sel_dept=5124&sel_dept=5554&sel_dept=3648&sel_dept=460&sel_dept=5278&sel_dept=5119&sel_dept=3548&sel_dept=5488&sel_dept=5259&sel_dept=970&sel_dept=936&sel_dept=4183&sel_dept=321&sel_dept=330&sel_dept=340&sel_dept=331&sel_dept=132&sel_dept=451&sel_dept=978&sel_dept=3725&sel_dept=3703&sel_dept=3499&sel_dept=151&sel_dept=140&sel_dept=141&sel_dept=976&sel_dept=421&sel_dept=911&sel_dept=912&sel_dept=3617&sel_dept=5441&sel_dept=979&sel_dept=3701&sel_dept=220&sel_dept=221&sel_dept=4014&sel_dept=4422&sel_dept=4724&sel_dept=4883&sel_dept=5064&sel_dept=142&sel_dept=3605&sel_dept=3521&sel_dept=2222&sel_dept=4305&sel_dept=3511&sel_dept=972&sel_dept=5489&sel_dept=3894&sel_dept=2044&sel_dept=4424&sel_dept=10&sel_dept=5366&sel_dept=3537&sel_dept=3559&sel_dept=920&sel_dept=100&sel_dept=3845&sel_dept=510&sel_dept=4423&sel_dept=531&sel_dept=980&sel_dept=3847&sel_dept=520&sel_dept=4421&sel_dept=532&sel_dept=4174&sel_dept=4312&sel_dept=3691&sel_dept=4306&sel_dept=3564&sel_dept=4094&sel_dept=933&sel_dept=931&sel_dept=4005&sel_dept=4144&sel_dept=2415&sel_dept=3723&sel_dept=3406&sel_dept=3997&sel_dept=5295&sel_dept=3846&sel_dept=4549&sel_dept=3978&sel_dept=3882&sel_dept=5122&sel_dept=3694&sel_dept=99&sel_dept=971&sel_dept=5365&sel_dept=611&sel_dept=4307&sel_dept=2710&sel_dept=934&sel_dept=440&sel_dept=981&sel_dept=4182&sel_dept=974&sel_dept=240&sel_dept=4419&sel_dept=212&sel_dept=3693&sel_dept=4420&sel_dept=450&sel_dept=150&sel_dept=2223&sel_course=%25&txt_old_no=&txt_sub_title=&txt_credit_from=&txt_credit_to=&sel_lang=A&txt_subject_no=&txt_prof=&txt_limitperson_from=&txt_limitperson_to=`

    const eng = await fetch('https://cais.kaist.ac.kr/?lang=ENG&menu=totalOpeningCourse', {
        dispatcher: agent, headers: defaultHeaders
    });
    let cookie = eng.headers.getSetCookie()[0].split(';')[0]
    await fetch('https://cais.kaist.ac.kr/?lang=KOR&menu=totalOpeningCourse', {
        dispatcher: agent, headers: {
            'Cookie': cookie, ...defaultHeaders,
        }
    })
    const xl = await fetch('https://cais.kaist.ac.kr/totalOpeningCourse', {
        body, method: 'POST', dispatcher: agent, headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookie, ...defaultHeaders,
        },
    }).then(res => res.arrayBuffer()).then(ab => xlsx.read(ab, {type: 'array'}))
    const sheet = xl.Sheets[xl.SheetNames[0]]
    const json = xlsx.utils.sheet_to_json(sheet, {raw: false})
    const data = json.slice(1).map(row => {
        const dept = +row.__EMPTY_21;
        const type = row.__EMPTY_2 || '';
        const code = row.__EMPTY_5 || '';
        const title = row.__EMPTY_8 || '';
        const group = (row.__EMPTY_7 || '').trim();
        const prof = (row.__EMPTY_12 || '').split(',').map(i => i.trim());
        const where = row.__EMPTY_18 || '';
        const time = parseTime(row.__EMPTY_17);
        const exam = parseTime(row.__EMPTY_19);
        const credit = +row.__EMPTY_11.split(':')[2] || 0;
        const kcode = row.__EMPTY_6;
        const au = +row.__EMPTY_10 || 0;

        return {dept, type, code, title, group, prof, where, time, exam, credit, kcode, au};
    }).filter(x => x)

    try {
        const addl = `./static/add_${year}_${term}.json`
        const add = fs.readFileSync(addl)
        const addJson = JSON.parse(add)
        data.push(...addJson)
    } catch (e) {
    }

    const deptMap = {"151": "수리과학과"};
    json.slice(1).map(row => {
        deptMap[row.__EMPTY_21] = row.__EMPTY_1
    })

    const res = {
        data, version: Date.now(), deptMap,
    }

    writeFileSync(file, JSON.stringify(res))
}

function other() {
    const fileNames = fs.readdirSync('static')
    const files = fileNames.filter(name => name.startsWith('result_')).map(name => {
        const li = name.split('_')
        return {year: +li[1], term: +li[2].split('.')[0], name}
    })
    const subjects = {}, titles = {}
    files.forEach(({year, term, name}) => {
        const data = fs.readFileSync(`static/${name}`)
        const json = JSON.parse(data)
        json.data.forEach(subject => {
            if (subject.code.includes('URP')) return
            if (!subjects[subject.code]) {
                subjects[subject.code] = ['', {}]
                titles[subject.code] = []
            }
            titles[subject.code].push(subject.title)

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
    writeFileSync('static/other.json', JSON.stringify(subjects))
}

for (let y = 2012; y <= 2024; y++) {
    for (let t = 1; t <= 4; t++) {
        main(y, t, `static/result_${y}_${t}.json`)
    }
}
// other()
// main().then(() => {
//     other()
//     console.log('done')
// })