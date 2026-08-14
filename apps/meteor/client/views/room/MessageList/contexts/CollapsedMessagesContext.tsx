import { Emitter } from '@rocket.chat/emitter';
import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

/**
 * Tracks which messages had their attachment collapse state manually toggled away from the
 * site default, keyed by message id. Kept as a plain Set so it works
 * regardless of whether "Collapse Embedded Media by Default" is on or off.
 */
export const collapseToggleStore = new (class CollapseToggleStore extends Emitter<{ [mid: string]: boolean }> {
	toggledMessages = new Set<string>();

	isToggled(mid: string): boolean {
		return this.toggledMessages.has(mid);
	}

	toggle(mid: string): void {
		if (this.toggledMessages.has(mid)) {
			this.toggledMessages.delete(mid);
			this.emit(mid, false);
			return;
		}

		this.toggledMessages.add(mid);
		this.emit(mid, true);
	}
})();

type CollapsedMessagesContextValue = {
	collapseToggleStore: typeof collapseToggleStore;
};

export const CollapsedMessagesContext = createContext<CollapsedMessagesContextValue>({
	collapseToggleStore,
});

export const useIsMessageCollapseToggled = (mid: string | undefined): boolean => {
	const { collapseToggleStore } = useContext(CollapsedMessagesContext);

	const subscribe = useCallback(
		(callback: () => void): (() => void) => {
			if (!mid) {
				return () => undefined;
			}
			return collapseToggleStore.on(mid, callback);
		},
		[collapseToggleStore, mid],
	);

	const getSnapshot = useCallback((): boolean => (mid ? collapseToggleStore.isToggled(mid) : false), [collapseToggleStore, mid]);

	return useSyncExternalStore(subscribe, getSnapshot);
};

export const useToggleMessageCollapse = (mid: string | undefined): (() => void) => {
	const { collapseToggleStore } = useContext(CollapsedMessagesContext);

	return useCallback(() => {
		if (!mid) {
			return;
		}
		collapseToggleStore.toggle(mid);
	}, [collapseToggleStore, mid]);
};
