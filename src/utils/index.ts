'use strict';

import _ from 'lodash';

type TGetInfoData = {
  fields: string[];
  object: object;
};
export const getInfoData = ({ fields = [], object = {} }: TGetInfoData) => {
  return _.pick(object, fields);
};
