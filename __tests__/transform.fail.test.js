const { transformToAssessmentData } = require('../scripts/transform_lib');

// Intentionally failing test: expects CAM count 3 which is not true — will surface for CI/agents
test('intentional failure to surface issue to agent_log', () => {
  const survey = {
    id: 'survey-2',
    title: 'Failing Survey',
    elements: [
      { name: 'CAM-001', accessories: [] },
      { name: 'SENS-01', accessories: [] }
    ],
    modified_at: Math.floor(Date.now()/1000)
  };
  const site = { id: 'site-2', name: 'Fail Site' };
  const result = transformToAssessmentData(survey, site);
  // This will fail on purpose
  expect(result.equipmentCounts['CAM']).toBe(3);
});
