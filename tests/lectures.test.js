import assert from 'node:assert/strict';
import test from 'node:test';
import {lectureKey, resolveLectures, sameLecture, toggleLecture, uniqueLectures} from '../src/lib/lectures.js';

const lecture = {code: 'MAS.10001', old: 'MAS101', group: 'A', dept: 833, title: '미적분학 I', cap: 80};

test('a refreshed or translated course retains its identity', () => {
    const refreshed = {...lecture, title: 'Calculus I', cap: 100};
    assert.ok(sameLecture(lecture, refreshed));
    assert.equal(lectureKey(lecture), lectureKey(refreshed));
});

test('different sections and departments remain independently selectable', () => {
    const otherSection = {...lecture, group: 'B'};
    const otherDepartment = {...lecture, dept: 21245};
    assert.equal(sameLecture(lecture, otherSection), false);
    assert.equal(sameLecture(lecture, otherDepartment), false);
    assert.deepEqual(uniqueLectures([lecture, otherSection, otherDepartment]), [lecture, otherSection, otherDepartment]);
    assert.deepEqual(toggleLecture([lecture], otherSection), [lecture, otherSection]);
});

test('favorite, selected, and catalog copies render as one course with the first record preserved', () => {
    const favorite = {...lecture};
    const selected = {...lecture};
    assert.deepEqual(uniqueLectures([favorite, selected, lecture]), [favorite]);
});

test('supplemental catalog records do not replace the authoritative course', () => {
    const supplemental = {...lecture, cap: 0};
    assert.deepEqual(uniqueLectures([lecture, supplemental]), [lecture]);
});

test('clicking a new object for a selected course deselects it and clears existing duplicates', () => {
    const selected = [lecture, {...lecture}];
    assert.deepEqual(toggleLecture(selected, {...lecture}), []);
    assert.equal(selected.length, 2, 'toggle must not mutate the previous selection');
});

test('custom entries and records without a course code retain object identity', () => {
    const custom = {custom: true, title: 'Study'};
    const anotherCustom = {...custom};
    const unknown = {title: 'Unidentified'};
    assert.deepEqual(uniqueLectures([custom, anotherCustom, custom, unknown, {...unknown}]), [custom, anotherCustom, unknown, {...unknown}]);
    assert.deepEqual(toggleLecture([custom, anotherCustom], custom), [anotherCustom]);
});

test('restoring saved duplicates and old course codes selects the fresh catalog course once', () => {
    const saved = [{...lecture, cap: 0}, {code: 'MAS101', group: 'A'}, {...lecture}];
    const restored = resolveLectures(saved, [lecture]);
    assert.deepEqual(restored, [lecture]);
    assert.equal(restored[0], lecture);
});

test('saved department identity disambiguates courses while old shared links still resolve', () => {
    const first = {code: 'BIZ.94303', group: 'A', dept: 21245};
    const second = {...first, dept: 21246};
    assert.deepEqual(resolveLectures([{...second}], [first, second]), [second]);
    assert.deepEqual(resolveLectures([{code: first.code, group: 'A'}], [first, second]), [first]);
    assert.deepEqual(resolveLectures([{...second}], [first]), []);
});

test('restoring a selection keeps custom entries and drops unavailable catalog courses', () => {
    const custom = {custom: true, title: 'Study'};
    assert.deepEqual(resolveLectures([custom, {...lecture, code: 'missing'}], [lecture]), [custom]);
});
