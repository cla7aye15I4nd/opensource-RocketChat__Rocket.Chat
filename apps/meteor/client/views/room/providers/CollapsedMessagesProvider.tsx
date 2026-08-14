import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { CollapsedMessagesContext, collapseToggleStore } from '../MessageList/contexts/CollapsedMessagesContext';

export type CollapsedMessagesProviderProps = {
	children?: ReactNode;
};

export const CollapsedMessagesProvider = ({ children }: CollapsedMessagesProviderProps) => {
	const value = useMemo(() => ({ collapseToggleStore }), []);

	return <CollapsedMessagesContext.Provider value={value}>{children}</CollapsedMessagesContext.Provider>;
};
