export const fetcher = (...args) => fetch(args[0], args[1] ? args[1] : {}).then(async (res) => {
  let error = !res.ok;

  const text = await res.text();

  if (!text && !error) {
    return
  }

  let json;

  try {
    json = JSON.parse(text)
  } catch (error) {
    throw new Error('Server error.')
  }

  if (error && json.message) {
    throw new Error(json.message)
  }

  return json;
})

export const getCookie = name => {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}

export const employee2team = (employee) => {
  const links = [];

  const keys = Object.keys(employee.links);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    links.push({
      type: key,
      url: employee.links[key]
    })
  }

  if (employee.email) {
    links.push({
      type: 'mail',
      url: `mailto: ${employee.email}`
    })
  }

  return {
    id: employee.id,
    name: employee.name,
    position: employee.position,
    links,
    avatar: employee.images.length ? employee.images[0].src : null
  }
}

export const dot2obj = (obj) => {
  const result = {};

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split('.');

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      target = target[part] = target[part] || {};
    }

    // Set value at end of path
    target[parts[0]] = obj[objectPath]
  }

  return result;
}

export const localize = (val, locales = []) => {
  const obj = {}

  for (let i = 0; i < locales.length; i++) {
    obj[locales[i]] = val;
  }

  return obj;
}

export const dotAccessor = (obj, desc) => {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

export const page2menu = (page, locale = 'en') => ({
  id: page.id,
  title: page.title[locale],
  href: `/${page.name ? page.name[locale] : ''}`
})

export const trim = (str, chars) => {
    var start = 0,
        end = str.length;

    while(start < end && chars.indexOf(str[start]) >= 0)
        ++start;

    while(end > start && chars.indexOf(str[end - 1]) >= 0)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

export const snap2data = snap => {
  const items = []

  snap.forEach((item, i) => {
    const data = item.data()

    data.createdAt = data.createdAt && data.createdAt.seconds ? data.createdAt.seconds : data.createdAt;
    data.updatedAt = data.updatedAt && data.updatedAt.seconds ? data.updatedAt.seconds : data.updatedAt;
    data.id = item.id

    items.push(data)
  });

  return JSON.parse(JSON.stringify(items));
}

export const humanFileSize = (bytes, si=false, dp=1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

export const ctxError = (message, error) => {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'development') {
    console.error(error);
    return new Error(message);
  }

  return error;
}

export const calcScore = (votes = []) => {
  const v = votes.find(v => v.head)

  return votes.indexOf(v) + 1;
}

export const isImage = (file) => {
  return inExtension(file, ['jpg', 'png', 'gif', 'jpeg']);
}

export const inExtension = (file, list = []) => {
  const fe = ext(file).toLowerCase()

  return list.map(e => trim(e, '.').toLowerCase()).indexOf(fe) > -1
}

export const ext = (s) => {
  const result = /(?!^)\.([^./\\]+)$/.exec(s)
  return result ? result[1] : ''
}

export const calcFileBundleSizeBytes = (files = []) => {
  return files.reduce((sum, file) => sum + file.size, 0)
}

export const dateFromTs = ts => {
  const date = new Date(ts * 1000);

  const year = date.getFullYear();
  const month = date.toLocaleString('en-us',{ month:'short' })
  const day = `0${date.getDate()}`.slice(-2)

  return `${day} ${month} ${year}`
}

export const handleNext = id => {
  const nextEl = document.querySelector(`#${id}`)

  if (nextEl) {
    nextEl.scrollIntoView({
      behavior: 'smooth'
    })
  }
}

export const ucFirst = s => s ? `${s[0].toUpperCase()}${s.slice(1)}` : s

export const getSubtype = item => {
  return item.subtype || (item.criteria && item.criteria.type) || '';
}

export const createDummyVotes = rules => rules.map(rule => ({
  head: false,
  tail: rule.steps ? rule.steps.map(s => false) : []
}))

export const projectStageQuestionsReducer = (questions, stage) => {
  return [
    ...questions,
    ...(stage.questions ? stage.questions : [])
  ]
}

export const getTimeLabel = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h ? `${h} h ${m} min` : `${m} min`
}

export const fixFloat = (val, pr = 2) => Number.parseFloat(Number.parseFloat(val).toFixed(pr))

export const createSumReducer = (key) => (acc, curr) => acc + curr[key]

export const secondsToTimeLabel = (seconds, labels = ['h', 'm', 's']) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const hLabel = h ? `${h} ${labels[0]} ` : '';
  const mLabel = m ? `${m} ${labels[1]} ` : '';

  return `${hLabel}${mLabel}${s} ${labels[2]}`
}

export const nameSort = function(a, b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

  return 0;
}
export const scoreSort = function(ca, cb) {
  if (ca.score < cb.score) return 1;
  if (ca.score > cb.score) return -1;

  if (ca.candidate.name < cb.candidate.name) return -1;
  if (ca.candidate.name > cb.candidate.name) return 1;

  return 0;
}

export const buildSearchQuery = (params) => {
  return Object.keys(params).map(key => key + '=' + (params[key] === null ? '' : params[key])).join('&')
}