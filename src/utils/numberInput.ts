/**
 * Utility xử lý nhập số an toàn cho các ô input trong hệ thống Admin:
 * 1. Tự động xóa số 0 vô nghĩa ở đầu (ví dụ: '020' -> 20, '05' -> 5, nhưng '0' đứng một mình vẫn là 0).
 * 2. Cho phép người dùng xóa trống ô (Backspace) để nhập số mới mà không bị dính số 0 cũ.
 * 3. Hỗ trợ cả số nguyên (isFloat = false) và số thực (isFloat = true) cũng như số âm.
 */

export function sanitizeNumberInput(val: string | number, isFloat = false): number | string {
  if (val === '' || val === undefined || val === null) return '';

  const str = String(val).trim();
  if (str === '') return '';
  if (str === '-') return '-';

  // Xóa số 0 thừa ở đầu nếu theo sau là chữ số khác: '020' -> '20', '-020' -> '-20'
  const cleaned = str.replace(/^(-?)0+(?=\d)/, '$1');

  if (isFloat) {
    // Nếu người dùng đang gõ dở dấu chấm hoặc '-0'
    if (cleaned.endsWith('.') || cleaned === '-0') return cleaned;
    const n = parseFloat(cleaned);
    return isNaN(n) ? '' : n;
  }

  if (cleaned === '-0') return '-0';

  const n = parseInt(cleaned, 10);
  return isNaN(n) ? '' : n;
}

/**
 * Chuẩn hóa giá trị số trước khi gửi payload lên Backend API (chuyển '' hoặc NaN thành fallback mặc định, ví dụ 0).
 */
export function normalizeNumberPayload(val: any, fallback = 0): number {
  if (val === '' || val === undefined || val === null) return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

/**
 * Tự động bôi đen toàn bộ giá trị khi click hoặc tab vào ô input số để người dùng nhập đè ngay lập tức.
 */
export function handleNumberFocus(e: React.FocusEvent<HTMLInputElement>): void {
  e.target.select();
}
