const BASE_URL = 'http://localhost';
const DEFAULT_COLLECTOR = 'EVENTS';
const COLLECTOR_EVENTS_URL = 'http://localhost:5500/api/v2/computations';
const AGREEMENTS_URL = 'http://localhost:5400/api/v6/agreements';
const SCOPES_URL = 'http://host.docker.internal:5700/api/v1/scopes/development';

module.exports = {
  BASE_URL,
  DEFAULT_COLLECTOR,
  COLLECTOR_EVENTS_URL,
  AGREEMENTS_URL,
  SCOPES_URL
};

