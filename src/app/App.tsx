import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/sidebar';
import { ProjectsDashboard } from './components/projects-dashboard';
import { ProjectView } from './components/project-view';
import { EnhancedDashboard } from './components/enhanced-dashboard';
import { WriterProfilesView } from './components/writer-profiles-view';
import { EnhancedResourcesView } from './components/enhanced-resources-view';
import { TemplatesView } from './components/templates-view';
import { IntegrationsView } from './components/integrations-view';
import { SettingsView } from './components/settings-view';
import { ProfileView } from './components/profile-view';
import { SmartContentCreationModal } from './components/smart-content-creation-modal';
import { ProjectCreationModal } from './components/project-creation-modal';
import { ContentReview } from './components/content-review';
import { BrandGuidelinesManager } from './components/brand-guidelines-manager';
import { CalendarView } from './components/calendar-view';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [selectedContentType, setSelectedContentType] = useState<'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video'>('short-clip');

  const projects = [
    { id: 1, name: 'Nike Athletic Project' },
    { id: 2, name: 'Tech Startup Project' },
    { id: 3, name: 'Wellness Brand Project' },
    { id: 4, name: 'Fashion E-commerce Project' },
    { id: 5, name: 'Food & Beverage Project' },
    { id: 6, name: 'B2B SaaS Platform Project' },
    { id: 7, name: 'Amrit Yoga Project' },
  ];

  const handleCreateContent = (contentType: 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video') => {
    setSelectedContentType(contentType);
    setIsContentModalOpen(true);
  };

  const handleCreateProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'projects') setSelectedProjectId(null);
    setActiveTab(tab);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const handleContentModalClose = () => {
    setIsContentModalOpen(false);
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
  };

  const handleContentModalComplete = (config: any) => {
    setContentConfig(config);
    setIsContentModalOpen(false);
    setShowReview(true);
  };

  const handleProjectModalComplete = (project: any) => {
    console.log('Project created:', project);
    setIsProjectModalOpen(false);
  };

  const handleFinalize = () => {
    alert('Content exported successfully!');
    setShowReview(false);
    setContentConfig(null);
  };

  const renderContent = () => {
    if (showReview) {
      return (
        <>
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <ContentReview config={contentConfig} onFinalize={handleFinalize} />
        </>
      );
    }

    if (activeTab === 'projects' && selectedProjectId !== null) {
      const project = projects.find(p => p.id === selectedProjectId);
      return (
        <>
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <ProjectView
            projectId={selectedProjectId}
            projectName={project?.name || 'Unknown Project'}
            onBack={handleBackToProjects}
          />
        </>
      );
    }

    switch (activeTab) {
      case 'calendar':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <CalendarView />
          </>
        );
      case 'projects':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProjectsDashboard
              onProjectClick={handleProjectClick}
              onCreateProject={handleCreateProject}
            />
          </>
        );
      case 'dashboard':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <EnhancedDashboard
              onCreateContent={handleCreateContent}
              onCreateProject={handleCreateProject}
            />
          </>
        );
      case 'writer-profiles':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <WriterProfilesView />
          </>
        );
      case 'brand-kit':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <BrandGuidelinesManager />
          </>
        );
      case 'resources':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <EnhancedResourcesView />
          </>
        );
      case 'templates':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <TemplatesView />
          </>
        );
      case 'integrations':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <IntegrationsView />
          </>
        );
      case 'settings':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <SettingsView />
          </>
        );
      case 'profile':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProfileView />
          </>
        );
      default:
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProjectsDashboard
              onProjectClick={handleProjectClick}
              onCreateProject={handleCreateProject}
            />
          </>
        );
    }
  };

  return (
    <div className="size-full flex bg-background text-foreground">
      {renderContent()}

      <Toaster position="bottom-right" theme="dark" />

      <SmartContentCreationModal
        isOpen={isContentModalOpen}
        onClose={handleContentModalClose}
        onComplete={handleContentModalComplete}
        contentType={selectedContentType}
      />

      <ProjectCreationModal
        isOpen={isProjectModalOpen}
        onClose={handleProjectModalClose}
        onComplete={handleProjectModalComplete}
      />
    </div>
  );
}