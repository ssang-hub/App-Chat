import { toast } from 'react-toastify';

/**
 * @param {string} msg
 * @param {boolean} isSuccess
 * @param {object} option
 */
export const showNotification = (msg = '', isSuccess = true, option = {}) => {
  isSuccess ? toast.success(msg, { ...option }) : toast.error(msg, { ...option });
};
