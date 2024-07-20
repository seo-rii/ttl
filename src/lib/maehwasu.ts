export default class Maehwasu {
    department: {
        major: string,
        minor: string,
        doubleMajor: string,
        isAdvancedMajor: boolean,
        is_individually_designed: boolean,
    }
    admittedYear: number

    constructor(department: {
        major: string,
        minor: string,
        doubleMajor: string,
        isAdvancedMajor: boolean
        is_individually_designed: boolean,
    }, admittedYear: number) {
        this.department = department;
        this.admittedYear = admittedYear;
    }

    requiredMajorCredits() {
        const year = this.admittedYear || 2021;
        const major = this.department.major;
        const minor = this.department.minor;
        const doubleMajor = this.department.doubleMajor;
        const isAdvancedMajor = this.department.isAdvancedMajor;

        const dictMajorCredits: Record<string, [number, number]> = {};

        // 건설및환경공학과학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "CE") {
                dictMajorCredits["CE"] = [12, 45];
            }
            if (minor.includes("CE")) {
                dictMajorCredits["CE"] = [12, 21];
            }
            if (doubleMajor.includes("CE")) {
                dictMajorCredits["CE"] = [12, 40];
            }
        }
        if (year >= 2016) {
            if (major === "CE") {
                dictMajorCredits["CE"] = [12, 45];
                if (isAdvancedMajor) {
                    dictMajorCredits["CE"] = [12, 57];
                }
            }
            if (minor.includes("CE")) {
                dictMajorCredits["CE"] = [12, 18];
            }
            if (doubleMajor.includes("CE")) {
                dictMajorCredits["CE"] = [12, 40];
            }
        }

        // 기계공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "ME") {
                if (year <= 2012) {
                    dictMajorCredits["ME"] = [9, 49];
                } else {
                    dictMajorCredits["ME"] = [12, 59];
                }
            }
            if (minor.includes("ME")) {
                dictMajorCredits["ME"] = [9, 21];
            }
            if (doubleMajor.includes("ME")) {
                dictMajorCredits["ME"] = [12, 40];
            }
        }
        if (year >= 2016) {
            if (major === "ME") {
                dictMajorCredits["ME"] = [12, 48];
                if (isAdvancedMajor) {
                    dictMajorCredits["ME"] = [12, 63];
                }
            }
            if (minor.includes("ME")) {
                dictMajorCredits["ME"] = [6, 21];
            }
            if (doubleMajor.includes("ME")) {
                dictMajorCredits["ME"] = [12, 40];
            }
        }

        // 기술경영학부 전공과목 이수요건
        if (year <= 2015) {
            if (major === "MSB") {
                dictMajorCredits["MSB"] = [9, 42];
            }
            if (minor.includes("MSB")) {
                dictMajorCredits["MSB"] = [6, 18];
            }
            if (doubleMajor.includes("MSB")) {
                dictMajorCredits["MSB"] = [6, 40];
            }
        }
        if (year >= 2016) {
            if (major === "MSB") {
                dictMajorCredits["MSB"] = [9, 48];
            }
            if (minor.includes("MSB")) {
                dictMajorCredits["MSB"] = [6, 18];
            }
            if (doubleMajor.includes("MSB")) {
                dictMajorCredits["MSB"] = [6, 40];
            }
        }

        // 물리학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "PH") {
                dictMajorCredits["PH"] = [19, 40];
            }
            if (minor.includes("PH")) {
                dictMajorCredits["PH"] = [6, 19];
            }
            if (doubleMajor.includes("PH")) {
                dictMajorCredits["PH"] = [19, 40];
            }
        }
        if (year >= 2016) {
            if (major === "PH") {
                dictMajorCredits["PH"] = [19, 43];
                if (isAdvancedMajor) {
                    dictMajorCredits["PH"] = [19, 55];
                }
            }
            if (minor.includes("PH")) {
                dictMajorCredits["PH"] = [6, 18];
            }
            if (doubleMajor.includes("PH")) {
                dictMajorCredits["PH"] = [19, 40];
            }
        }

        // 바이오및뇌공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "BiS") {
                dictMajorCredits["BiS"] = [14, 42];
            }
            if (minor.includes("BiS")) {
                dictMajorCredits["BiS"] = [14, 18];
            }
            if (doubleMajor.includes("BiS")) {
                dictMajorCredits["BiS"] = [14, 40];
            }
        }
        if (year >= 2016) {
            if (major === "BiS") {
                dictMajorCredits["BiS"] = [14, 44];
                if (isAdvancedMajor) {
                    dictMajorCredits["BiS"] = [14, 56];
                }
            }
            if (minor.includes("BiS")) {
                dictMajorCredits["BiS"] = [14, 18];
            }
            if (doubleMajor.includes("BiS")) {
                dictMajorCredits["BiS"] = [14, 40];
            }
        }

        // 산업디자인학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "ID") {
                dictMajorCredits["ID"] = [27, 54];
            }
            if (minor.includes("ID")) {
                dictMajorCredits["ID"] = [9, 18];
            }
            if (doubleMajor.includes("ID")) {
                dictMajorCredits["ID"] = [27, 40];
            }
        }
        if (year >= 2016) {
            if (major === "ID") {
                dictMajorCredits["ID"] = [15, 45];
                if (isAdvancedMajor) {
                    dictMajorCredits["ID"] = [15, 57];
                }
            }
            if (minor.includes("ID")) {
                dictMajorCredits["ID"] = [9, 18];
            }
            if (doubleMajor.includes("ID")) {
                dictMajorCredits["ID"] = [15, 40];
            }
        }

        // 산업및시스템공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "IE") {
                dictMajorCredits["IE"] = [24, 51];
            }
            if (minor.includes("IE")) {
                dictMajorCredits["IE"] = [0, 18];
            }
            if (doubleMajor.includes("IE")) {
                dictMajorCredits["IE"] = [24, 40];
            }
        }
        if (year >= 2016) {
            if (major === "IE") {
                dictMajorCredits["IE"] = [24, 45];
                if (isAdvancedMajor) {
                    dictMajorCredits["IE"] = [24, 57];
                }
            }
            if (minor.includes("IE")) {
                dictMajorCredits["IE"] = [0, 18];
            }
            if (doubleMajor.includes("IE")) {
                dictMajorCredits["IE"] = [24, 40];
            }
        }

        // 생명과학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "BS") {
                dictMajorCredits["BS"] = [18, 48];
            }
            if (minor.includes("BS")) {
                dictMajorCredits["BS"] = [12, 21];
            }
            if (doubleMajor.includes("BS")) {
                dictMajorCredits["BS"] = [18, 40];
            }
        }
        if (year >= 2016) {
            if (major === "BS") {
                dictMajorCredits["BS"] = [18, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["BS"] = [18, 54];
                }
            }
            if (minor.includes("BS")) {
                dictMajorCredits["BS"] = [12, 21];
            }
            if (doubleMajor.includes("BS")) {
                dictMajorCredits["BS"] = [18, 40];
            }
        }

        // 생명화학공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "CBE") {
                dictMajorCredits["CBE"] = [21, 41];
                if (year <= 2013) {
                    dictMajorCredits["CBE"] = [18, 41];
                }
                if (year <= 2010) {
                    dictMajorCredits["CBE"] = [6, 41];
                }
            }
            if (minor.includes("CBE")) {
                if (year <= 2010) {
                    dictMajorCredits["CBE"] = [3, 18];
                } else {
                    dictMajorCredits["CBE"] = [9, 18];
                }
            }
            if (doubleMajor.includes("CBE")) {
                dictMajorCredits["CBE"] = [21, 41];
            }
        }
        if (year >= 2016) {
            if (major === "CBE") {
                dictMajorCredits["CBE"] = [21, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["CBE"] = [21, 54];
                }
            }
            if (minor.includes("CBE")) {
                dictMajorCredits["CBE"] = [9, 18];
            }
            if (doubleMajor.includes("CBE")) {
                dictMajorCredits["CBE"] = [21, 42];
            }
        }

        // 수리과학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "MAS") {
                dictMajorCredits["MAS"] = [0, 42];
            }
            if (minor.includes("MAS")) {
                dictMajorCredits["MAS"] = [0, 18];
            }
            if (doubleMajor.includes("MAS")) {
                dictMajorCredits["MAS"] = [0, 40];
            }
        }
        if (year >= 2016) {
            if (major === "MAS") {
                dictMajorCredits["MAS"] = [0, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["MAS"] = [0, 55];
                }
            }
            if (minor.includes("MAS")) {
                dictMajorCredits["MAS"] = [0, 18];
            }
            if (doubleMajor.includes("MAS")) {
                dictMajorCredits["MAS"] = [0, 40];
            }
        }

        // 신소재공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "MS") {
                dictMajorCredits["MS"] = [18, 42];
            }
            if (minor.includes("MS")) {
                dictMajorCredits["MS"] = [9, 18];
            }
            if (doubleMajor.includes("MS")) {
                dictMajorCredits["MS"] = [18, 40];
            }
        }
        if (year >= 2016) {
            if (major === "MS") {
                dictMajorCredits["MS"] = [18, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["MS"] = [18, 57];
                }
            }
            if (minor.includes("MS")) {
                dictMajorCredits["MS"] = [9, 18];
            }
            if (doubleMajor.includes("MS")) {
                dictMajorCredits["MS"] = [18, 40];
            }
        }

        // 원자력및양자공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "NQE") {
                dictMajorCredits["NQE"] = [25, 43];
            }
            if (minor.includes("NQE")) {
                dictMajorCredits["NQE"] = [15, 21];
            }
            if (doubleMajor.includes("NQE")) {
                dictMajorCredits["NQE"] = [25, 40];
            }
        }
        if (year >= 2016) {
            if (major === "NQE") {
                dictMajorCredits["NQE"] = [25, 43];
                if (isAdvancedMajor) {
                    dictMajorCredits["NQE"] = [25, 55];
                }
            }
            if (minor.includes("NQE")) {
                dictMajorCredits["NQE"] = [15, 21];
            }
            if (doubleMajor.includes("NQE")) {
                dictMajorCredits["NQE"] = [25, 40];
            }
        }

        // 융합인재학부 이수요건
        if (major === "TS") {
            dictMajorCredits["TS"] = [21, 42];
            if (isAdvancedMajor) {
                dictMajorCredits["TS"] = [21, 54];
            }
        }
        if (minor.includes("TS")) {
            dictMajorCredits["TS"] = [18, 18];
        }
        if (doubleMajor.includes("TS")) {
            dictMajorCredits["TS"] = [21, 42];
        }

        // 전기및전자공학부 전공과목 이수요건
        if (year <= 2015) {
            if (major === "EE") {
                dictMajorCredits["EE"] = [18, 53];
                if (doubleMajor + minor !== "") {
                    dictMajorCredits["EE"] = [18, 47];
                }
                if (year <= 2013) {
                    dictMajorCredits["EE"] = [18, 47];
                }
            }
            if (minor.includes("EE")) {
                dictMajorCredits["EE"] = [12, 21];
            }
            if (doubleMajor.includes("EE")) {
                dictMajorCredits["EE"] = [18, 40];
            }
        }
        if (year >= 2016) {
            if (major === "EE") {
                dictMajorCredits["EE"] = [18, 50];
                if (isAdvancedMajor) {
                    dictMajorCredits["EE"] = [18, 62];
                }
            }
            if (minor.includes("EE")) {
                dictMajorCredits["EE"] = [3, 21];
            }
            if (doubleMajor.includes("EE")) {
                dictMajorCredits["EE"] = [18, 40];
            }
        }
        if (year >= 2018) {
            if (major === "EE") {
                dictMajorCredits["EE"] = [15, 50];
                if (isAdvancedMajor) {
                    dictMajorCredits["EE"] = [15, 62];
                }
            }
            if (minor.includes("EE")) {
                dictMajorCredits["EE"] = [3, 21];
            }
            if (doubleMajor.includes("EE")) {
                dictMajorCredits["EE"] = [15, 40];
            }
        }

        // 전산학부 전공과목 이수요건
        if (year <= 2015) {
            if (major === "CS") {
                dictMajorCredits["CS"] = [19, 43];
            }
            if (minor.includes("CS")) {
                dictMajorCredits["CS"] = [15, 21];
            }
            if (doubleMajor.includes("CS")) {
                dictMajorCredits["CS"] = [19, 40];
            }
        }
        if (year >= 2016) {
            if (major === "CS") {
                dictMajorCredits["CS"] = [19, 49];
                if (isAdvancedMajor) {
                    dictMajorCredits["CS"] = [19, 61];
                }
            }
            if (minor.includes("CS")) {
                dictMajorCredits["CS"] = [15, 21];
            }
            if (doubleMajor.includes("CS")) {
                dictMajorCredits["CS"] = [19, 40];
            }
        }

        // 항공우주공학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "AE") {
                dictMajorCredits["AE"] = [19, 49];
            }
            if (minor.includes("AE")) {
                dictMajorCredits["AE"] = [12, 21];
            }
            if (doubleMajor.includes("AE")) {
                dictMajorCredits["AE"] = [19, 40];
            }
        }
        if (year >= 2016) {
            if (major === "AE") {
                dictMajorCredits["AE"] = [21, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["AE"] = [21, 60];
                }
            }
            if (minor.includes("AE")) {
                dictMajorCredits["AE"] = [9, 18];
            }
            if (doubleMajor.includes("AE")) {
                dictMajorCredits["AE"] = [21, 42];
            }
        }

        // 화학과 전공과목 이수요건
        if (year <= 2015) {
            if (major === "CH") {
                dictMajorCredits["CH"] = [24, 42];
                if (year <= 2011) {
                    dictMajorCredits["CH"] = [18, 42];
                }
                if (year <= 2010) {
                    dictMajorCredits["CH"] = [6, 42];
                }
            }
            if (minor.includes("CH")) {
                dictMajorCredits["CH"] = [12, 21];
            }
            if (doubleMajor.includes("CH")) {
                dictMajorCredits["CH"] = [24, 40];
            }
        }
        if (year >= 2016) {
            if (major === "CH") {
                dictMajorCredits["CH"] = [24, 42];
                if (isAdvancedMajor) {
                    dictMajorCredits["CH"] = [24, 54];
                }
            }
            if (minor.includes("CH")) {
                dictMajorCredits["CH"] = [12, 21];
            }
            if (doubleMajor.includes("CH")) {
                dictMajorCredits["CH"] = [24, 40];
            }
        }

        return dictMajorCredits;
    }

    requiredOtherCredits() {
        const doubleMajor = this.department.doubleMajor;

        let electiveBasic = 9;
        let research = 3;

        // 기초 선택 학점 이수 요건
        if (doubleMajor !== "") {
            if (["ME", "PH", "BiS", "MAS", "EE", "CS"].includes(this.department.major)) {
                electiveBasic = 3;
            } else {
                electiveBasic = 6;
            }
        }

        // 연구 학점 이수 요건
        if (doubleMajor !== "") {
            research = 0;
        } else {
            if (["MSB", "IE", "CBE"].includes(this.department.major)) {
                research = 4;
            } else if (["PH", "BiS"].includes(this.department.major)) {
                research = 5;
            }
        }

        const required_major_credits = this.requiredMajorCredits()
        const total_major = required_major_credits[this.department.major][1]
        let total_other_major = 0
        for (let key in required_major_credits) {
            if (key != this.department.major)
                total_other_major += required_major_credits[key][1]
            if (this.department.is_individually_designed)
                total_other_major += 12
        }

        let humanities = 21
        if (this.department.doubleMajor != "")
            humanities = 12

        return [electiveBasic, research, total_major, total_other_major, humanities]

    }

    requiredCredits() {
        const requiredOtherCredits = this.requiredOtherCredits();
        console.log(requiredOtherCredits)
        const mandatoryGeneral = 7;
        const mandatoryBasic = 23;
        const electiveBasic = requiredOtherCredits[0] || 0;
        const research = requiredOtherCredits[1] || 0;
        const major = requiredOtherCredits[2] || 0;
        const otherMajor = requiredOtherCredits[3] || 0;
        const humanities = requiredOtherCredits[4] || 0;

        let total = 130;
        if (this.admittedYear > 2015) {
            total = 136;
        }

        return {
            mandatoryGeneral,
            mandatoryBasic,
            electiveBasic,
            research,
            major,
            otherMajor,
            humanities,
            total,
            mandatoryAu: 8,
        };
    }

    completedCredits(courses: any[]) {
        let mandatoryGeneral = 0;
        let mandatoryAu = 0;
        let mandatoryBasic = 0;
        let electiveBasic = 0;
        let major = 0;
        let otherMajor = 0;
        let humanities = 0;
        let research = 0;
        let others = 0;
        let individualMajor = 0;
        let dictCompletedMajor = {} as any;
        let total = 0;

        const requiredMajorCredits = this.requiredMajorCredits();
        for (const key in requiredMajorCredits) {
            dictCompletedMajor[key] = [0, 0];
        }

        for (const course of courses) {
            if (course.title.includes("Co-op 2")) {
                others += 3;
                total += 3;
                continue;
            }
            if (course.title.includes("ISysE Co-op 1")) {
                continue;
            }
            if (course.title.includes("ME Co-op 1")) {
                others += 3;
                try {
                    dictCompletedMajor["ME"][1] += 3;
                } catch (error) {
                    total -= 3;
                }
                total += 6;
                continue;
            }
            if (course.title.includes("Co-op 1")) {
                others += 3;
                total += 3;
                continue;
            }

            if (course.au) {
                mandatoryAu += parseInt(course.au);
            } else if (course.type === '교양필수') {
                mandatoryGeneral += parseInt(course.credit);
                total += parseInt(course.credit);
            } else if (course.type === '기초필수') {
                mandatoryBasic += parseInt(course.credit);
                total += parseInt(course.credit);
            } else if (course.type === '기초선택') {
                electiveBasic += parseInt(course.credit);
                total += parseInt(course.credit);
            } else if (course.type === '인문사회선택') {
                humanities += parseInt(course.credit);
                total += parseInt(course.credit);
            } else if (course.type.includes('전공') || course.type.includes("석/박")) {
                let subjectType = course.type;
                let code = course.code;

                let isOther = true;
                for (const key in requiredMajorCredits) {
                    if (code.includes(key)) {
                        isOther = false;
                        if (key === this.department.major) {
                            if (subjectType.includes('필수')) {
                                dictCompletedMajor[key][0] += parseInt(course.credit);
                                dictCompletedMajor[key][1] += parseInt(course.credit);
                            } else {
                                dictCompletedMajor[key][1] += parseInt(course.credit);
                            }
                        } else {
                            if (subjectType.includes('필수')) {
                                dictCompletedMajor[key][0] += parseInt(course.credit);
                                dictCompletedMajor[key][1] += parseInt(course.credit);
                            } else {
                                dictCompletedMajor[key][1] += parseInt(course.credit);
                            }
                        }
                        total += parseInt(course.credit);
                    }
                }
                if (isOther) {
                    total += parseInt(course.credit);
                    others += parseInt(course.credit);
                }
            } else if (course.type.includes('연구') || course.type.includes("세미나")) {
                if (course.code.includes(this.department.major)) {
                    research += parseInt(course.credit);
                } else {
                    others += parseInt(course.credit);
                }
                total += parseInt(course.credit);
            } else {
                try {
                    others += parseInt(course.credit);
                    total += parseInt(course.credit);
                } catch (error) {
                    console.log('Unexpected non-integer credit in: ', course.title);
                }
            }
        }

        for (const key in dictCompletedMajor) {
            if (key === this.department.major) {
                major += dictCompletedMajor[key][1];
            } else {
                otherMajor += dictCompletedMajor[key][1];
            }
        }

        otherMajor += individualMajor;

        return {
            mandatoryGeneral,
            mandatoryAu,
            mandatoryBasic,
            electiveBasic,
            major,
            otherMajor,
            humanities,
            others,
            research,
            dictCompletedMajor,
            individualMajor,
            total
        };
    }
}

