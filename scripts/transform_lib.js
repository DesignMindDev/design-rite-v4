// transform_lib.js
// Export a reusable transformToAssessmentData function so tests can import it.
function transformToAssessmentData(survey, site) {
  const equipmentCounts = {};
  const accessories = [];
  let totalLaborHours = 0;

  (survey.elements || []).forEach(element => {
    const name = element.name || element.element_name || 'Other';
    const typeName = String(name).split('-')[0] || 'Other';
    equipmentCounts[typeName] = (equipmentCounts[typeName] || 0) + 1;

    (element.accessories || []).forEach(acc => {
      const normalized = {
        id: acc.id || `acc-${Math.random().toString(36).slice(2,8)}`,
        manufacturer: acc.manufacturer || '',
        model: acc.model || '',
        description: acc.description || '',
        quantity: acc.quantity || 1,
        price: (acc.price === null || typeof acc.price === 'undefined') ? null : Number(acc.price),
        labor_hours: acc.labor_hours || 0,
        row_index: typeof acc.row_index === 'number' ? acc.row_index : accessories.length
      };
      accessories.push(normalized);
      totalLaborHours += normalized.labor_hours || 0;
    });
  });

  const totalValue = accessories.reduce((sum, acc) => sum + ((acc.price || 0) * (acc.quantity || 1)), 0);

  const location = (site && ((site.city || '') + (site.state ? ', ' + site.state : '') + (site.zip_code ? ' ' + site.zip_code : ''))) || 'Location not specified';

  return {
    projectName: survey.title || survey.id || 'Imported Survey',
    siteName: (site && site.name) || survey.site || 'Unknown Site',
    location: location || 'Location not specified',
    elementCount: (survey.elements || []).length,
    equipmentCounts,
    accessories,
    totalValue,
    totalLaborHours,
    surveyDate: new Date((survey.modified_at || Math.floor(Date.now()/1000)) * 1000).toISOString(),
    surveyId: survey.id || null,
    siteId: site && site.id ? site.id : (site && site.siteId) || null
  };
}

module.exports = { transformToAssessmentData };
