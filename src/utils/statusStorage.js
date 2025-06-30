// utils/statusStorage.js
export const saveProjectStatuses = (projectData) => {
  if (!projectData?.project_documents) return;

  const statuses = {
    conception: getSectionStatus(projectData.project_documents.PROJECT_CONCEPT),
    technical: getSectionStatus(projectData.project_documents.PROJECT_TS),
    lbx: getSectionStatus(projectData.project_documents.PROJECT_EVALUATION_DOCUMENT),
    lastUpdated: new Date().toISOString()
  };

  sessionStorage.setItem('projectStatuses', JSON.stringify(statuses));
};

const getSectionStatus = (sectionDoc) => {
  if (!sectionDoc) return null;
  
  const lastAnswer = sectionDoc.answers?.[sectionDoc.answers.length - 1];
  return {
    status: lastAnswer?.type || sectionDoc.status || 'NEW',
    answer: lastAnswer?.answer || '',
    createdAt: lastAnswer?.created_at || sectionDoc.created_at || '',
    files: sectionDoc.documents?.map(doc => ({
      id: doc.id,
      name: doc.file?.name || 'Nomsiz fayl',
      url: doc.file?.url
    })) || []
  };
};

export const getProjectStatuses = () => {
  const stored = sessionStorage.getItem('projectStatuses');
  return stored ? JSON.parse(stored) : null;
};