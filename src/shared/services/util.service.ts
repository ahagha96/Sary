import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  public toArray(array) {
    if (!array || Array.isArray(array)) {
      return array;
    }

    return [array];
  }

  public isMobileNumberValid(mobileNumber: string) {
    return /^(96{2}5)([013-9])(\d{7})$/.test(mobileNumber);
  }
}
