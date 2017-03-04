import _ from 'underscore';
import w from '~/helpers/winston';
import Promise from 'bluebird';

const errors = {}
errors.MISSING_FIELD= new Error('MissingField')

/** Returns a function that resolves if all fields present,
    Rejects with "missingFields" array if any fields are missing
  */
export function rejectIfMissingFields(requiredFields) {
  return function(fields) {
    const missingFields =
      _.reduce(requiredFields, (memo, fieldName) => {
        return fields.hasOwnProperty(fieldName) ? memo : [...memo, fieldName];
      }, []);
    if(missingFields.length > 0) {
      w.debug('Missing Fields:', missingFields)
      return Promise.reject(errors.MISSING_FIELD);
    }
    return Promise.resolve(fields);
  };
}

/** Limits an dynogels call inputs to a subset, then returns the full set
    upon completion. Result fields should override original fields.
    if attrs field is lacking, just returns whatever the original return is
  */
export function dynogelsCallWith(dynogelsFn, fieldsList) {
  return function(fields) {
    const result = dynogelsFn(_.pick(fields, fieldsList))
      .then(function(dynogelsResult) {
        if(dynogelsResult && dynogelsResult.attrs) {
          return Promise.resolve({...fields, ...dynogelsResult.attrs});
        }
        return Promise.resolve(dynogelsResult);
      });
    return result;
  }
}
