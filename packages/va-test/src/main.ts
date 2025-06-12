// TODO Move code from bds-docs/test-runner here
// TODO Make separate export for running code on virtual apis and writing incompatability.md

import { Context } from '@bedrock-apis/virtual-apis';

Context.Configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

import '@bedrock-apis/core-plugin';

import '../../../bds-docs/test-runner/suites/all';

import './compare';
