import NodeCache from 'node-cache';

export default (stdTTL = 60) => new NodeCache({ stdTTL });
