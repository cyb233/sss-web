/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
export function validDate(date) {
  const dateReg = /^(19|20)\d{2}-(0?[0-9]|1[0-2])-[0-5]?[0-9] ([0-1]?[0-9]|2[0-4]):[0-5]?[0-9]:[0-5]?[0-9]$/
  return dateReg.test(date)
}
