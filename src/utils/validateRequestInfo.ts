import { validate } from 'class-validator';
import { BadRequestError } from '../core/error.response';

const isValidInfor = async (requestData: object) => {
  const errors = await validate(requestData);
  if (errors.length > 0) {
    const errorMessages = errors.map(error => Object.values(error.constraints)).join(', ');
    throw new BadRequestError(`${errorMessages}`);
  }
};

export default isValidInfor;
