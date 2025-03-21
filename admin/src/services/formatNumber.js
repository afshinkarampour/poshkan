const formatAndConvertToPersianNumber = (value) => {
  // Remove any non-digit characters (both Persian and English digits)
  const sanitizedInput = value.replace(/[^0-9۰-۹]/g, "");
  // Convert Persian digits to English digits for processing
  const englishDigits = sanitizedInput.replace(
    /[۰-۹]/g,
    (digit) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)]
  );
  // Add commas to the number
  const formattedEnglish = englishDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Convert English digits back to Persian digits
  return formattedEnglish.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
};

const converToSimpleEnglishNumber = (value) => {
  // Remove any non-digit characters (both Persian and English digits)
  const sanitizedInput = value.replace(/[^0-9۰-۹]/g, "");
  // Convert Persian digits to English digits for processing
  const englishDigits = sanitizedInput.replace(
    /[۰-۹]/g,
    (digit) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)]
  );
  return englishDigits;
};

export { formatAndConvertToPersianNumber, converToSimpleEnglishNumber };
