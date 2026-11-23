import { InvalidFormatDataExecption } from '@/execptions/format.error';

export class PhoneNumber {
  constructor(private readonly phone: string) {
    this.validate();
  }

  getValue() {
    return this.phone;
  }
  private validate() {
    if (!this.phone) {
      throw new InvalidFormatDataExecption({
        item: 'PhoneNumber',
        message: 'Phone number is required',
      });
    }

    const phoneRegex = /^\+?[0-9]{9,15}$/;

    if (!phoneRegex.test(this.phone)) {
      throw new InvalidFormatDataExecption({
        item: 'PhoneNumber',
        message: 'Invalid phone number format',
      });
    }
  }
}
