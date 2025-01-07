import { browser } from "$app/environment";
import {derived, writable} from "svelte/store";
import ko from "./string/ko";
import en from "./string/en";

export const darkMode = writable(false);
export const locale = writable(browser ? (navigator.language.includes('ko') ? 'ko' : 'en') : 'ko');

export const str = {ko, en}