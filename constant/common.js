const ADMIN = {
    email: '',
    otpSubject: 'Eyewear OTP',
  };
  const DEFAULT_DISTANCE = 20;
  
  const ph_code = '+1';
  const zone = 'Asia/Kolkata';
  const email_validation_regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const numbers_validation_regex = /^[0-9]+$/;
  const fullname_regex = /^[a-z]+/g;

  const settings = {
    PER_PAGE_RECORDS: 6,
    PAGE_NO: 1,
    IS_EXPORT: 0,
    ORDER_BY: 'id-DESC',
    RETURN_DB_DATE_TIME_FORMAT: '%b %d, %Y %l:%i %p',
    RETURN_DB_DATE_FORMAT: '%D %M, %Y',
    FULL_DATE_FORMAT: '%D %M %Y',
    DEFAULT_VALUE: 'N/A',
    expiresIn: '28d',
  };
  
  const PASSWORD = {
    MIN: 6,
    MAX: 20,
    SALT_LENGTH:10
  };
  
  module.exports = {
    ADMIN,
    DEFAULT_DISTANCE,
    ph_code,
    email_validation_regex,
    numbers_validation_regex,
    fullname_regex,
    settings,
    PASSWORD,
    zone,
  };
  