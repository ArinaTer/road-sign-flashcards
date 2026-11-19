import warning from '../content/groups/warning.json';
import priority from '../content/groups/priority.json';
import prohibitory from '../content/groups/prohibitory.json';
import mandatory from '../content/groups/mandatory.json';
import information from '../content/groups/information.json';
import service from '../content/groups/service.json';
import supplementary from '../content/groups/supplementary.json';
import vehicle from '../content/groups/vehicle.json';

const groupData = [warning, priority, prohibitory, mandatory, information, service, supplementary, vehicle];

export const groups = groupData.map(({id, title}) => ({id, title}));

export const catalog = groupData.flatMap(group => group.signs.map(({id, name, description}) => ({
  id,
  name,
  description,
  code: group.id === vehicle.id ? null : id,
  groupId: group.id,
  groupTitle: group.title,
  imageUrl: `${import.meta.env.BASE_URL}signs/${group.directory}/${id}.webp`,
})));
