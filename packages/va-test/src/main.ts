// TODO Move code from bds-docs/test-runner here
// TODO Make separate export for running code on virtual apis and writing incompatability.md

import { Context } from '@bedrock-apis/virtual-apis';

const CONTEXT = new Context();

CONTEXT.configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

import '@bedrock-apis/core-plugin';

import '../../../bds-docs/test-runner/suites/all';

import './compare';
