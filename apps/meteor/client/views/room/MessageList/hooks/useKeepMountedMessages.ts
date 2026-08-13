import type { IMessage } from '@rocket.chat/core-typings';
import { isFileAttachment, isQuoteAttachment } from '@rocket.chat/core-typings';

export const useKeepMountedMessages = (messages: IMessage[], canPreview: boolean = false): number[] => {
	const offset = canPreview ? 1 : 0;
	return messages.reduce<number[]>((acc, message, index) => {
		// Keep mounted anything with an embed that reloads or resets local UI state when
		// re-mounted: file attachments (audio/video players), URL previews (e.g. YouTube
		// iframes), and rich attachments from apps/integrations (e.g. /giphy) that hold their
		// own collapse state via useCollapse. Otherwise virtua recycles them on scroll-to-bottom
		// (new message / reaction growing a message) and the iframe flickers, or the
		// collapsed/expanded state resets to the site default.
		const hasUrlPreview = message.urls?.some((url) => Object.keys(url.meta ?? {}).length > 0 || !!url.headers) ?? false;
		const hasCollapsibleAttachment =
			message.attachments?.some((attachment) => !isFileAttachment(attachment) && !isQuoteAttachment(attachment)) ?? false;
		if ((message.files?.length ?? 0) > 0 || hasUrlPreview || hasCollapsibleAttachment) {
			acc.push(index + offset);
		}
		return acc;
	}, []);
};
