import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import isoWeek from 'dayjs/plugin/isoWeek';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/vi';
import 'dayjs/locale/ru';
import 'dayjs/locale/es';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);
dayjs.extend(LocalizedFormat);

export default dayjs;
