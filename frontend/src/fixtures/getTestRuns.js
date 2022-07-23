const getTestRunsResponse = {
  name: 'Get all boards',
  method: 'GET',
  url: 'https://trellific.corkboard.dev/api/boards',
  createdAt: '2022-07-19 01:37:40.658035',
  updatedAt: '2022-07-20 01:37:40.658035',
  regions: [
    { id: '1', name: 'usa', flagUrl: 'https://img.icons8.com/office/344/usa.png' },
    { id: '2', name: 'canada', flagUrl: 'https://img.icons8.com/office/344/canada.png' },
    { id: '3', name: 'sweden', flagUrl: 'https://img.icons8.com/office/344/sweden.png' },
  ],
  runs: [
    {
      id: '1', location: 'N. Virginia', region: { id: '1', name: 'usa', flagUrl: 'https://img.icons8.com/office/344/usa.png' }, status: '200', responseTimeMs: '773', assertions: '4', assertionsPassed: '4', success: true, createdAt: 'July 19 11:07:54',
    },
    {
      id: '2', location: 'N. Virginia', region: { id: '1', name: 'usa', flagUrl: 'https://img.icons8.com/office/344/usa.png' }, status: '404', responseTimeMs: '521', assertions: '4', assertionsPassed: '0', success: false, createdAt: 'July 19 10:05:94',
    },
    {
      id: '3', location: 'Montreal', region: { id: '2', name: 'canada', flagUrl: 'https://img.icons8.com/office/344/canada.png' }, status: '200', responseTimeMs: '209', assertions: '4', assertionsPassed: '4', success: true, createdAt: 'July 19 10:05:42',
    },
    {
      id: '4', location: 'Stockholm', region: { id: '3', name: 'sweden', flagUrl: 'https://img.icons8.com/office/344/sweden.png' }, status: '200', responseTimeMs: '688', assertions: '4', assertionsPassed: '4', success: true, createdAt: 'July 19 10:05:09',
    },
  ],
};

export default getTestRunsResponse;
