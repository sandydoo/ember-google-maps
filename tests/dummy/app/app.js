import AppPre from './app-pre-3.15';
import AppPost from './app-post-3.15';

import { gte } from 'ember-compatibility-helpers'

/**
 * TODO: 4.0
 * Besides using an older ember-resolver version, use the old syntax to create
 * the app. Newer non-octane v3.x apps don't seem to mind the new resolver style.
 * Remove after dropping v2.18 support.
 */
let AppExport = gte('3.15.0') ? AppPost : AppPre;

export default AppExport;
