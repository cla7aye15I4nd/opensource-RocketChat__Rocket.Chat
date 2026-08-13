import type { IMessage, MessageAttachment } from '@rocket.chat/core-typings';

import { useKeepMountedMessages } from './useKeepMountedMessages';

const date = new Date('2021-10-27T00:00:00.000Z');
const baseMessage: IMessage = {
	ts: date,
	u: {
		_id: 'userId',
		name: 'userName',
		username: 'userName',
	},
	msg: 'message',
	rid: 'roomId',
	_id: 'messageId',
	_updatedAt: date,
	urls: [],
};

it('should not keep mounted a plain message', () => {
	const messages: IMessage[] = [{ ...baseMessage }];
	expect(useKeepMountedMessages(messages)).toEqual([]);
});

it('should keep mounted a message with files', () => {
	const messages: IMessage[] = [{ ...baseMessage, files: [{ _id: 'fileId', name: 'file.png', type: 'image/png' }] }];
	expect(useKeepMountedMessages(messages)).toEqual([0]);
});

it('should keep mounted a message with a URL preview', () => {
	const messages: IMessage[] = [{ ...baseMessage, urls: [{ url: 'https://example.com', meta: { title: 'Example' } }] }];
	expect(useKeepMountedMessages(messages)).toEqual([0]);
});

it('should not keep mounted a message with a URL that has no preview metadata', () => {
	const messages: IMessage[] = [{ ...baseMessage, urls: [{ url: 'https://example.com' }] }];
	expect(useKeepMountedMessages(messages)).toEqual([]);
});

it('should keep mounted a message with a rich attachment from an app/integration (e.g. /giphy)', () => {
	const attachments: MessageAttachment[] = [{ title: 'GIPHY', image_url: 'https://media.giphy.com/foo.gif' }];
	const messages: IMessage[] = [{ ...baseMessage, attachments }];
	expect(useKeepMountedMessages(messages)).toEqual([0]);
});

it('should not keep mounted a message whose only attachment is a file attachment', () => {
	const attachments: MessageAttachment[] = [{ type: 'file', title: 'file.png' } as MessageAttachment];
	const messages: IMessage[] = [{ ...baseMessage, attachments }];
	expect(useKeepMountedMessages(messages)).toEqual([]);
});

it('should not keep mounted a message whose only attachment is a quote attachment', () => {
	const attachments: MessageAttachment[] = [
		{ author_name: 'someone', author_icon: 'icon', message_link: 'https://example.com/msg', text: 'quoted text' },
	];
	const messages: IMessage[] = [{ ...baseMessage, attachments }];
	expect(useKeepMountedMessages(messages)).toEqual([]);
});

it('should offset indexes by 1 when canPreview is true', () => {
	const attachments: MessageAttachment[] = [{ title: 'GIPHY', image_url: 'https://media.giphy.com/foo.gif' }];
	const messages: IMessage[] = [{ ...baseMessage }, { ...baseMessage, _id: 'messageId2', attachments }];
	expect(useKeepMountedMessages(messages, true)).toEqual([2]);
});
