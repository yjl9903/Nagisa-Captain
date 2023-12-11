import { inject, Ref } from 'vue';
import format from 'date-fns/format';

import captain from '~captain';

import type { Record, UpInfo } from './types';

export const data: Record[] = captain.data;
for (const r of data) {
  r.date = new Date(r.date);
}

export const up: UpInfo = captain.up;

// @ts-ignore
export const gift: { name: string } | undefined = captain.gift;

export const CURRENT = Symbol('current');

export function useCurrent(): Ref<Record> {
  return inject<Ref<Record>>(CURRENT)!;
}

export function findCurrent(year: number, month: number, day: number) {
  const d = `${year}-${month}-${day}`;
  for (const r of data) {
    if (d === format(r.date, 'yyyy-MM-dd') || d === format(r.date, 'yyyy-M-d')) {
      return r;
    }
  }
}

export const captainSet = new Map<
  number,
  { uid: number; username: string; length: number; days: Set<string>; months: Set<string> }
>();
for (const record of data) {
  for (const user of record.captains) {
    const month = format(record.date, 'yyyy-MM');
    const day = format(record.date, 'yyyy-M-d');
    if (captainSet.get(user.uid)) {
      captainSet.get(user.uid)!.length++;
      captainSet.get(user.uid)!.days.add(day);
      captainSet.get(user.uid)!.months.add(month);
    } else {
      captainSet.set(user.uid, {
        uid: user.uid,
        username: user.username,
        length: 1,
        days: new Set([day]),
        months: new Set([month])
      });
    }
  }
}
export const captains = [...captainSet.values()].sort((lhs, rhs) => rhs.length - lhs.length);
