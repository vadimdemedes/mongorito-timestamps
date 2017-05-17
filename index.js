'use strict';

const {ActionTypes} = require('mongorito');

const defaultGetTimestamp = () => new Date();

module.exports = (options = {}) => {
	const {
		getTimestamp = defaultGetTimestamp,
		createdAt = 'created_at',
		updatedAt = 'updated_at'
	} = options;

	return () => {
		return ({model}) => next => action => {
			if (action.type === ActionTypes.SAVE) {
				const timestamp = getTimestamp();
				const {fields} = action;

				if (typeof action.fields[createdAt] === 'undefined') {
					fields[createdAt] = timestamp;
					model.set(createdAt, timestamp);
				}

				fields[updatedAt] = timestamp;
				model.set(updatedAt, timestamp);
			}

			return next(action);
		};
	};
};
