

express = require('express');
request = require('supertest');
axios = require('axios');
server = require('./api/search.js');



jest.mock('axios'); // Mockujeme axios

const app = express();
app.use('/', server);

describe('GET /api/search', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return 400 if query is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing query' });
  });

  it('should return a list of search results', async () => {
    const mockData = {
      data: {
        organic_results: [{ title: 'Test 1', link: 'https://example1.com' }, { title: 'Test 2', link: 'https://example2.com' }]
      }
    };
    axios.get.mockResolvedValueOnce(mockData);

    const res = await request(app).get('/api/search?q=multiple');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should handle errors from SerpAPI', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));

    const res = await request(app).get('/api/search?q=error');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Search failed');
  });
});
