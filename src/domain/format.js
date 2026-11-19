import countCopy from '../content/ui/card-count.json';

const dateFormat = new Intl.DateTimeFormat('ru', {dateStyle: 'long', timeStyle: 'short'});
const pluralRules = new Intl.PluralRules('ru');

export function formatMessage(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
}

export function cardCount(count) {
  return formatMessage(countCopy[pluralRules.select(count)], {count});
}

export function formatDate(timestamp) {
  return dateFormat.format(timestamp);
}
