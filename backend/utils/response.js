/**
 * Standardised API response helpers.
 * Usage: res.json(success({ token, user }))
 *        res.status(400).json(fail("Email is required."))
 *        res.status(200).json(paginate(rows, { page, limit, total }))
 */

/**
 * Successful response envelope.
 * @param {object} data   - payload to include
 * @param {string} message - optional human-readable message
 */
const success = (data = {}, message = null) => ({
  success: true,
  ...(message && { message }),
  ...data,
});

/**
 * Error / failure response envelope.
 * @param {string} message
 * @param {Array}  errors  - optional validation error array
 */
const fail = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
});

/**
 * Paginated list response envelope.
 * @param {Array}  data
 * @param {object} pagination - { page, limit, total }
 * @param {string} key        - name of the data array in the response (default: 'data')
 */
const paginate = (data, { page, limit, total }, key = "data") => ({
  success: true,
  [key]: data,
  pagination: {
    page:        Number(page),
    limit:       Number(limit),
    total:       Number(total),
    totalPages:  Math.ceil(total / limit),
  },
});

module.exports = { success, fail, paginate };