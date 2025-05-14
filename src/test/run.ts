import { configure } from 'src/virtual-apis';

configure({
   GetterRequireValidBound: true,
   StrictReturnTypes: false,
});

import 'src/plugin/core/components';
import 'src/plugin/core/effects';
import 'src/plugin/core/events';
import 'src/plugin/core/inventory';
import 'src/plugin/core/modules';

import '../../bds-docs/test-runner/suites/all';

import './compare';
