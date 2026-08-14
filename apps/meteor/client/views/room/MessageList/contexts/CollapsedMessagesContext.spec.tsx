import { act, renderHook } from '@testing-library/react';

import { useIsMessageCollapseToggled, useToggleMessageCollapse } from './CollapsedMessagesContext';

it('should not be toggled by default', () => {
	const { result } = renderHook(() => useIsMessageCollapseToggled('message-a'));
	expect(result.current).toBe(false);
});

it('should flip on toggle and flip back on a second toggle', () => {
	const { result: isToggled } = renderHook(() => useIsMessageCollapseToggled('message-b'));
	const { result: toggle } = renderHook(() => useToggleMessageCollapse('message-b'));

	expect(isToggled.current).toBe(false);

	act(() => toggle.current());
	expect(isToggled.current).toBe(true);

	act(() => toggle.current());
	expect(isToggled.current).toBe(false);
});

it('should keep the toggled state for a message id across unmount and remount', () => {
	const { result: toggle } = renderHook(() => useToggleMessageCollapse('message-c'));
	act(() => toggle.current());

	const { result, unmount } = renderHook(() => useIsMessageCollapseToggled('message-c'));
	expect(result.current).toBe(true);

	unmount();

	const { result: resultAfterRemount } = renderHook(() => useIsMessageCollapseToggled('message-c'));
	expect(resultAfterRemount.current).toBe(true);
});

it('should not leak the toggle to a different message id', () => {
	const { result: toggle } = renderHook(() => useToggleMessageCollapse('message-d'));
	act(() => toggle.current());

	const { result } = renderHook(() => useIsMessageCollapseToggled('message-e'));
	expect(result.current).toBe(false);
});

it('should be a no-op when the message id is undefined', () => {
	const { result: isToggled } = renderHook(() => useIsMessageCollapseToggled(undefined));
	const { result: toggle } = renderHook(() => useToggleMessageCollapse(undefined));

	act(() => toggle.current());

	expect(isToggled.current).toBe(false);
});
