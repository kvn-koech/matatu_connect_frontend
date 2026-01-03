/**
 * Formats a number into Kenyan Shillings (KES)
 * @param {number} amount - The numeric value to format
 * @param {boolean} showSymbol - Whether to include "KES" prefix
 */
export const formatKES = (amount, showSymbol = true) => {
  const formatter = new Intl.NumberFormat('en-KE', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'KES',
      minimumFractionDigits: 2,
  });

  return formatter.format(amount);
};