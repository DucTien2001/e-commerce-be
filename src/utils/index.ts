'use strict';

import _ from 'lodash';

type TGetInfoData = {
  fields: string[];
  object: object;
};
export const getInfoData = ({ fields = [], object = {} }: TGetInfoData) => {
  return _.pick(object, fields);
};

// ['a', 'b'] => {a: 1, b: 1}
export const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] => {a: 0, b: 0}
export const unGetSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export const removeUndefinedObject = (obj: any) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

export const updateNestedObjectParser = (obj: any) => {
  const final: any = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((kRes) => {
        final[`${k}.${kRes}`] = response[kRes];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};
