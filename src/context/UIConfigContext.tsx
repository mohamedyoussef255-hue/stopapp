import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CustomFormField, RewardCatalogItem, RewardsSystemConfig, RewardTier, UIConfig } from '../types';
import { DEFAULT_REWARDS_CONFIG, DEFAULT_UI_CONFIG } from '../utils/mockData';

interface UIConfigContextType {
  config: UIConfig;
  updateAppBranding: (title: string, subtitle: string, bannerNotice: string) => void;
  toggleFeature: (portal: 'worker' | 'hse' | 'gm', featureKey: string) => void;
  addCustomField: (field: Omit<CustomFormField, 'id'>) => void;
  removeCustomField: (id: string) => void;
  toggleCustomField: (id: string) => void;
  resetToDefaults: () => void;
  isSuperAdminModalOpen: boolean;
  setIsSuperAdminModalOpen: (open: boolean) => void;
  handleLogoClick: () => void;
  logoClicksRemaining: number;
  toggleRewardsVisibility: () => void;
  updateRewardsConfig: (updated: Partial<RewardsSystemConfig>) => void;
  updateRewardTier: (tierId: string, updated: Partial<RewardTier>) => void;
  toggleRewardItem: (itemId: string) => void;
  addRewardItem: (item: Omit<RewardCatalogItem, 'id'>) => void;
  deleteRewardItem: (itemId: string) => void;
  toggleSectionVisibility: (portal: 'worker' | 'hse' | 'gm', sectionId: string) => void;
  moveSectionOrder: (portal: 'worker' | 'hse' | 'gm', sectionId: string, direction: 'up' | 'down') => void;
  toggleHazardIconVisibility: (iconId: string) => void;
  moveHazardIconOrder: (iconId: string, direction: 'up' | 'down') => void;
  toggleFormFieldVisibility: (fieldId: string) => void;
  moveFormFieldOrder: (fieldId: string, direction: 'up' | 'down') => void;
  toggleActionIconVisibility: (iconId: string) => void;
  resetLayoutToDefault: () => void;
}

const UIConfigContext = createContext<UIConfigContextType | undefined>(undefined);

