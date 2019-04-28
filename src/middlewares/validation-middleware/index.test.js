const express = require('express');
const Joi = require('@hapi/joi');

const validate = require('./index');

const SCHEMA = Joi.object().keys({
    age: Joi.number.integer()
});

describe('given validate middleware is being called', () => {
    let app;
});
