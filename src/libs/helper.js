export const fetcher = (...args) => fetch(args[0], args[1] ? args[1] : {}).then(async (res) => {
  let error = !res.ok;

  const text = await res.text();

  if (!text && !error) {
    return
  }

  try {
    const json = JSON.parse(text)

    if (error && json.message) {
      throw new Error(json.message)
    }

    return json;
  } catch (error) {
    throw new Error('Server error.')
  }
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
