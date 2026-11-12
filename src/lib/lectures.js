/** @typedef {{code?: string, old?: string, group?: string, dept?: number | string, custom?: boolean, [key: string]: unknown}} Lecture */

/** @template {Lecture | null | undefined} T
 * @param {T} lecture
 */
export function lectureKey(lecture) {
    // Custom timetable entries have no catalog identity and remain independent.
    if (!lecture || lecture.custom || !lecture.code) return lecture;
    return JSON.stringify([lecture.code, lecture.group, lecture.dept]);
}

/** @param {Lecture | null | undefined} a
 * @param {Lecture | null | undefined} b
 */
export function sameLecture(a, b) {
    return lectureKey(a) === lectureKey(b);
}

/** @template {Lecture} T
 * @param {T[]} lectures
 */
export function uniqueLectures(lectures) {
    const seen = new Set();
    return lectures.filter(lecture => {
        const key = lectureKey(lecture);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/** @template {Lecture} T
 * @param {T[]} lectures
 * @param {T} lecture
 */
export function toggleLecture(lectures, lecture) {
    return lectures.some(item => sameLecture(item, lecture))
        ? lectures.filter(item => !sameLecture(item, lecture))
        : [...lectures, lecture];
}

/** @template {Lecture} T
 * @param {T[]} savedLectures
 * @param {T[]} catalog
 */
export function resolveLectures(savedLectures, catalog) {
    return uniqueLectures(savedLectures.map(saved => saved.custom ? saved : catalog.find(lecture =>
        (lecture.code === saved.code || lecture.old === saved.code)
        && lecture.group === saved.group
        // Older shared links contain only the course code and section.
        && (saved.dept == null || lecture.dept === saved.dept)
    )).filter(lecture => lecture !== undefined));
}