export const UIConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<UIConfig>(() => {
    const saved = localStorage.getItem('safetypulse_uiconfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_UI_CONFIG,
          ...parsed,
          rewardsConfig: {
            ...DEFAULT_REWARDS_CONFIG,
            ...(parsed.rewardsConfig || {})
          },
          pageSections: parsed.pageSections || DEFAULT_UI_CONFIG.pageSections,
          hazardIcons: parsed.hazardIcons || DEFAULT_UI_CONFIG.hazardIcons,
          formFields: parsed.formFields || DEFAULT_UI_CONFIG.formFields,
          actionIcons: parsed.actionIcons || DEFAULT_UI_CONFIG.actionIcons
        };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_UI_CONFIG;
  });

  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('safetypulse_uiconfig', JSON.stringify(config));
  }, [config]);

  // Easter Egg 5 clicks on App Logo within 2.5 seconds
  const handleLogoClick = () => {
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      setIsSuperAdminModalOpen(true);
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  const updateAppBranding = (title: string, subtitle: string, bannerNotice: string) => {
    setConfig(prev => ({
      ...prev,
      appTitle: title,
      appSubtitle: subtitle,
      noticeBanner: bannerNotice
    }));
  };

  const toggleFeature = (portal: 'worker' | 'hse' | 'gm', featureKey: string) => {
    setConfig(prev => {
      const portalFeatures = { ...prev.portalFeatures[portal] };
      if (featureKey in portalFeatures) {
        (portalFeatures as Record<string, boolean>)[featureKey] = !(portalFeatures as Record<string, boolean>)[featureKey];
      }
      return {
        ...prev,
        portalFeatures: {
          ...prev.portalFeatures,
          [portal]: portalFeatures
        }
      };
    });
  };

  const addCustomField = (field: Omit<CustomFormField, 'id'>) => {
    const newField: CustomFormField = {
      ...field,
      id: `field_custom_${Date.now()}`
    };
    setConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const removeCustomField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id)
    }));
  };

  const toggleCustomField = (id: string) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.map(f =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      )
    }));
  };

  const toggleRewardsVisibility = () => {
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        enabled: !prev.rewardsConfig.enabled
      },
      portalFeatures: {
        ...prev.portalFeatures,
        worker: {
          ...prev.portalFeatures.worker,
          gamification: !prev.rewardsConfig.enabled
        }
      }
    }));
  };

  const updateRewardsConfig = (updated: Partial<RewardsSystemConfig>) => {
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        ...updated
      }
    }));
  };

  const updateRewardTier = (tierId: string, updated: Partial<RewardTier>) => {
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        tiers: prev.rewardsConfig.tiers.map(tier =>
          tier.id === tierId ? { ...tier, ...updated } : tier
        )
      }
    }));
  };

  const toggleRewardItem = (itemId: string) => {
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        catalog: prev.rewardsConfig.catalog.map(item =>
          item.id === itemId ? { ...item, enabled: !item.enabled } : item
        )
      }
    }));
  };

  const addRewardItem = (item: Omit<RewardCatalogItem, 'id'>) => {
    const newItem: RewardCatalogItem = {
      ...item,
      id: `rew_${Date.now()}`
    };
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        catalog: [...prev.rewardsConfig.catalog, newItem]
      }
    }));
  };

  const deleteRewardItem = (itemId: string) => {
    setConfig(prev => ({
      ...prev,
      rewardsConfig: {
        ...prev.rewardsConfig,
        catalog: prev.rewardsConfig.catalog.filter(i => i.id !== itemId)
      }
    }));
  };

  const toggleSectionVisibility = (portal: 'worker' | 'hse' | 'gm', sectionId: string) => {
    setConfig(prev => {
      const currentList = prev.pageSections?.[portal] || DEFAULT_UI_CONFIG.pageSections[portal];
      const updated = currentList.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s);
      return {
        ...prev,
        pageSections: {
          ...prev.pageSections,
          [portal]: updated
        }
      };
    });
  };

  const moveSectionOrder = (portal: 'worker' | 'hse' | 'gm', sectionId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const currentList = [...(prev.pageSections?.[portal] || DEFAULT_UI_CONFIG.pageSections[portal])].sort((a, b) => a.order - b.order);
      const index = currentList.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentList.length) return prev;

      // Swap orders
      const tempOrder = currentList[index].order;
      currentList[index].order = currentList[targetIndex].order;
      currentList[targetIndex].order = tempOrder;

      return {
        ...prev,
        pageSections: {
          ...prev.pageSections,
          [portal]: currentList.sort((a, b) => a.order - b.order)
        }
      };
    });
  };

  const toggleHazardIconVisibility = (iconId: string) => {
    setConfig(prev => {
      const currentIcons = prev.hazardIcons || DEFAULT_UI_CONFIG.hazardIcons;
      return {
        ...prev,
        hazardIcons: currentIcons.map(ic => ic.id === iconId ? { ...ic, visible: !ic.visible } : ic)
      };
    });
  };

  const moveHazardIconOrder = (iconId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const currentIcons = [...(prev.hazardIcons || DEFAULT_UI_CONFIG.hazardIcons)].sort((a, b) => a.order - b.order);
      const index = currentIcons.findIndex(ic => ic.id === iconId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentIcons.length) return prev;

      const tempOrder = currentIcons[index].order;
      currentIcons[index].order = currentIcons[targetIndex].order;
      currentIcons[targetIndex].order = tempOrder;

      return {
        ...prev,
        hazardIcons: currentIcons.sort((a, b) => a.order - b.order)
      };
    });
  };

  const toggleFormFieldVisibility = (fieldId: string) => {
    setConfig(prev => {
      const currentFields = prev.formFields || DEFAULT_UI_CONFIG.formFields;
      return {
        ...prev,
        formFields: currentFields.map(f => f.id === fieldId ? { ...f, visible: !f.visible } : f)
      };
    });
  };

  const moveFormFieldOrder = (fieldId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const currentFields = [...(prev.formFields || DEFAULT_UI_CONFIG.formFields)].sort((a, b) => a.order - b.order);
      const index = currentFields.findIndex(f => f.id === fieldId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentFields.length) return prev;

      const tempOrder = currentFields[index].order;
      currentFields[index].order = currentFields[targetIndex].order;
      currentFields[targetIndex].order = tempOrder;

      return {
        ...prev,
        formFields: currentFields.sort((a, b) => a.order - b.order)
      };
    });
  };

  const toggleActionIconVisibility = (iconId: string) => {
    setConfig(prev => {
      const currentActionIcons = prev.actionIcons || DEFAULT_UI_CONFIG.actionIcons;
      return {
        ...prev,
        actionIcons: currentActionIcons.map(a => a.id === iconId ? { ...a, visible: !a.visible } : a)
      };
    });
  };

  const resetLayoutToDefault = () => {
    setConfig(prev => ({
      ...prev,
      pageSections: DEFAULT_UI_CONFIG.pageSections,
      hazardIcons: DEFAULT_UI_CONFIG.hazardIcons,
      formFields: DEFAULT_UI_CONFIG.formFields,
      actionIcons: DEFAULT_UI_CONFIG.actionIcons
    }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_UI_CONFIG);
  };

  return (
    <UIConfigContext.Provider
      value={{
        config,
        updateAppBranding,
        toggleFeature,
        addCustomField,
        removeCustomField,
        toggleCustomField,
        resetToDefaults,
        isSuperAdminModalOpen,
        setIsSuperAdminModalOpen,
        handleLogoClick,
        logoClicksRemaining: 5 - clickCount,
        toggleRewardsVisibility,
        updateRewardsConfig,
        updateRewardTier,
        toggleRewardItem,
        addRewardItem,
        deleteRewardItem,
        toggleSectionVisibility,
        moveSectionOrder,
        toggleHazardIconVisibility,
        moveHazardIconOrder,
        toggleFormFieldVisibility,
        moveFormFieldOrder,
        toggleActionIconVisibility,
        resetLayoutToDefault
      }}
    >
      {children}
    </UIConfigContext.Provider>
  );
};

export const useUIConfig = () => {
  const context = useContext(UIConfigContext);
  if (!context) {
    throw new Error('useUIConfig must be used within a UIConfigProvider');
  }
  return context;
};
