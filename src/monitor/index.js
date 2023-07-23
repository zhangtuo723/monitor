import { injectJsError } from './lib/jsError'
import { injectAjax } from './lib/ajax'
import { injectFetch } from './lib/fetch'
import { blankScreen } from './lib/blankScreen'
import { performentMonitor } from './lib/performent'
import { longTask } from './lib/longTask'
import { pv } from './lib/pv'
import { block } from './lib/block'
import {webrecord} from './lib/webrecord'

injectJsError()
injectAjax()
injectFetch()
blankScreen()
performentMonitor()
longTask()
pv()
block()
webrecord()


