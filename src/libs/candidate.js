export const aliases = [
  'Bonnie Anderson',
  'Mr. Anderson',
  'Mrs. Anderson',
  'Angel Kitty',
  'Axel',
  'Babyface',
  'Barbie',
  'Barrel of Monkeys',
  'Battlesaurs',
  'Bensons',
  'Big Baby',
  'Billy\'s Toys',
  'Billy Gruff',
  'Bitey White',
  'Bizz Leapyear',
  'Bo Peep',
  'Bookworm',
  'Bullseye',
  'Buster',
  'Buttercup',
  'Buzz Lightyear'
]

export const getRandomAlias = (exclude = []) => {
  const validAlias = aliases.filter(a => exclude.indexOf(a) == -1)

  if (validAlias.length) {
    return validAlias[Math.floor(Math.random() * validAlias.length)]
  }

  return aliases[Math.floor(Math.random() * aliases.length)]
}
