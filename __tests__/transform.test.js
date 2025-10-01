const { transformToAssessmentData } = require('../scripts/transform_lib');

test('transform calculates equipment counts and totals (happy path)', () => {
  const survey = {
    id: 'survey-1',
    title: 'Test Survey',
    elements: [
      { name: 'CAM-001', accessories: [{ manufacturer: 'Acme', model: 'A1', description: 'Camera', quantity: 2, price: 100, labor_hours: 1 }] },
      { name: 'CAM-002', accessories: [{ manufacturer: 'Acme', model: 'A2', description: 'Camera', quantity: 1, price: 150, labor_hours: 2 }] },
      { name: 'SENS-01', accessories: [] }
    ],
    modified_at: Math.floor(Date.now()/1000)
  };
  const site = { id: 'site-1', name: 'Test Site', city: 'Testville', state: 'TS' };

  const result = transformToAssessmentData(survey, site);
  expect(result.elementCount).toBe(3);
  expect(result.equipmentCounts['CAM']).toBe(2);
  expect(result.equipmentCounts['SENS']).toBe(1);
  expect(result.totalValue).toBeGreaterThanOrEqual(350);
});
