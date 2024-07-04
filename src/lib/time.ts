import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import isoWeek from "dayjs/plugin/isoWeek"
import updateLocale from "dayjs/plugin/updateLocale"

import LocalizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/vi"
import "dayjs/locale/ru"
import "dayjs/locale/es"

dayjs.extend(relativeTime)
dayjs.extend(isoWeek)
dayjs.extend(LocalizedFormat)
dayjs.extend(updateLocale)
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mon",
    MM: "%dmon",
    y: "1yr",
    yy: "%dyr",
  },
})

export default dayjs
