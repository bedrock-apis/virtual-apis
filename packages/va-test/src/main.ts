// TODO Make separate export for running code on virtual apis and writing incompatability.md

import { Context } from '@bedrock-apis/virtual-apis';

Context.configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

import '@bedrock-apis/core-plugin';

import './suites/all';

import './run-compare';
